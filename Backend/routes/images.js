const express = require("express");
const app = express.Router();
const path = require('path');
const fs = require('fs');
const db = require('../utils/MysqlConfig');
const multer = require('multer');

//get image path
app.get('/:user_image', (req, res) => {
    console.log("Inside user profile image get");
    console.log("Req Body : ", req.body);
    var image = path.join(__dirname, '..') + '/public/userimages/' + req.params.user_image;
    if (fs.existsSync(image)) {
        res.sendFile(image);
        console.log(image);
    }
    else {
        res.sendFile(path.join(__dirname, '..') + '/public/userimages/userdefaultimage.png')
    }
});

const userstorage = multer.diskStorage({
    destination: path.join(__dirname, '..') + '/public/userimages',
    filename: (req, file, cb) => {
        cb(null, req.params.email + "-" + Date.now() + path.extname(file.originalname));
    }
});

const useruploads = multer({
    storage: userstorage,
    limits: { fileSize: 1000000 },
}).single("image");

//upload user image
app.post("/:email", (req, res) => {
    console.log("Inside images post Request");
    console.log("Req Body : ", req.body);
    const email = req.params.email;
    useruploads(req, res, function (err) {
        if (!err) {
            db.query(
                "UPDATE user SET image=? WHERE email=?;",
                [req.file.filename, email],
                (err, result) => {
                    if (err) {
                        res.status(500).end("Error");
                    }
                    if (result) {
                        res.writeHead(200, {
                        'Content-Type': 'text/plain'
                        });
                        res.end(req.file.filename);
                        console.log("user profile image success upload");
                    }
                }
            );
        }
        else {
            console.log('Error');
        }
    })
});

module.exports = app;