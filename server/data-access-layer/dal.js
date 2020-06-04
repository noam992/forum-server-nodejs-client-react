const mysql = require('mysql');

const connection = mysql.createConnection({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database 
});

connection.connect(function(error){
    if (!!error) {
        console.log("Error");
    } else {
        console.log("We are connected to coffee-website database on MySQL.")
    };
});

function executeAsync(sql){
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if(err){
                reject(err);
                return
            }
            resolve(result);
        });
    });
};

module.exports = {
    executeAsync
};