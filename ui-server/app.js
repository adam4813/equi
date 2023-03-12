import createError from "http-errors";
import express from "express";
import cors from "cors";
import fs from "fs";
import TGA from "tga";
import { PNG } from "pngjs";
import cookieParser from "cookie-parser";
import logger from "morgan";

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, "public")));

function convertTgaToPng(inputPath, outputPath) {
  console.log("converting png to tga");
  const tga = new TGA(fs.readFileSync(inputPath));
  const png = new PNG({
    width: tga.width,
    height: tga.height
  });
  png.data = tga.pixels;
  const buffer = PNG.sync.write(png);
  fs.writeFileSync(outputPath, buffer);
}

function fileOrDefault(uiName, filePath) {
  const customUiFilePath = __dirname + "/public" + filePath;
  const defaultFilePath =
    __dirname + "/public" + filePath.replace(new RegExp(uiName), "/default");
  if (fs.existsSync(customUiFilePath)) {
    return customUiFilePath;
  } else if (fs.existsSync(defaultFilePath)) {
    console.log(`${filePath} - file not found, returning default`);
    return defaultFilePath;
  } else {
    throw new Error("File not found");
  }
}

function changeFileExt(filePath, newExt) {
  return `${filePath.slice(0, filePath.lastIndexOf("."))}.${newExt}`;
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const uiName = req.path.slice(
    req.path.indexOf("/", 1) + 1,
    req.path.lastIndexOf("/")
  );

  const fileExt = req.path.slice(req.path.lastIndexOf(".") + 1);

  try {
    if (fileExt === "tga") {
      try {
        const pngFilePath = changeFileExt(req.path, "png");
        const filePath = fileOrDefault(uiName, pngFilePath);
        console.log(filePath);
        res.sendFile(filePath);
      } catch (_) {
        const filePath = fileOrDefault(uiName, req.path);
        const pngFilePath = changeFileExt(filePath, "png");
        convertTgaToPng(filePath, pngFilePath);
        res.sendFile(pngFilePath);
      }
    } else {
      const filePath = fileOrDefault(uiName, req.path);
      res.sendFile(filePath);
    }
  } catch (_) {
    console.log(`${req.path} - file not found`);
    next(createError(404));
  }
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  console.log(err.message);
  res.status(err.status || 500);
  next(createError(500));
});

app.listen(PORT, () => console.log(`UI server listening on port ${PORT}!`));
