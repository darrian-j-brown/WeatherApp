let express = require("express");
let http = require("http");

let app = express();

let cors = require("cors");
app.use(cors());

let port = 8080;
let host = "0.0.0.0";

let server = http.createServer(app);
server.listen(port, host);
console.log("starting on " + "localhost" + ":" + port);

let weatherAPI = require("./weatherAPI");
app.get("/weather-api*", weatherAPI);

app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});
