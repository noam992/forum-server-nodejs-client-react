const Joi = require("joi")

class Cluster {

    constructor(clusterId, clusterSubject, content, numLike, numViewer, userWriter, date) {
        if (clusterId !== undefined) this.clusterId = clusterId;
        if (clusterSubject !== undefined) this.clusterSubject = clusterSubject;
        if (content !== undefined) this.content = content;
        if (numLike !== undefined) this.numLike = numLike;
        if (numViewer !== undefined) this.numViewer = numViewer;
        if (userWriter !== undefined) this.userWriter = userWriter;
        if (date !== undefined) this.date = date;
    };

    validatePost() {

        const schema = {
            clusterId: Joi.optional(),
            clusterSubject: Joi.string().required().min(0).max(70),
            content: Joi.string().required().min(0).max(1500),
            numLike: Joi.number().min(0).max(1500),
            numViewer: Joi.number().min(0).max(1500),
            userWriter: Joi.optional(),
            date: Joi.date().min(0).max(50)
        };

        const result = Joi.validate(this, schema, {abortEarly: false});
        return result.error ? result.error.details.map( err => err.message ) : null;
    };

    validatePut() {
        
        const schema = {
            clusterId: Joi.number().required().min(0),
            cluster: Joi.string().required().min(0).max(70),
            content: Joi.string().required().min(0).max(1500),
            numLike: Joi.number().required().min(0).max(1500),
            numViewer: Joi.number().required().min(0).max(1500),
            userWriter: Joi.optional(),
            date: Joi.date().required().min(0).max(50)
        };

        const result = Joi.validate(this, schema, {abortEarly: false});
        return result.error ? result.error.details.map( err => err.message ) : null
    };

    validatePatch() {
        
        const schema = {
            clusterId: Joi.number().required().min(0),
            cluster: Joi.string().min(0).max(70),
            content: Joi.string().min(0).max(1500),
            numLike: Joi.number().min(0).max(1500),
            numViewer: Joi.number().min(0).max(1500),
            userWriter: Joi.optional(),
            date: Joi.date().min(0).max(50)
        };

        const result = Joi.validate(this, schema, {abortEarly: false});
        return result.error ? result.error.details.map( err => err.message ) : null
    };

}

module.exports = Cluster