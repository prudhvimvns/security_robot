const express = require("express");
const app = express.Router();
const db = require('../utils/MysqlConfig');

//get user information by email
app.get('/:email', (req, res) => {
    console.log("Inside user profile get Request");
    const email = req.params.email;
    console.log(email);
    db.query(
        "SELECT * FROM user WHERE email = ?;", email, (err, result) => {
            if (err) {
                res.status(500).end("Error");
            }
            if (result && result.length > 0) {
                res.writeHead(200, {
                'Content-Type': 'text/plain'
                });
                res.end(JSON.stringify(result[0]));
                console.log("profile success get");
            }
        }
    );
});

//update user profile info
app.post('/', (req, res) => {
    console.log("Inside user Profile Post Request");
    console.log("Req Body : ", req.body);
    const username = req.body.username;
    const email = req.body.email;
    const phone = req.body.phone;
    const origin_email = req.body.origin_email;
    db.query("SELECT * FROM user WHERE email = ?;", email,
        (err, result) => {
            if (err) throw err;
            if (result.length > 0 && (origin_email !== email)){
                res.writeHead(404, {
                  'Content-Type': 'text/plain'
                })
                res.end("User_Exist");
                console.log("email exists");
            }
            //not exists
            else{          
                db.query(
                    "UPDATE user SET username=?, email=?, phone=? WHERE email = ?;",
                    [username, email, phone, origin_email],
                    (err, result) => {
                        if (err) {
                            res.status(500).end("Error");
                        }  
                        if (result){
                            res.status(200).end("Success_Update");
                        }
                    })
            }
    });
});

module.exports = app;