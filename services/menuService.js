const {sequelize, MenuItem} = require('../models/model.js');

class MenuService {
	async getMenu() {
		try {
			const menuItems = await MenuItem.findAll();
			console.log('Menu items:', menuItems); // Добавьте этот вывод
			return menuItems;
		} catch (error) {
			console.error('Error fetching menu data:', error); // Добавьте этот вывод
			throw new Error('Error fetching menu data');
		}
	}

	async createMenuItem(data) {
		const t = await sequelize.transaction();
		try {
			const createdMenu = await MenuItem.create(data, {transaction: t});
			await t.commit();
			return createdMenu;
		} catch (error) {
			await t.rollback();
			throw new Error(error.message);
		}
	}

	async findMenuItemById(itemId) {
		try {
			const menuItem = await MenuItem.findByPk(itemId);
			return menuItem;
		} catch (error) {
			throw new Error('Ошибка при поиске товара по ID');
		}
	}

}

module.exports = new MenuService();
