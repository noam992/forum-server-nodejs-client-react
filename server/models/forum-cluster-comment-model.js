const Joi = require("joi")

class ClusterComment {
    constructor(commentId, clusterId, commentText, numLike, userWriter, date) {
        if (commentId !== undefined) this.commentId = commentId;
        if (clusterId !== undefined) this.clusterId = clusterId;
        if (commentText !== undefined) this.commentText = commentText;
        if (numLike !== undefined) this.numLike = numLike;
        if (userWriter !== undefined) this.userWriter = userWriter;
        if (date !== undefined) this.date = date;
    };

    validatePost() {

        const schema = {
            commentId: Joi.optional(),
            clusterId: Joi.number().required().min(0),
            commentText: Joi.string().required().min(0).max(1500),
            numLike: Joi.number().min(0).max(1500),
            userWriter: Joi.optional(),
            date: Joi.date().min(0).max(50)
        };

        const result = Joi.validate(this, schema, {abortEarly: false});
        return result.error ? result.error.details.map( err => err.message ) : null;
    };

}

module.exports = ClusterComment