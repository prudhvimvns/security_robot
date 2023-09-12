const express = require("express");
const app = express.Router();
const db = require('../utils/MysqlConfig');

app.get('/users', (req, res) => {
    console.log("Inside get all users Request");
    console.log("Req Body : ", req.body);
    db.query(
        "SELECT * FROM user;",
        (err, result) => {
            if (err) {
                res.status(500).end("Error");
            }
            if (result) {
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                res.end(JSON.stringify(result));
                console.log("all users success get");
            }
        }
    );
});

app.get('/simulations', (req, res) => {
    console.log("Inside get all simulations Request");
    console.log("Req Body : ", req.body);
    db.query(
        "SELECT * FROM simulation;",
        (err, result) => {
            if (err) {
                res.status(500).end("Error");
            }
            if (result) {
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                res.end(JSON.stringify(result));
                console.log("all simulations success get");
            }
        }
    );
});

app.post('/delete', (req, res) => {
    console.log("Inside delete a user Request");
    console.log("Req Body : ", req.body);
    const email = req.body.email;
    console.log(email);
    db.query(
        "DELETE FROM user WHERE email = ?;", email,
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).end("Error");
            }
            if (result) {
                res.status(200).end("Success_Delete");
            }
        }
    );
});

app.post('/sendbilling', (req, res) => {
    console.log("Inside send billing Request");
    console.log("Req Body : ", req.body);
    const email = req.body.email;
    const billing = req.body.billing;
    db.query(
        "UPDATE user SET billing=? WHERE email=?;",
        [billing, email],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).end("Error");
            }
            if (result) {
                console.log("success update billing");
                res.status(200).end("Success_Update_Billing");
            }
        }
    )
});

module.exports = app;