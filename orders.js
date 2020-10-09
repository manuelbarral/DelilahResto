const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');
const connection = new Sequelize(
	'mysql://root@localhost:3306/delilah_resto'
);

const moment = require('moment');

require('dotenv').config();
//process.env
const SERVER_KEY = process.env.SERVER_KEY;

let orderPrice = 0;
let ordersProducts = [];

async function saveOrder(req, res) {
	try {
		let reqProducts = req.body.products;
		reqProducts.forEach(quantityProduct);
		const orderDescription = ordersProducts.toString();
		const orderDate = moment().format('YYYY-MM-DD');
		const userId = await idUser(req);
		const orderPrice = await price(req);
		const orderId = await saveArmedOrder(
			userId,
			orderDescription,
			orderDate,
			req,
			orderPrice
		);
		await saveInfoOrder(req, res, orderId);
	} catch (err) {
		res.status(400).json(err);
	}
}

function quantityProduct(element) {
	ordersProducts.push(element.name + ' ' + 'X' + element.quantity);
}

async function idUser(req) {
	const token = req.headers.authorization.split(' ')[1];
	verifyToken = jwt.verify(token, SERVER_KEY);
	let infoUser = await connection.query(
		'SELECT * FROM users WHERE userName = ?',
		{
			replacements: [verifyToken.userName],
			type: connection.QueryTypes.SELECT,
		}
	);
	return infoUser[0].id;
}

async function price(req) {
	const productsList = await connection.query(
		'SELECT * FROM products',
		{type: connection.QueryTypes.SELECT}
	);
	for (i = 0; i < req.body.products.length; i++) {
		let searchProduct = (product) => {
			return product.name == req.body.products[i].name;
		};
		let priceProduct = productsList.find(searchProduct).price;
		let priceMultiplied =
			priceProduct * req.body.products[i].quantity;
		orderPrice = orderPrice + priceMultiplied;
	}
	return orderPrice;
}

async function saveArmedOrder(
	idUsuario,
	descripcionPedido,
	fechaDePedido,
	req,
	montoPedidoFinal
) {
	const idPedido = await connection.query(
		'INSERT INTO orders (id_user, description, dateOrder, paymentMethod, price, state) VALUES (?,?,?,?,?,?)',
		{
			replacements: [
				idUsuario,
				descripcionPedido,
				fechaDePedido,
				req.body.paymentMethod,
				montoPedidoFinal,
				'Nuevo',
			],
		}
	);
	return idPedido[0];
}

async function saveInfoOrder(req, res, orderId) {
	for (i = 0; i < req.body.products.length; i++) {
		const idProducts = await connection.query(
			'SELECT id FROM products WHERE name = ?',
			{
				replacements: [req.body.products[i].name],
				type: connection.QueryTypes.SELECT,
			}
		);
		connection.query(
			'INSERT INTO infoorders (id_order, id_product) VALUES (?,?)',
			{replacements: [orderId, idProducts[0].id]}
		);
	}
	return res.status(201).json('Pedido solicitado con éxito');
}

module.exports = {
	saveOrder,
};
