const { spawn } = require("child_process");
const path = require("path");
const cron = require("node-cron");

// Константы для MongoDB
const DB_NAME = "taskdb";
const ARCHIVE_PATH = path.join(__dirname, "", `${DB_NAME}.gzip`);

// Расписание cron: выполнение функции backupMongoDB каждые 12 часов
cron.schedule("*/5 * * * * *", () => backupMongoDB());

// Функция для резервного копирования MongoDB
function backupMongoDBLocal() {
  const child = spawn("mongodump", [
    `--db=${DB_NAME}`,
    `--archive=${ARCHIVE_PATH}`,
    "--gzip",
  ]);

  // Обработчики событий вывода и ошибок
  child.stdout.on("data", (data) => {
    console.log("stdout:\n", data);
  });
  child.stderr.on("data", (data) => {
    console.log("stderr:\n", Buffer.from(data).toString());
  });

  // Обработчики событий ошибки и завершения
  child.on("error", (error) => {
    console.log("error:\n", error);
  });
  child.on("exit", (code, signal) => {
    if (code) console.log("Process exit with code:", code);
    else if (signal) console.log("Process killed with signal:", signal);
    else console.log("Backup is successful 👌");
  });
}

const fs = require("fs");
const { google } = require("googleapis");

const apikeys = require("./apikeys.json");
const SCOPE = ["https://www.googleapis.com/auth/drive"];

// A Function that can provide access to google drive api
async function authorize() {
  const jwtClient = new google.auth.JWT(
    apikeys.client_email,
    null,
    apikeys.private_key,
    SCOPE
  );

  await jwtClient.authorize();

  return jwtClient;
}

// A Function that will upload the desired file to google drive folder
async function uploadFile(authClient) {
  return new Promise((resolve, rejected) => {
    const drive = google.drive({ version: "v3", auth: authClient });

    var fileMetaData = {
      name: "taskdb.gzip",
      parents: ["1ld0JL3HFCVrYlGW9qxG1jC4hEXyimuhA"], // A folder ID to which file will get uploaded
    };

    drive.files.create(
      {
        resource: fileMetaData,
        media: {
          body: fs.createReadStream("taskdb.gzip"), // files that will get uploaded
          mimeType: "application/gzip",
        },
        fields: "id",
      },
      function (error, file) {
        if (error) {
          return rejected(error);
        }
        resolve(file);
      }
    );
  });
}

function backupMongoDB() {
  backupMongoDBLocal();
  authorize().then(uploadFile).catch("error", console.error());
}

// function call
