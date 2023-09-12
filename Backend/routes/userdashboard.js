const express = require("express");
const app = express.Router();
const db = require('../utils/MysqlConfig');

app.get('/usage/:email', (req, res) => {
    console.log("Inside get all users Request");
    console.log("Req Body : ", req.body);
    const email = req.params.email;
    db.query(
        "SELECT month(endtime) as month, YEAR(endtime) as year,\
        SUM(TIMESTAMPDIFF(HOUR, starttime, endtime)) as duration_hours\
        FROM simulation\
        WHERE user_email = ?\
        group by EXTRACT(YEAR_MONTH FROM endtime);", email,
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).end("Error");
            }
            if (result) {
                let sumHour = 0;
                for(i=0; i<result.length; i++){
                    sumHour += result[i].duration_hours;
                }
                let billing = sumHour*0.06;
                db.query(
                    "UPDATE user SET billing=? WHERE email=?;",
                    [billing, email],
                    (err, result1) => {
                        if (err) {
                            console.log(err);
                            res.status(500).end("Error");
                        }
                        if (result1) {
                            console.log("success update billing");
                            res.status(200).end(JSON.stringify(result));
                        }
                    }
                )
            }
        }
    );
});

module.exports = app;