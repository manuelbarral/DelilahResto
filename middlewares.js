const jwt = require("jsonwebtoken");
const Sequelize = require("sequelize");
const connection = new Sequelize("mysql://root@localhost:3306/delilah_resto");

require("dotenv").config();

const SERVER_KEY = process.env.SERVER_KEY;

let verifyToken;

function verifyLogin(req, res, next) {
    const headerAuthorization = req.headers.authorization;
    if(headerAuthorization !== undefined) {
        next();
    } else {
        res.status(401).json({ok: "false", res: "Debes iniciar sesión!"});
    }
}

function verifyIdProducts(req, res, next) {
    connection.query("SELECT * FROM products WHERE id = ?", 
    {replacements: [req.params.id], type: Sequelize.QueryTypes.SELECT}
    )
    .then((product) => {
        if(product !== 0) {
            next();
        } else {
            res.status(404).json({ok: "false", res: "No hay ningún producto registrado con ese id!"});
        }
    });
};

function adminPermission(req, res, next) {
    const token = req.headers.authorization.split(" ")[1];
    verifyToken = jwt.verify(token, SERVER_KEY);
    connection.query("SELECT * FROM users WHERE userName = ?", 
    {replacements: [verifyToken.userName], type: Sequelize.QueryTypes.SELECT})
    .then((user) => {
        if(user[0].admin === "true") {
            next();
        } else {
            res.status(401).json({ok: "false", res: "No cuentas con los permisos necesarios para realizar esta operación!"});
        }
    });
};

function validateInfoProduct(req, res, next) {
    const {name, price} = req.body;
    if(!name || !price) {
        res.status(400).json({ok: "false", res: "Ingresar todos los datos para crear un nuevo producto"});
    } else {
        next();
    }
};

function validateInfoUser(req, res, next) {
    const {userName, password, name, lastname, email, telephone, address, admin} = req.body;
    if(!userName || !password || !name || !lastname || !email || !telephone || !address || !admin) {
        res.status(400).json({ok: "false", res: "Completar todos los datos para crear la cuenta"});
    } else {
        next();
    }
};

function validateUserPassword(req, res, next) {
    connection.query("SELECT * FROM users WHERE userName = ?",
    {replacements: [req.body.userName], type: Sequelize.QueryTypes.SELECT})
    .then((user) => {
        if(user.password === req.body.password) {
            next();
        } else {
            res.status(401).json({ok: "false", res: "Usuario o contraseña incorrecta"});
        }
    });
};

function verifyIdOrders(req, res, next) {
    connection.query("SELECT * FROM orders WHERE id = ?",
    {replacements: [req.params.id], type: Sequelize.QueryTypes.SELECT})
    .then((order) => {
        if(order !== 0) {
            next();
        } else {
            res.status(404).json({ok: "false", res: "No existe pedido con ese id"});
        }
    });
};

function validateInfoOrder(req, res, next) {
    const {id, name, price, paymentMethod, address} = req.body;
    if(!id || !name || !price || !paymentMethod || !address) {
        res.status(400).json({ok: "false", res: "Ingresar todos los datos para crear un nuevo pedido"});
    } else {
        next();
    }
};

module.exports = {
    verifyLogin,
    adminPermission,
    validateInfoProduct,
    verifyIdProducts,
    validateInfoUser,
    validateUserPassword,
    verifyIdOrders,
    validateInfoOrder
}