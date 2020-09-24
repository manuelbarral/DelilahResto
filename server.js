const express = require("express");
const server = express();
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const Sequelize = require("sequelize");
const connection = new Sequelize("mysql://root@localhost:3306/delilah_resto");

require("dotenv").config();

//process.env
const port = process.env.PORT;
const host = process.env.HOST;
const server_key = process.env.SERVER_KEY;

server.listen(port, host, ()=> {
    console.log(`Server listening at http://${host}:${port}`);
});

server.use(bodyParser.json());

//Endpoints de productos
server.get("/products", (req, res) => {
    connection.query("SELECT * FROM productos",
    {type: Sequelize.QueryTypes.SELECT})
    .then((results)=> {
        res.status(200).json(results);
    })
})

server.post("/products", (req, res) => {
    connection.query("INSERT INTO productos (nombre, precio) VALUES (?,?)",
    {replacements: [req.body.nombre, req.body.precio]})
    .then(()=> {
        res.status(200).json("Producto creado con éxito");
    })
})

server.get("/products/:id", (req, res) => {
    connection.query("SELECT * FROM productos WHERE id = :id",
    {replacements: {id: req.params.id }, type: connection.QueryTypes.SELECT})
    .then((results)=> {
        res.status(200).json(results);
    })
})

server.put("/products/:id", (req, res) => {
    connection.query("UPDATE productos SET nombre = ?, precio = ?, id = ? WHERE id = ?",
    {replacements: [req.body.nombre, req.body.precio, req.body.id ,req.params.id], type: Sequelize.QueryTypes.UPDATE})
    .then(()=> {
        res.status(201).json("Producto actualizado");
    })
})

server.delete("/products/:id", (req, res) => {
    connection.query("DELETE FROM productos WHERE id = ?",
    {replacements: [req.params.id], type: Sequelize.QueryTypes.DELETE})
    .then(()=> {
        res.status(200).json("Producto eliminado con éxito");
    })
})

// Endpoints de usuarios

server.post("/users", (req, res) => {
    connection.query("INSERT INTO usuarios (usuarios, nombre, apellido, email, telefono, direccion, admin) VALUES (?,?,?,?,?,?,?)",
    {replacements: [req.body.usuario, req.body.nombre, req.body.apellido, req.body.email, req.body.telefono, req.body.direccion, req.body.admin]})
    .then(()=> {
        res.status(200).json("Producto creado con éxito");
    })
})