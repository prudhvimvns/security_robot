var express = require('express');
var router = express.Router();
const db = require('../utils/MysqlConfig');

/* GET users listing. */
router.post('/startSimulation', function(req, res, next) {
  const simulationName = req.body.simulationName;
  const type = req.body.simulationType;
  const email = req.body.email;
  const robotName = req.body.robotName;
  let simulation = "";
  if (type === "1" || type === 1){
      simulation = "Navigation Simulation";
  } else {
      simulation = "Movement Simulation";
  }

  db.query(
      "INSERT into simulation (simulationName, starttime, endtime, user_email, robotName, simulationType) VALUES (?,?,?,?,?,?);", [simulationName, new Date(), null, email, robotName, simulation], (err, result) => {
        if (err) {
          res.status(500).end("Error");
          console.log(err);
        } else {
          res.status(200).end("records_added");
        }
      }
  );
});

/* GET users listing. */
router.post('/stopSimulation', function(req, res, next) {
    const simulationName = req.body.simulationName;
    db.query(
        "UPDATE simulation SET endtime=? WHERE simulationName=?;", [new Date(), simulationName], (err, result) => {
            if (err) {
                res.status(500).end("Error");
                console.log(err);
            } else {
                res.status(200).end("records_added");
            }
        }
    );
});

/* GET users listing. */
router.get('/getSimulations/:email', function(req, res, next) {
    const email = req.params.email;
    db.query(
        "SELECT * from simulation WHERE user_email=?;", [email], (err, result) => {
            if (err) {
                res.status(500).end("Error");
                console.log(err);
            } else {
                res.status(200).send(result);
            }
        }
    );
});

module.exports = router;
