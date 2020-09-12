const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const server = express();
const Sequelize = require("sequelize");
const connection = new Sequelize("mysql://root@localhost:3306/delilah_resto");
//const SERVER_KEY = "manuelDelilahResto";

const port = 3000; 

server.listen(port, ()=> {
    console.log(`Server listening at http://localhost:${port}`)
});

server.use(bodyParser.json());

//Endpoints
//Productos
server.post("/productos", (req, res) => {
    connection.query("INSERT INTO productos (nombre, precio) VALUES (?,?)",
    {replacements: [req.body.nombre, req.body.precio]})
    .then((resp)=> {
        res.status(200).json({resp});
    })
})

server.get("/productos", (req, res) => {
    connection.query("SELECT * FROM productos",
    {type: Sequelize.QueryTypes.SELECT})
    .then((results)=> {
        res.status(200).json(results);
    })
})

server.get("/productos/:id", (req, res) => {
    connection.query("SELECT * FROM productos WHERE id = :id",
    {replacements: {id: req.params.id }, type: connection.QueryTypes.SELECT})
    .then((results)=> {
        res.status(200).json(results);
    })
})

server.put("/productos/:id", (req, res) => {
    connection.query("UPDATE productos SET nombre = ?, precio = ? WHERE id = ?",
    {replacements: [req.body.nombre, req.body.precio, req.params.id], type: Sequelize.QueryTypes.UPDATE})
    .then((results)=> {
        res.status(201).json(results);
    })
})

server.delete("/productos/:id", (req, res) => {
    connection.query("DELETE FROM productos WHERE id = ?",
    {replacements: [req.params.id], type: Sequelize.QueryTypes.DELETE})
    .then((results)=> {
        res.status(204).json(results);
    })
})