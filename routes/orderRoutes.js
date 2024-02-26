const {Router} = require("express");
const orderService = require("../services/orderService");
const userService = require('../services/userService')
const menuService = require('../services/menuService')

const orderRouter = Router();

orderRouter.post('/order', async (req, res) => {
	try {
		console.log('Received createOrder request:', req.body);
		let requestItems = req.body.items.map(Number);
		const {userId} = req.body;
		const createdOrder = await orderService.createOrder(userId, requestItems.map(Number));
		res.status(200).json(createdOrder);
	} catch (err) {
		console.error('Error creating order:', err.message);
		res.status(500).send(err.message);
	}
});

orderRouter.get('/orders', async (req, res) => {
	try {
		const waiters = await userService.getUsers({where: {role: 'waiter'}});
		const menuItems = await menuService.getMenu()
		const title = "Заказы";
		const isOrders = true;
		res.render("orders", {
			ordersScript: true,
			waiters, menuItems, title, isOrders
		});
	} catch (err) {
		res.status(500).send(err.message);
	}
});

orderRouter.put('/order/:id', async (req, res) => {
	try {
		const orderId = req.params.id;
		const updatedOrderData = {
			isActive: true,
			...req.body,
		};

		const result = await orderService.updateOrder(orderId, updatedOrderData);
		res.status(200).json(result);
	} catch (err) {
		res.status(500).send(err.message);
	}
});

orderRouter.delete('/order/:id', async (req, res) => {
	try {
		const orderId = req.params.id;
		const result = await orderService.deleteOrder(orderId);
		res.status(200).json(result);
	} catch (err) {
		res.status(500).send(err.message);
	}
});

orderRouter.get('/order/:id', async (req, res) => {
	try {
		const orderId = req.params.id;
		const foundOrder = await orderService.findOrderById(orderId);

		if (foundOrder) {
			console.log('Found Order:', foundOrder);
			res.json({order: foundOrder});
		} else {
			res.status(404).json({error: 'Заказ не найден'});
		}
	} catch (err) {
		console.error('Error fetching order data:', err.message);
		res.status(500).json({error: 'Внутренняя ошибка сервера'});
	}
});

module.exports = orderRouter;
