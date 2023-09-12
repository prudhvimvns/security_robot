const express = require("express");
const app = express.Router();
const db = require('../utils/MysqlConfig');

app.post('/', function(req,res){
    console.log("Inside message Post Request");
    console.log("Req Body : ", req.body);  
    const email = req.body.email;
    const message = req.body.message;
    db.query(
        "UPDATE user SET message=? WHERE email = ?;",
        [message, email],
        (err, result) => {
            if (err) {
                res.status(500).end("Error");
            }  
            if (result){
                res.status(200).end("Success_SendMessage");
            }
        })
});

app.get('/', (req, res) => {
    console.log("Inside messages get Request");
    db.query(
        "SELECT username, email, message FROM user;", (err, result) => {
            if (err) {
                res.status(500).end("Error");
            }
            if (result) {
                res.writeHead(200, {
                'Content-Type': 'text/plain'
                });
                res.end(JSON.stringify(result));
                console.log("success get");
            }
        }
    );
});
       
app.post('/delete', function(req,res){
    console.log("Inside message delete Post Request");
    console.log("Req Body : ", req.body);  
    const email = req.body.email;
    db.query(
        "UPDATE user SET message=? WHERE email = ?;",
        ["", email],
        (err, result) => {
            if (err) {
                res.status(500).end("Error");
            }  
            if (result){
                res.status(200).end("Success_DeleteMessage");
            }
        })
});

module.exports = app;