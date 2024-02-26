// seed-data.js

const {User, Order, MenuItem, OrderMenu} = require('../models/model');

module.exports = {
	up: async (queryInterface, Sequelize) => {
		try {
			// Создаем пользователей
			const user1 = await User.create({
				name: 'Иванов',
				role: 'admin',
			});

			const user2 = await User.create({
				name: 'Петров',
				role: 'waiter',
			});

			// Создаем заказы
			const order1 = await Order.create({
				isActive: true,
				UserId: user1.id,
			});

			const order2 = await Order.create({
				isActive: false,
				UserId: user1.id,
			});

			const order3 = await Order.create({
				isActive: true,
				UserId: user2.id,
			});

			await user1.addUserOrders([order1, order2]);
			await user2.addUserOrders([order3]);


			// Создаем блюда меню
			const menuItem1 = await MenuItem.create({
				title: 'Бургер',
				picture: 'burger.jpeg',
				cost: 599.99,
				callQuantity: 5,
				description: 'С говядиной 340 грамм',
			});

			const menuItem2 = await MenuItem.create({
				title: 'Пицца Мясное Ассорти',
				picture: 'pizza.jpeg',
				cost: 699,
				callQuantity: 8,
				description: 'Бекон, говядина, свинина и куриная грудка.',
			});

			const menuItem3 = await MenuItem.create({
				title: 'Ролл «Филадельфия»',
				picture: 'roll.jpeg',
				cost: 309,
				callQuantity: 12,
				description: 'Копченого лосось, сливочный сыр,'
			});

			// Связываем заказы с блюдами
			await order1.addMenuItems([menuItem1, menuItem2]);
			await order2.addMenuItems([menuItem3]);
			await order3.addMenuItems([menuItem2]);

			// Обновляем поле items для каждого заказа
			const menuItemsOrder1 = await order1.getMenuItems();
			await order1.update({items: menuItemsOrder1.map(item => item.id)});

			const menuItemsOrder2 = await order2.getMenuItems();
			await order2.update({items: menuItemsOrder2.map(item => item.id)});

			const menuItemsOrder3 = await order3.getMenuItems();
			await order3.update({items: menuItemsOrder3.map(item => item.id)});

			// Обновляем поле orders для каждого пользователя
			const ordersUser1 = await user1.getUserOrders();
			await user1.update({orders: ordersUser1.map(order => order.id)});

			const ordersUser2 = await user2.getUserOrders();
			await user2.update({orders: ordersUser2.map(order => order.id)});

			console.log('Заполнение базы данных завершено успешно.');
		} catch (error) {
			console.error('Ошибка при заполнении базы данных:', error);
			throw error; // Перебрасываем ошибку, чтобы сид не прошел, если что-то пошло не так
		}
	},

	down: async (queryInterface, Sequelize) => {
		// В методе down удаляем все созданные записи
		await OrderMenu.destroy({where: {}});
		await Order.destroy({where: {}});
		await MenuItem.destroy({where: {}});
		await User.destroy({where: {}});
	}
};
