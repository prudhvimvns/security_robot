const mysql = require('mysql');

const db = mysql.createPool({
    host: 'robot.c836szfhlvzc.us-west-2.rds.amazonaws.com',
    port: '3306',
    user: 'admin',
    password: 'adminadmin',
    database: 'securityrobot'
});

db.getConnection((err) => {
    if(err){
      throw err;
    } 
    else{
      console.log("connect to Mysql db");
    }
    //TEST
    db.query('SELECT * FROM admin', (err, results)=>{
      if (err) throw err;
      console.log(results);
    })
});
  
module.exports = db;