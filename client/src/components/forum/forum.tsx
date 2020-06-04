import React,{ Component, ChangeEvent } from "react";
import "./forum.css";
import { ClusterModel } from "./model-forum/model-cluster";
import { store } from "./redux-forum/store";
import { Unsubscribe } from "redux";
import { ActionType } from "./redux-forum/action-type";
import axios from "axios";
import { Collapse } from "react-collapse"
import { Comments } from "./forum-components/comments";
import { getCookie ,getCookieValue } from "../../helper/cookie"

interface ForumState {
    cluster: ClusterModel;
    clusters: ClusterModel[];
    errors: { 
        subjectError: string,
        contentError: string
    },
    activeIndex: number,
    numIndex: number,
    viewerCluster: Array<number>
}

export class Forum extends Component<any, ForumState> {

    private unsubscribeStore: Unsubscribe

    public constructor(props: any){
        super(props);
        this.state = {
            cluster: new ClusterModel(),
            clusters: store.getState().clusters,
            errors: {
                subjectError: "*",
                contentError: "*"
            },
            activeIndex: null,
            numIndex: null,
            viewerCluster: []
        };

        this.unsubscribeStore = store.subscribe(() => {
            const clusters = store.getState().clusters;
            this.setState({ clusters })
        });

    }

    /* Get all clusters */
    public componentDidMount = async () => {

       if (store.getState().clusters.length > 0) {
           console.log(store.getState().clusters)
           return;
       }

        try {
            const response = await axios.get<ClusterModel[]>("http://localhost:3002/api/forum/cluster")
            const clusters = response.data

            store.dispatch({ type: ActionType.GetAllMessages, payload: clusters });
        } catch (err) {
            alert("Error: " + err.message)
        }
    }

    // Stop listening to changes in Store
    public componentWillUnmount(): void {
        this.unsubscribeStore(); 
    }

    /* Validation and update value of new cluster */
    private setSubtitle = (args: ChangeEvent<HTMLInputElement>) => {

        const subject = args.target.value;
        let subjectError = ""

        if (subject === "") {
            subjectError = "Miss subject"
        }

        if (subject.length > 1500) {
            subjectError = "1,500 limit characters at one text"
        }

        const errors = { ...this.state.errors };
        errors.subjectError = subjectError;
        this.setState({ errors });

        const cluster = { ...this.state.cluster }
        cluster.clusterSubject = subject
        this.setState({ cluster });

    }

    private setText = (args: ChangeEvent<HTMLInputElement>) => {
        const content = args.target.value;
        let contentError = ""

        if (content === "") {
            contentError = "Miss text"
        }

        if (content.length > 200) {
            contentError = "10 limit characters at one text"
        }

        const errors = { ...this.state.errors };
        errors.contentError = contentError;
        this.setState({ errors });
        
        const cluster = { ...this.state.cluster }

        // Add to any new cluster initial values
        cluster.numLike = 0
        cluster.numViewer = 0
        if (cluster.userWriter === undefined) {
            cluster.userWriter = 4
        }

        cluster.content = content
        this.setState({cluster})
    }

    /* Btn add new cluster */
    private btnAddCluster = async () => {

        try {
            const response = await axios.post<ClusterModel>("http://localhost:3002/api/forum/cluster", this.state.cluster)
            const addedCluster = response.data
            store.dispatch({ type: ActionType.AddCluster, payload: addedCluster })
        } catch (err) {
            alert("Error: " + err.message)
        }

    }

    /* Collapse for current cluster and counting user viewers */
    private getContentCluster = async (index :any , e :any) => {

        const cluster = { ...this.state.cluster }
        const date = new Date(); // Get current date and time.
        date.setFullYear(date.getFullYear() + 1);
        cluster.numViewer = 1

        // Get status of clusters that has been open. first check if that name cookie is exist, if not create one and if yes check if user already open it or not for counting viewer cluster
        let myCookie = getCookie("statusViewer");
    

        if (myCookie == null) {
            // do cookie doesn't exist stuff;

            this.setState({
                activeIndex: this.state.activeIndex === index ? null : index,
                numIndex: index,
                cluster
            });

            this.state.viewerCluster.push(index);
            document.cookie = `statusViewer=${this.state.viewerCluster}; expires=${date.toUTCString()}`;

            // Update the num of viewer in specific cluster
            try {
                const response = await axios.patch<ClusterModel>(`http://localhost:3002/api/forum/cluster/${index}`, cluster)
                const updateCluster = response.data

                store.dispatch({ type: ActionType.UpdateCluster, payload: updateCluster })
                //בתצוגה עצמה store הרכיב לא מאזין לשינויים ולכן לא נראה את השינוי שעשינו ב
            } catch (err) {
                alert("Error: " + err.message)
            }
            
        }
        else {
            // Do cookie exists stuff
            let ArrNumCluster = []
            let numIndexClusterView = getCookieValue("statusViewer");

            // Get all values cookie by name "statusViewer" to check if user already open it 
            const ArrNum = numIndexClusterView.split(",")
            for (const item of ArrNum) {
                ArrNumCluster.push(parseInt(item))
            }

            // Check if user already open cluster to prevent to count one more view by same user 
            const isCheckCluster = ArrNumCluster.filter( c => c === parseInt(index) );

            if (Array.isArray(isCheckCluster) && isCheckCluster.length) {

                this.setState({
                    activeIndex: this.state.activeIndex === index ? null : index,
                    numIndex: index,
                    cluster
                });
                
            } else {
                
                // For cluster that opened on first time
                ArrNumCluster.push(parseInt(index));
                document.cookie = `statusViewer=${ArrNumCluster}; expires=${date.toUTCString()}`;
    
                this.setState({
                    activeIndex: this.state.activeIndex === index ? null : index,
                    numIndex: index,
                    cluster
                });
    
                // Update the num of viewer in specific cluster
                try {
                    const response = await axios.patch<ClusterModel>(`http://localhost:3002/api/forum/cluster/${index}`, cluster)
                    const updateCluster = response.data
    
                    store.dispatch({ type: ActionType.UpdateCluster, payload: updateCluster })
                    //בתצוגה עצמה store הרכיב לא מאזין לשינויים ולכן לא נראה את השינוי שעשינו ב
                } catch (err) {
                    alert("Error: " + err.message)
                }
    
            }
        }
         
    }

    public render () {
        return (
            <div className="forum">

                <div className="header-forum">
                    <h2>forum</h2>
                </div>

                {this.state.clusters.map( c => 
                <React.Fragment key={c.clusterId}>
                <div className="cluster" onClick={this.getContentCluster.bind(this, c.clusterId)}>

                    <div className="img-cluster-column">
                        <img src="/assets/images/img-forum/img-cluster.png" alt="img-cluster"/>
                    </div>
                    <div className="subject-column">
                        <span><h2>{c.clusterSubject}</h2></span>
                    </div>
                    <div className="img-like-column">
                        <span><img src="/assets/images/img-forum/img-like.png" alt="img-like"/></span><br/>
                        <span>{c.numLike}</span>
                    </div>
                    <div className="img-viewer-column">
                        <span><img src="/assets/images/img-forum/img-viewer.png" alt="img-viewer"/></span><br/>
                        <span>{c.numViewer}</span>
                    </div>
                    <div className="img-user-column">
                        <span><img src="/assets/images/img-forum/img-user.png" alt="img-user"/></span><br/>
                        <span>{c.userWriter}</span>
                    </div>
                    <div>
                        <span>{c.date}</span>
                    </div>

                </div>
                    
                <Collapse isOpened={this.state.activeIndex === c.clusterId} >

                    <div className="text-and-comment" >
                        
                        <div>
                            <p className="content">
                                {c.content}
                            </p>
                        </div>

                        {this.state.activeIndex === c.clusterId && <Comments clusterIndex={this.state.numIndex} />}

                    </div>

                </Collapse>
                </React.Fragment>
                )}
                
                <div className="comment-buttons">

                    <div>
                        <input type="text" placeholder="subject.."
                            value={this.state.cluster.clusterSubject || ""}
                            onChange={this.setSubtitle}/>
                        <span>{this.state.errors.subjectError}</span>
                    </div>
                    <div>
                        <input type="textarea" placeholder="text.."
                            value={this.state.cluster.content || ""}
                            onChange={this.setText}/>
                        <span>{this.state.errors.contentError}</span>
                    </div>
                    <div><button id="addBtn" onClick={this.btnAddCluster}>Add Cluster</button></div>

                </div>

            </div>
        )
    }
}