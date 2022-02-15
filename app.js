import express from "express";
let server = express();
import bodyParser from 'body-parser';
import routes from "./routes.js";

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true}));
server.use('/public', express.static('public'));
server.set("view engine", "pug");
server.set("views", `./views`);
server.use("/", routes);
server.listen(3000);

console.log("App running on http://localhost:3000")
