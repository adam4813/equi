var createError = require("http-errors");
var express = require("express");
var cors = require("cors");
var path = require("path");
var fs = require('fs');
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var app = express();

app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const uiName = req.path.substr(
    req.path.indexOf("/", 1),
    req.path.lastIndexOf("/") - req.path.indexOf("/", 1)
  );
  const filePath = __dirname + "/public" + req.path.replace(uiName, "/default");

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    next(createError(404));
  }
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  next(createError(500));
});

module.exports = app;
