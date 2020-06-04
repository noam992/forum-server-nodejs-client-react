import { ClusterModel } from "../model-forum/model-cluster";
import { CommentModel } from "../model-forum/model-comment";

export class AppState {

    public clusters: ClusterModel[];
    public comments: CommentModel[];

    public constructor() {
        this.clusters = [];
        this.comments = [];

    }

}

