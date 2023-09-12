const app = require('./app');

const login = require("./routes/login");
const signup = require("./routes/signup");
const profile = require("./routes/profile");
const images = require("./routes/images");
const message = require("./routes/message");
const userdashboard = require("./routes/userdashboard");
const admindashboard = require("./routes/admindashboard");

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const aws_cloudRouter = require('./routes/aws_cloud');
const aws_robomaker = require('./routes/aws_robomaker');
const aws_cloudwatch = require('./routes/aws_cloudwatch');
const robotcontroller = require('./routes/robot_controller');
const robotinteraction = require('./routes/robot_interaction');

app.use("/login", login);
app.use("/signup", signup);
app.use("/profile", profile);
app.use("/images", images);
app.use("/message", message);
app.use("/userdashboard", userdashboard);
app.use("/admindashboard", admindashboard);

app.use('/users', usersRouter);
app.use('/aws_user', aws_cloudRouter);
app.use('/aws_robomaker', aws_robomaker);
app.use('/aws_cloudwatch', aws_cloudwatch);
app.use('/robot_controller', robotcontroller);
app.use('/robot_interaction', robotinteraction);

const port = process.env.PORT || 3001;
var server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = app;