const express = require("express");
const forumClusterLogic = require("../business-logic/forum-cluster-logic");
const forumClusterCommentLogic = require("../business-logic/forum-cluster-comment-logic");
const Cluster = require("../models/forum-cluster-model");
const ClusterComment = require("../models/forum-cluster-comment-model");

const router = express.Router();


// Care on clusters requests 
router.get("/", async (request, response) => {
    try {
        const clusters = await forumClusterLogic.getAllClusters();
        response.json(clusters);        
    } catch (err) {
        response.status(500).send(err.message)
    }
});

router.post("/", async (request, response) => {

    try {
        const sendCluster = new Cluster(undefined, request.body.clusterSubject, request.body.content, request.body.numLike, request.body.numViewer, request.body.userWriter, request.body.date);

        const errors = sendCluster.validatePost()
        if(errors) {
            response.status(400).send(errors);
            return
        }

        
        const newCluster = await forumClusterLogic.addCluster(sendCluster);
        response.status(201).json(newCluster);        
    } 
    catch (err) {
        response.status(500).send(err.message)
    }
});

router.patch("/:id", async (request, response) => {

    try {
        const id = +request.params.id;
        const updateCluster = new Cluster(id, request.body.clusterSubject, request.body.content, request.body.numLike, request.body.numViewer, request.body.userWriter, request.body.date);

        const errors = updateCluster.validatePatch();
        if(errors) {
            response.status(400).send(errors);
            return
        }

        const updatedCluster = await forumClusterLogic.updatePartialCluster(updateCluster)
        if (!updatedCluster) {
            response.sendStatus(404);
            return
        };

        response.json(updatedCluster)

    } catch (err) {
        response.status(500).send(err.message)
    }
});


// Care on comments requests 
router.get("/:id/comment", async (request, response) => {
    try {
        const id = +request.params.id
        const comments = await forumClusterCommentLogic.getAllComments(id);
        response.json(comments);       
    } catch (err) {
        response.status(500).send(err.message)
    }
});

router.post("/:id/comment", async (request, response) => {

    try {
        const clusterId = +request.params.id
        const sendComment = new ClusterComment(undefined, clusterId, request.body.commentText, request.body.numLike, request.body.userWriter, request.body.date);
        
        const errors = sendComment.validatePost()
        if(errors) {
            response.status(400).send(errors);
            return
        }
        
        const newComment = await forumClusterCommentLogic.addComment(sendComment);
        response.status(201).json(newComment);        
    } 
    catch (err) {
        response.status(500).send(err.message)
    }
});

module.exports = router