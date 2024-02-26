const {Order, User, MenuItem, OrderMenu} = require('../models/model.js');
const {sequelize} = require('../models/index.js');

class OrderService {
	async createOrder(UserId, items) {
		const t = await sequelize.transaction();

		try {
			if (!UserId || !items || !Array.isArray(items) || !items.every(item => Number.isInteger(item))) {
				throw new Error('Некорректные входные данные');
			}
			const user = await User.findByPk(UserId);
			if (!user) {
				throw new Error('Пользователь не найден');
			}

			const createdOrder = await Order.create({isActive: true, UserId: UserId, items: []}, {transaction: t});

			const menuItems = await MenuItem.findAll({
				where: {id: items.map(Number)},
			});
			if (menuItems.length !== items.length) {
				throw new Error('Одно или несколько блюд не найдены в меню');
			}

			for (const menuItem of menuItems) {
				await menuItem.increment('callQuantity', {by: 1, transaction: t})
			}

			const itemIds = menuItems.map(item => item.id);
			await createdOrder.update({items: [...(createdOrder.items || []), ...items.map(Number)]}, {transaction: t});

			await OrderMenu.create({UserId: UserId, OrderId: createdOrder.id, MenuId: itemIds}, {transaction: t});
			user.orders = [...user.orders, createdOrder.id];
			await user.update({orders: user.orders}, {transaction: t});

			await t.commit();

			return {success: true, data: createdOrder};
		} catch (error) {
			await t.rollback();
			return {success: false, error: error.message};
		}
	}

	async getOrders() {
		try {
			return await Order.findAll({
				include: [
					{
						model: MenuItem,
						through: {
							model: OrderMenu,
							attributes: [],
						},
					},
					{
						model: User,
						as: 'user',// Добавлено: включить информацию о пользователе
						attributes: ['name'], // Выберите необходимые атрибуты пользователя
					},
				],
			});

		} catch (error) {
			console.error('Error fetching orders data:', error.message);
			throw new Error('Error fetching orders data');
		}
	}


	async updateOrder(orderId, updatedOrderData) {
		try {
			const existingOrder = await Order.findByPk(orderId);
			if (!existingOrder) {
				throw new Error('Заказ не найден');
			}

			await existingOrder.update({isActive: true, ...updatedOrderData});

			return {message: 'Заказ успешно обновлен'};
		} catch (error) {
			throw new Error(error.message);
		}
	}


	async findOrderById(orderId) {
		try {
			const foundOrder = await Order.findByPk(orderId, {
				include: [
					{
						model: MenuItem,
						through: {
							model: OrderMenu,
							attributes: [],
						},
					},
					{
						model: User,
						as: 'user',
						attributes: ['name'],
					},
				],
			});

			if (!foundOrder) {
				throw new Error('Заказ не найден');
			}

			return foundOrder;
		} catch (error) {
			throw new Error(error.message);
		}
	}


	async deleteOrder(orderId) {
		const t = await sequelize.transaction();

		try {
			const [_, updatedOrder] = await Order.update(
				{isActive: false},
				{
					where: {id: orderId},
					returning: true,
					transaction: t,
				}
			);

			if (!updatedOrder[0]) {
				throw new Error('Заказ не найден');
			}

			const updatedOrderId = updatedOrder[0].id;

			await User.update(
				{orders: sequelize.literal(`array_remove(orders, ${updatedOrderId})`)},
				{where: {}, returning: true, transaction: t}
			);

			await t.commit();

			return {message: 'Заказ удален'};
		} catch (error) {
			await t.rollback();
			throw new Error(error.message);
		}
	}
}

module.exports = new OrderService();
