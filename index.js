const express = require("express");
const app = express();
const path = require("path");
const router = express.Router();

const ExifReader = require("exifreader");

const fs = require("fs");

const getImageData = async (file) => {
  const tags = ExifReader.load(file, { includeUnknown: true });
  return tags;
};

const getFiles = () => {
  const directoryPath = path.join(__dirname, "./public/");
  let arr = [];
  fs.readdirSync(directoryPath).forEach((file) => {
    const name = path.parse(file).name;
    const ext = path.parse(file).ext;
    arr.push({ name, ext });
  });

  return arr;
};

router.get("/", async function (req, res) {
  const files = getFiles();

  res.render(path.join(__dirname + "/index.html"), {
    files,
  });
});

router.get("/:fileName", async function (req, res) {
  const files = getFiles();

  const fileName = req.params.fileName;

  const { name, ext } = files.find((file) => {
    return file.name === fileName;
  });
  const imgPath = `./public/${name}${ext}`;
  const imgData = await getImageData(imgPath);

  res.render(path.join(__dirname + "/index.html"), {
    imgData: JSON.stringify(imgData, null, 2),
    name,
    ext,
    files,
  });
});

//add the router
app.use("/", router);

// let express use images
app.use("/public", express.static(__dirname + "/public"));

// add templating
app.engine("html", require("ejs").renderFile);

const port = process.env.port || 3000;

app.listen(port);

console.log(`Running at Port 3000 -> http://localhost:${port}`);
