# forum-server-nodejs-client-react
Create forum from zero using server side node.js and client side react. In addition using DB - MySQL, socket.io and cookies

Any one that want to create forum from zero and using nodejs for server side and react for client side, its a good beginning for you.
actully this code is include react-redux metode, socket.io into server side and using DB of MySQL of PHPmyadmin 
so its fit for advanced developers and who are familiar with that softwares.

That code let you upload your DB to table of cluster list and add new cluster.
in additional user can add like or enter to cluster and the number of viewer of current clusters will show plus one by host user,
that mean the user dont need to sign in to do that operators.
note - if user already do like or enter to cluster, all information are saving in cookies for the next time he will back to browser,
even user turn computer off he is will see the like he did and the number of viewer isn't counting again

Discripation-

server- 
1. install "npm i"
2. please check business-logic and controller folder to modify them your data that relevant to you
3. into config.json change varibale "database" to your DB table

client-
1. install "npm i"
2. using cookies for smarter counting the numbers of likes and views
3. using redux for sharing state between several components

