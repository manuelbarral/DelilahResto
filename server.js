const express = require('express');
const server = express();
const bodyParser = require('body-parser');

const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');
const connection = new Sequelize(
	'mysql://root@localhost:3306/delilah_resto'
);

const middleware = require('./middlewares');
const orders = require('./orders');

require('dotenv').config();

//process.env
const PORT = process.env.PORT;
const HOST = process.env.HOST;
const SERVER_KEY = process.env.SERVER_KEY;

server.listen(PORT, HOST, () => {
	console.log(`Server listening at http://${HOST}:${PORT}`);
});

server.use(bodyParser.json());

// product endpoints
server.get('/products', middleware.verifyLogin, (req, res) => {
	try {
		connection
			.query('SELECT * FROM products', {
				type: connection.QueryTypes.SELECT,
			})
			.then((results) => {
				if (results.length !== 0) {
					res.status(200).json(results);
				} else {
					res
						.status(404)
						.json(
							'El servidor no pudo encontrar el contenido solicitado!'
						);
				}
			});
	} catch (err) {
		res.status(500).json('Error interno en el servidor');
	}
});

server.get(
	'/products/:id',
	middleware.verifyLogin,
	middleware.verifyIdProducts,
	(req, res) => {
		connection
			.query('SELECT * FROM products WHERE id = :id', {
				replacements: {id: req.params.id},
				type: connection.QueryTypes.SELECT,
			})
			.then((results) => {
				res.status(200).json(results);
			});
	}
);

server.post(
	'/products',
	middleware.verifyLogin,
	middleware.adminPermission,
	middleware.validateInfoProduct,
	(req, res) => {
		connection
			.query('INSERT INTO products (name, price) VALUES (?,?)', {
				replacements: [req.body.name, req.body.price],
			})
			.then(() => {
				res.status(200).json('Producto creado con éxito');
			});
	}
);

server.put(
	'/products/:id',
	middleware.verifyLogin,
	middleware.adminPermission,
	middleware.verifyIdProducts,
	middleware.validateInfoProduct,
	(req, res) => {
		connection
			.query('UPDATE products SET name = ?, price = ? WHERE id = ?', {
				replacements: [req.body.name, req.body.price, req.params.id],
				type: connection.QueryTypes.UPDATE,
			})
			.then(() => {
				res.status(201).json('Producto actualizado');
			});
	}
);

server.delete(
	'/products/:id',
	middleware.verifyLogin,
	middleware.adminPermission,
	middleware.verifyIdProducts,
	(req, res) => {
		connection
			.query('DELETE FROM infoorders WHERE id= :id', {
				replacements: {id: req.params.id},
			})
			.then(() => {
				connection
					.query('DELETE FROM products WHERE id= :id', {
						replacements: {id: req.params.id},
					})
					.then(() => {
						res.status(204).json('Operación exitosa');
					});
			});
	}
);

// user endpoints
server.get(
	'/users',
	middleware.verifyLogin,
	middleware.adminPermission,
	(req, res) => {
		connection
			.query('SELECT * FROM users', {
				type: connection.QueryTypes.SELECT,
			})
			.then((results) => {
				if (results.length !== undefined) {
					res.json(results);
				} else {
					res.status(404).json('No hay usuarios registrados');
				}
			});
	}
);

server.get(
	'/users/:userName/myinfo',
	middleware.verifyLogin,
	(req, res) => {
		connection
			.query('SELECT * FROM users WHERE userName = ?', {
				replacements: [req.params.userName],
				type: connection.QueryTypes.SELECT,
			})
			.then((user) => {
				if (user[0].id > 0 && user[0].admin === 'false') {
					res.status(200).json(user);
				} else {
					res.status(404).json('Usuario no existe');
				}
			});
	}
);

server.get(
	'/users/admin/:userName/myinfo',
	middleware.verifyLogin,
	(req, res) => {
		connection
			.query('SELECT * FROM users WHERE userName = ?', {
				replacements: [req.params.userName],
				type: connection.QueryTypes.SELECT,
			})
			.then((user) => {
				if (user[0].id > 0 && user[0].admin === 'true') {
					res.status(200).json(user);
				} else {
					res.status(404).json('Usuario no existe');
				}
			});
	}
);

server.post(
	'/users/signup',
	middleware.validateInfoUser,
	(req, res) => {
		try {
			connection
				.query('SELECT * FROM users WHERE userName = ?', {
					replacements: [req.body.userName],
					type: connection.QueryTypes.SELECT,
				})
				.then((user) => {
					console.log(user);
					if (user.length > 0) {
						res
							.status(409)
							.json('UserName no disponible. Ingrese uno nuevo.');
					} else {
						connection
							.query(
								'INSERT INTO users (userName, psw, name, lastname, email, telephone, address, admin) VALUES (?,?,?,?,?,?,?,?)',
								{
									replacements: [
										req.body.userName,
										req.body.psw,
										req.body.name,
										req.body.lastname,
										req.body.email,
										req.body.telephone,
										req.body.address,
										req.body.admin,
									],
								}
							)
							.then(() => {
								res.status(201).json('Usuario creado con éxito');
							});
					}
				});
		} catch (err) {
			res.status(500).json('Error');
		}
	}
);

server.post(
	'/users/login',
	middleware.validateUserPassword,
	(req, res) => {
		const {userName, psw} = req.body;
		const token = jwt.sign({userName, psw}, SERVER_KEY);
		res.status(200).json({token});
	}
);

server.put(
	'/users/:userName',
	middleware.verifyLogin,
	middleware.adminPermission,
	middleware.validateInfoUser,
	(req, res) => {
		connection
			.query(
				'UPDATE users SET userName = ?, psw = ?, name = ?, lastname = ?, email = ?, telephone = ?, address = ?, admin = ? WHERE userName = ?',
				{
					replacements: [
						req.body.userName,
						req.body.psw,
						req.body.name,
						req.body.lastname,
						req.body.email,
						req.body.telephone,
						req.body.address,
						req.body.admin,
						req.params.userName,
					],
				}
			)
			.then(() => {
				res.status(201).json('Usuario actualizado');
			});
	}
);

server.delete(
	'/users/:id',
	middleware.verifyLogin,
	middleware.adminPermission,
	(req, res) => {
		connection
			.query('SELECT * FROM orders WHERE id_user= :id', {
				replacements: {id: req.params.id},
			})
			.then((results) => {
				let id_order = results[0][0].id;
				connection
					.query('DELETE FROM infoorders WHERE id_order= :id', {
						replacements: {id: id_order},
					})
					.then(() => {
						connection
							.query('DELETE FROM orders WHERE id_user= :id', {
								replacements: {id: req.params.id},
							})
							.then(() => {
								connection
									.query('DELETE FROM users WHERE id= :id', {
										replacements: {id: req.params.id},
									})
									.then(() => {
										res
											.status(204)
											.json('Usuario eliminado con éxito');
									});
							});
					});
			});
	}
);

// order endpoints
server.get(
	'/orders',
	middleware.verifyLogin,
	middleware.adminPermission,
	(req, res) => {
		connection
			.query(
				'SELECT orders.state, orders.dateOrder, orders.id, orders.description, orders.paymentMethod, orders.price, users.name,users.lastname, users.address FROM users INNER JOIN orders ON orders.id_user  = users.id',
				{type: connection.QueryTypes.SELECT}
			)
			.then((results) => {
				if (results.length > 0) {
					res.status(200).json({results});
				} else {
					res.status(404).json('No hay pedidos registrados');
				}
			});
	}
);

server.get(
	'/orders/:id',
	middleware.verifyLogin,
	middleware.adminPermission,
	middleware.verifyIdOrders,
	(req, res) => {
		connection
			.query('SELECT * FROM orders WHERE id = ?', {
				replacements: [req.params.id],
				type: connection.QueryTypes.SELECT,
			})
			.then((order) => {
				if (order.length > 0) {
					res.status(200).json(order);
				} else {
					res
						.status(404)
						.json('No existe pedido registrado con ese id');
				}
			});
	}
);

server.get(
	'/orders/:userName/myOrder',
	middleware.verifyLogin,
	(req, res) => {
		const token = req.headers.authorization.split(' ')[1];
		verifyToken = jwt.verify(token, SERVER_KEY);
		connection
			.query(
				'SELECT orders.state, orders.dateOrder, orders.id, orders.description, orders.paymentMethod, orders.price, users.name, users.lastname, users.address FROM users INNER JOIN orders ON orders.id_user  = users.id WHERE userName = ?',
				{
					replacements: [verifyToken.userName],
					type: connection.QueryTypes.SELECT,
				}
			)
			.then((results) => {
				if (results) {
					res.status(200).json(results);
				} else {
					res
						.status(404)
						.json('Parece que no has hecho ningún pedido por ahora.');
				}
			});
	}
);

server.post(
	'/orders',
	middleware.verifyLogin,
	middleware.validateInfoOrder,
	orders.saveOrder
);

server.patch(
	'/orders/:id',
	middleware.verifyLogin,
	middleware.adminPermission,
	middleware.verifyIdOrders,
	(req, res) => {
		connection
			.query('UPDATE orders SET state = ? WHERE id = ?', {
				replacements: [req.body.state, req.params.id],
			})
			.then(() => {
				res.status(201).json('Estado de pedido actualizado');
			});
	}
);

server.delete(
	'/orders/:id',
	middleware.verifyLogin,
	middleware.adminPermission,
	middleware.verifyIdOrders,
	(req, res) => {
		connection
			.query('DELETE FROM infoorders WHERE id_order= :id', {
				replacements: {id: req.params.id},
			})
			.then(() => {
				connection
					.query('DELETE FROM orders WHERE id= :id', {
						replacements: {id: req.params.id},
					})
					.then(() => {
						res.status(204).json('Pededio eliminado con éxito');
					});
			});
	}
);
