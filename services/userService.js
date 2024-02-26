const {sequelize} = require('../models/index.js');

const {User, Order, MenuItem} = require('../models/model.js');

class UserService {
	async getUsers() {
		try {
			return await User.findAll();
		} catch (error) {
			throw new Error('Error fetching user data');
		}
	}

	async getEmployeeOrders(userId) {
		try {
			const user = await User.findByPk(userId, {
				include: [{
					model: Order,
					as: 'userOrders',
					include: [{
						model: MenuItem,
						through: {
							attributes: []
						},
						attributes: ['title', 'cost']
					}]
				}],
			});

			if (!user) {
				throw new Error('Сотрудник не найден');
			}

			return user.userOrders || [];
		} catch (error) {
			throw new Error(error.message);
		}
	}

	async createUser(data) {
		const t = await sequelize.transaction();
		try {
			const createdUser = await User.create(data, {transaction: t});
			await t.commit();
			return createdUser;
		} catch (error) {
			console.error('Ошибка создания пользователя:', error.message);
			if (t) {
				await t.rollback();
			}
			throw new Error(error.message);
		}
	}
}

module.exports = new UserService();
