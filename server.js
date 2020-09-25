const express = require("express");
const server = express();
const bodyParser = require("body-parser");

const jwt = require("jsonwebtoken");
const Sequelize = require("sequelize");
const connection = new Sequelize("mysql://root@localhost:3306/delilah_resto");

const middleware = require("./middlewares");

require("dotenv").config();

//process.env
const PORT = process.env.PORT;
const HOST = process.env.HOST;

server.listen(port, host, ()=> {
    console.log(`Server listening at http://${HOST}:${PORT}`);
});

server.use(bodyParser.json());

//Endpoints de products
server.get("/products", middleware.verifyLogin, (req, res) => {
    connection.query("SELECT * FROM products",
    {type: Sequelize.QueryTypes.SELECT})
    .then((results)=> {
        if(results.length !== 0) {
            res.json(results);
        } else {
            res.status(404).json({ok: "false", res: "Sin productos registrados!"});
        }
    });
});

server.post("/products", middleware.verifyLogin, middleware.adminPermission, middleware.validateInfoProduct, (req, res) => {
    connection.query("INSERT INTO products (name, price) VALUES (?,?)",
    {replacements: [req.body.name, req.body.price]})
    .then((results)=> {
        console.log("Producto creado con éxito", results);
        res.status(200).json({ok: "true", res: "Producto creado con éxito"});
    });
});

server.get("/products/:id", middleware.verifyLogin, middleware.verifyIdProducts, (req, res) => {
    connection.query("SELECT * FROM products WHERE id = :id",
    {replacements: {id: req.params.id }, type: connection.QueryTypes.SELECT})
    .then((results)=> {
        res.status(200).json(results);
    });
});

server.put("/products/:id", middleware.verifyLogin, middleware.adminPermission, middleware.verifyIdProducts, middleware.validateInfoProduct, (req, res) => {
    connection.query("UPDATE products SET name = ?, price = ?, id = ? WHERE id = ?",
    {replacements: [req.body.name, req.body.price,req.params.id], type: Sequelize.QueryTypes.UPDATE})
    .then((results)=> {
        res.status(201).json({ok: "true", res: "Producto actualizado", results});
    });
});

server.delete("/products/:id", middleware.verifyLogin, middleware.adminPermission, middleware.verifyIdProducts, (req, res) => {
    connection.query("DELETE FROM products WHERE id = ?",
    {replacements: [req.params.id], type: Sequelize.QueryTypes.DELETE})
    .then(()=> {
        res.status(204).json("Producto eliminado con éxito");
    });
});

// Endpoints de users
server.post("/users/signup", middleware.validateInfoUser, (req, res) => {
    
});