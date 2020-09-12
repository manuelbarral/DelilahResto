const express = require("express");
//const bodyParser = require("body-parser");
//const jwt = require("jsonwebtoken");
const server = express();

//const SERVER_KEY = "manuelDelilahResto";

const port = 3000; 

server.get("/", (req, resp) => {
    resp.send("Probando");
})

server.listen(port, ()=> {
    console.log(`Server listening at http://localhost:${port}`)
});