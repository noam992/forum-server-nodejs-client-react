import React,{ Component } from "react";
import "../forum.css";
import { CommentModel } from "../model-forum/model-comment";
import { ClusterModel } from "../model-forum/model-cluster";
import { store } from "../redux-forum/store";
import { ActionType } from "../redux-forum/action-type";
import axios from "axios";
import io from "socket.io-client"; // npm i socket.io

interface CommentProps {
    clusterIndex: number
}

interface CommentState {
    comment: CommentModel;
    comments: CommentModel[];
    cluster: ClusterModel;
    clusters: ClusterModel[];
    errors: { 
        replyError: string,
        commentError: string
    }
    addComment: number;
    valueSocketNum: number;
    replyIsOpen: number;
    colorBtn: boolean;
    message: string;
    allMessages: string[];

}

export class Comments extends Component<CommentProps, CommentState> {

    private domButton: HTMLButtonElement
    private socket = io.connect("http://localhost:3001"); // Server Address.
    private textBoxRef: React.RefObject<HTMLInputElement>;

    public constructor(props: CommentProps){
        super(props);
        this.state = {
            comment: new CommentModel(),
            comments: [],
            cluster: new ClusterModel(),
            clusters: store.getState().clusters,
            errors: {
                replyError: "*",
                commentError: "*",
            },
            addComment: null,
            valueSocketNum: null,
            replyIsOpen: null,
            colorBtn: false,
            message: "",
            allMessages: []

        };

        this.textBoxRef = React.createRef();

        this.socket.on("msg-from-server", (msg :string) => {
            const allMessages = [...this.state.allMessages];
            allMessages.push(msg);
            this.setState({ allMessages });
        });

    };

    /* Get all comments that relevant to current cluster */
    public componentDidMount = async () => {

        // Check status btn if is turn on/off
        const allCookies = document.cookie.split("; "); // ["statusLikeBtn3=true", "statusLikeBtn2=true"]
        for(const oneCookie of allCookies) {
            const pairArr = oneCookie.split("="); // ["statusLikeBtn-4", "true"]

            const checkBtn = pairArr[0].split("-"); // ["statusLikeBtn", "4"]
            if (parseInt(checkBtn[1]) === this.props.clusterIndex) { // check match cluster to button that already turn on   
                
                this.domButton.style.backgroundColor = "blue"
                this.setState({
                    colorBtn: true
                });
               
            }
        }

        try {

            const response = await axios.get<CommentModel[]>(`http://localhost:3002/api/forum/cluster/${this.props.clusterIndex}/comment`)

            this.setState({
                comments: response.data
            });

        } catch (err) {

            alert("Error: " + err.message)
            
        }
         
    }

    // Stop listening to changes in Store
    public componentWillUnmount(): void {
        
    }

    /* Add new comment // one function is open collapse and second is send request to add comment to server */
    private collapseAddComment = async (index: any, e: any) => {
        this.setState({
            addComment: this.state.addComment === index ? null : index
        });

    }

    /* Validation and update value of new comment to current cluster */
    public sendMessage = async () => {
        const commentText = this.state.message;
        let commentError = ""

        if (commentText === "") {
            commentError = "Miss comment"
            const errors = { ...this.state.errors };
            errors.commentError= commentError;
            this.setState({ errors });
            return
        }

        if (commentText.length > 500) {
            commentError = "500 limit characters at one comment"
            const errors = { ...this.state.errors };
            errors.commentError= commentError;
            this.setState({ errors });
            return
        }

        const comment = { ...this.state.comment }

        // Add to any new cluster initial values
        comment.commentText = commentText
        comment.numLike = 0
        if (comment.userWriter === undefined) {
            comment.userWriter = 4
        }

        this.setState({ comment });

        this.socket.emit("msg-from-client", this.state.message);
        this.setState({ message: "" });
        this.textBoxRef.current.focus();

        // Post new comment to data
        try {
            console.log(comment)
            const response = await axios.post<CommentModel>(`http://localhost:3002/api/forum/cluster/${this.props.clusterIndex}/comment`, comment)
            const addedComment = response.data
            console.log(addedComment)
        } catch (err) {
            alert("Error: " + err.message)
        }


    }


    /* Add like to current cluster */
    private addLike = async (event: any) => {

        const valueBtn = event.target.value
        const cluster = { ...this.state.cluster }

        const date = new Date(); // Get current date and time.
        date.setFullYear(date.getFullYear() + 1);

        // Switch color "Like" btn - btn is turn on/off
        // Add value to cookie  
        switch (this.state.colorBtn) {
            case false:
                event.target.style.backgroundColor = "blue"
                this.setState({
                    colorBtn: true
                });
                cluster.numLike = 1
                document.cookie = `statusLikeBtn-${valueBtn}=true; expires=${date.toUTCString()}`;
                break;

            case true:
                event.target.style.backgroundColor = "gray"
                this.setState({
                    colorBtn: false
                });
                cluster.numLike = 0
                document.cookie = `statusLikeBtn-${valueBtn}` + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                break;
        
            default:
                break;
        }

        this.setState({cluster});

        
        try {
            const response = await axios.patch<ClusterModel>(`http://localhost:3002/api/forum/cluster/${valueBtn}`, cluster)
            const updateCluster = response.data

            store.dispatch({ type: ActionType.UpdateCluster, payload: updateCluster })
            //בתצוגה עצמה store הרכיב לא מאזין לשינויים ולכן לא נראה את השינוי שעשינו ב
        } catch (err) {
            alert("Error: " + err.message)
        }

    }


    public render () {
        let index = 0;
        return (
            <div className="forum">

                <div className="comment-buttons">
                    <button onClick={this.collapseAddComment.bind(this, this.props.clusterIndex)}>
                        Press to add comment
                    </button>
                    <button ref={domObject => this.domButton = domObject} value={this.props.clusterIndex} 
                            onClick={this.addLike}>like
                    </button>
                </div>

                {this.state.addComment &&

                    <div className="add-comment-column">
                        <div>
                            <input type="text"
                                ref={this.textBoxRef}
                                onChange={e => this.setState({ message: e.target.value })}
                                value={this.state.message}
                                onKeyDown={e => { if (e.keyCode === 13) this.sendMessage() }}
                                placeholder="Message..." autoFocus 
                            />
                            <span>{this.state.errors.commentError}</span>
                        </div>
                        <div><button onClick={this.sendMessage}>Send</button></div>
                    </div>

                }

                <div className="content-comment-text">

                    {this.state.allMessages.map( m =>  

                        <div key={index++} className="comments">
                            <div className="comment-column">
                                {m}
                            </div>
                            <div>
                                userWriter
                            </div>
                            <div className="btn-add-like-column">
                                <span><button>Like</button></span><br/>
                                <span>numLike</span>
                            </div>
                            <div>
                                <span>date</span>
                            </div>
                        </div>

                    )}

                    {this.state.comments.map( cc =>

                        <div key={cc.clusterId} className="comments">
                            <div className="comment-column">
                                <p>{cc.commentText}</p>
                            </div>
                            <div>
                                {cc.userWriter}
                            </div>
                            <div className="btn-add-like-column">
                                <span><button>Like</button></span><br/>
                                <span>{cc.numLike}</span>
                            </div>
                            <div>
                                <span>{cc.date}</span>
                            </div>
                        </div>

                    )}

                </div>
            </div>
        )
    }
}