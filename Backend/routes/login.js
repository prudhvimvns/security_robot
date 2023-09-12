const express = require("express");
const app = express.Router();
const db = require('../utils/MysqlConfig');

app.post('/user', (req, res) => {
    console.log("Inside User Login Post Request");
    console.log("Req Body : ", req.body);
    const email = req.body.email;
    const password = req.body.password;
    db.query(
        "SELECT * FROM user WHERE (email, password)=(?,?);", [email, password], (err, result) => {
            if (err) {
                res.status(500).end("Error");
                console.log(err);
            }
            if (result && result.length>0) {
                res.status(200).end("Success_Login");
                console.log("log in seccess");
            }
            else {
                res.status(401).end("Incorrect_Credentials");
                console.log("incorrect email or password");
            }
        }
    );
});

app.post('/admin', (req, res) => {
    console.log("Inside Admin Login Post Request");
    console.log("Req Body : ", req.body);
    const email = req.body.email;
    const password = req.body.password;
    db.query(
        "SELECT * FROM admin WHERE (email, password)=(?,?);", [email, password], (err, result) => {
            if (err) {
                res.status(500).end("Error");
                console.log(err);
            }
            if (result && result.length>0) {
                res.status(200).end("Success_Login");
                console.log("log in seccess");
            }
            else {
                res.status(401).end("Incorrect_Credentials");
                console.log("incorrect email or password");
            }
        }
    );
});

module.exports = app;
