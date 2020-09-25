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

//login
server.post("/login", (req, res) => {
    const userName = req.body.userName;
    const password = String(req.body.password);
    const token = validUser(userName, password);
    if(token) {
        res.status(200).json({token});
    } else {
        res.status(401).send("Usuario invalido");
    }
});

function validUser(userName, password) {
    const user = users.find((element) => {
        if(user === element.userName && String(password) === element.password) {
            return true;
        } else {
            return false;
        }
    });

    if(user) {
        const token = jwt.sign({userName, password}, server_key);
        return token;
    } else {
        return false;
    }
};

//Endpoints de productos
server.get("/products", (req, res) => {
    connection.query("SELECT * FROM products",
    {type: Sequelize.QueryTypes.SELECT})
    .then((results)=> {
        res.status(200).json(results);
    });
});

server.post("/products", (req, res) => {
    connection.query("INSERT INTO products (name, price) VALUES (?,?)",
    {replacements: [req.body.name, req.body.price]})
    .then(()=> {
        res.status(200).json("Producto creado con éxito");
    });
});

server.get("/products/:id", (req, res) => {
    connection.query("SELECT * FROM products WHERE id = :id",
    {replacements: {id: req.params.id }, type: connection.QueryTypes.SELECT})
    .then((results)=> {
        res.status(200).json(results);
    });
});

server.put("/products/:id", (req, res) => {
    connection.query("UPDATE products SET name = ?, price = ?, id = ? WHERE id = ?",
    {replacements: [req.body.name, req.body.price, req.body.id ,req.params.id], type: Sequelize.QueryTypes.UPDATE})
    .then(()=> {
        res.status(201).json("Producto actualizado");
    });
});

server.delete("/products/:id", (req, res) => {
    connection.query("DELETE FROM products WHERE id = ?",
    {replacements: [req.params.id], type: Sequelize.QueryTypes.DELETE})
    .then(()=> {
        res.status(200).json("Producto eliminado con éxito");
    });
});

// Endpoints de usuarios

server.get("/users", (req, res) => {
    connection.query("SELECT * FROM users",
    {type: Sequelize.QueryTypes.SELECT})
    .then((results)=> {
        res.status(200).json(results);
    });
});

server.post("/users", (req, res) => {
    connection.query("INSERT INTO users (user, password, name, lastname, email, telephone, address, admin) VALUES (?,?,?,?,?,?,?,?)",
    {replacements: [req.body.user, req.body.password, req.body.name, req.body.lastname, req.body.email, req.body.telephone, req.body.address, req.body.admin]})
    .then(()=> {
        res.status(200).json("Producto creado con éxito");
    });
});