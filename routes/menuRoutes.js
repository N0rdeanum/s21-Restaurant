const {Router} = require('express');
const menuService = require("../services/menuService.js");

const menuRouter = Router();

menuRouter.get("/menu", async (req, res) => {
	try {
		const menuItems = await menuService.getMenu();

		if (!menuItems || menuItems.length === 0) {
			const title = "Меню";
			const isMenu = true;
			return res.render("menu", {menuItems: [], title, isMenu, noMenu: true});
		}

		const title = "Меню";
		const isMenu = true;
		res.render("menu", {menuItems, title, isMenu});
	} catch (err) {
		console.error('Error fetching menu:', err);
		res.status(500).json({error: "Internal Server Error"});
	}
});

menuRouter.get('/menuItem/:id', async (req, res) => {
	const itemId = req.params.id;

	try {
		const menuItem = await menuService.findMenuItemById(itemId);

		if (!menuItem) {
			res.status(404).json({error: 'Товар не найден'});
			return;
		}

		res.json(menuItem);
	} catch (error) {
		console.error('Error fetching menu item:', error);
		res.status(500).json({error: 'Ошибка при получении информации о товаре'});
	}
});

menuRouter.post("/menu", async (req, res) => {
	try {
		const createMenu = await menuService.createMenuItem(req.body);
		res.status(200).json(createMenu);
	} catch (err) {
		res.status(500).send(err.message);
	}
});

module.exports = menuRouter;
