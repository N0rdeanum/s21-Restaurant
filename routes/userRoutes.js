const {Router} = require('express');
const userService = require("../services/userService.js");

const userRouter = Router();

userRouter.get('/user', async (req, res) => {
	try {
		const users = await userService.getUsers();
		res.status(200).json(users);
	} catch (err) {
		res.status(500).json(err.message);
	}
});

userRouter.post('/waiters', async (req, res) => {
	try {
		const user = await userService.createUser(req.body);
		res.status(200).json(user);
	} catch (err) {
		res.status(500).json(err.message);
	}
});

userRouter.get('/user/:id', async (req, res) => {
	const userId = req.params.id;

	try {
		const employeeOrders = await userService.getEmployeeOrders(userId);
		res.status(200).json(employeeOrders);
	} catch (error) {
		console.error('Ошибка при получении заказов сотрудника:', error);
		res.status(500).json({error: 'Внутренняя ошибка сервера'});
	}
});

module.exports = userRouter;
