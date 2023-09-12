const express = require("express");
const app = express.Router();
const db = require('../utils/MysqlConfig');

app.post('/', function(req,res){
    console.log("Inside signup Post Request");
    console.log("Req Body : ", req.body);  
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    //find if the email is exists
    db.query("SELECT * FROM user WHERE email = ?;", email, (err, result) => {
        if (err) throw err;
        if (result.length > 0){
            res.status(404).end("User_Exist");
            console.log("email exists");
        }
        else{
            db.query(
                "INSERT INTO user (username, password, email, phone, billing) VALUES (?,?,?,?,?)",
                [username, password, email, "", 0],
                (err, result) => {
                    if (err){
                        res.status(500).end("Error");
                        console.log(err);
                    }
                    if (result){
                        res.status(200).end("Success_Signup");
                        console.log("sign up seccess");
                    }
                }
            );
        }
    });
});
            
module.exports = app;