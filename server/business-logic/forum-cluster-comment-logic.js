const dal = require("../data-access-layer/dal");

async function getAllComments(clusterId) {

    const sql = `SELECT commentId as commentId,
                    clusterId as clusterId,
                    comment as commentText,
                    numLike as numLike,
                    CONCAT(firstName, ' ', lastName) AS userWriter,
                    DATE_FORMAT(dateAndTime, '%m/%d/%Y %r') as date
                    FROM forumComment JOIN users on forumComment.userId = users.userId 
                    WHERE clusterId = ${clusterId}`

    const comments = await dal.executeAsync(sql)
    return comments

}

async function addComment(comment) {
    const sql = `INSERT INTO forumComment(clusterId ,comment, numLike, userId, dateAndTime) VALUES(${comment.clusterId}, '${comment.commentText}', ${comment.numLike}, ${comment.userWriter}, now())`;
    const info = await dal.executeAsync(sql);
    console.log(info)
    comment.commentId = info.insertId
    return comment

}

module.exports = {
    getAllComments,
    addComment
}