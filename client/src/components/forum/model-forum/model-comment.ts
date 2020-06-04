export class CommentModel {

    public constructor(
        public commentId?: number,
        public clusterId?: number,
        public commentText?: string,
        public numLike?: number,
        public userWriter?: number,
        public date?: any

        ){
    }
}