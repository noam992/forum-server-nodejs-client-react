export class ClusterModel {

    public constructor(
        public clusterId?: number,
        public clusterSubject?: string,
        public content?: string,
        public numLike?: number,
        public numViewer?: number,
        public userWriter?: any,
        public date?: any
        ){
    }
}