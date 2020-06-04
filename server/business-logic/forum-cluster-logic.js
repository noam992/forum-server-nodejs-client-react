const dal = require("../data-access-layer/dal");

async function getAllClusters() {

    const sql = `SELECT clusterId as clusterId,
                    cluster as clusterSubject,
                    content as content,
                    numView as numViewer,
                    numLike as numLike,
                    DATE_FORMAT(dateAndTimeCluster, '%m/%d/%Y %r') as date,
                    CONCAT(firstName, ' ', lastName) AS userWriter
                    FROM forumCluster JOIN users on forumCluster.userId = users.userId
                    ORDER BY date DESC`

    const clusters = await dal.executeAsync(sql)
    return clusters

}

async function addCluster(cluster) {

    const sql = `INSERT INTO forumCluster(cluster, content, userId, numView, numLike, dateAndTimeCluster) VALUES('${cluster.clusterSubject}', '${cluster.content}', ${cluster.userWriter}, ${cluster.numViewer}, ${cluster.numLike}, now())`;
    const info = await dal.executeAsync(sql);
    cluster.clusterId = info.insertId
    return cluster

}

async function updatePartialCluster(cluster) {

    let sql = `UPDATE forumCluster SET `;

    if (cluster.clusterSubject !== undefined) {
        sql += `cluster = '${cluster.clusterSubject}',`
    };

    if (cluster.content !== undefined) {
        sql += `content = '${cluster.content}',`
    }
    
    if (cluster.userWriter !== undefined) {
        sql += `userId = ${cluster.userWriter},`
    }

    if (cluster.numViewer !== undefined) {
        sql += `numView = numView + 1,`
    }
        
    if (cluster.numLike !== undefined) {
        if (cluster.numLike === 1) {
            sql += `numLike = numLike + 1,`
        } else {
            sql += `numLike = numLike - 1,`
        }
        
    }

    sql = sql.substr(0, sql.length -1)

    sql += ` WHERE clusterID = ${cluster.clusterId}`;

    const info = await dal.executeAsync(sql);
    return info.affectedRows === 0 ? null : cluster;

}


module.exports = {
    getAllClusters,
    addCluster,
    updatePartialCluster
}