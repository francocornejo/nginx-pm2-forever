const express = require("express");
const cluster = require("cluster");
const os = require("os");
const rutas = require("./routes/index.js");

const app = express();
const cpus = os.cpus();
const PORT = Number(process.argv[2]) || 3000;
const iscluster = process.argv[3] == "cluster";

if (iscluster && cluster.isPrimary) {
  cpus.map(() => {
    cluster.fork();
  });
} else {
  app.get("/api/randoms/datos", (req, res) => {
    res.send("Server2-3");
  });

  app.listen(PORT, () => {
    console.log("Server listening port 3000");
  });
}