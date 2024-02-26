'use strict';

const {DataTypes} = require('sequelize');

module.exports = {
	async up(queryInterface, Sequelize) {
		// Создаем таблицу User
		await queryInterface.createTable('User', {
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			orders: {
				type: DataTypes.ARRAY(DataTypes.INTEGER),
			},
			role: {
				type: DataTypes.STRING,
				allowNull: true,
			},
		});

		// Создаем таблицу Order
		await queryInterface.createTable('Order', {
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
			},
			isActive: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
			},
			items: {
				type: DataTypes.ARRAY(DataTypes.INTEGER),
				defaultValue: [],
			},
			UserId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'User',
					key: 'id',
				},
			},
		});

		// Создаем таблицу MenuItem
		await queryInterface.createTable('MenuItem', {
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
			},
			title: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			picture: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			cost: {
				type: DataTypes.FLOAT,
				allowNull: false,
			},
			callQuantity: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			description: {
				type: DataTypes.STRING,
			},
		});

		// Создаем таблицу OrderMenu
		await queryInterface.createTable('OrderMenu', {
			MenuId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				references: {
					model: 'MenuItem',
					key: 'id',
				},
			},
			OrderId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				references: {
					model: 'Order',
					key: 'id',
				},
			},
		});
	},

	async down(queryInterface, Sequelize) {
		// Удаляем таблицы в обратном порядке
		await queryInterface.dropTable('OrderMenu');
		await queryInterface.dropTable('MenuItem');
		await queryInterface.dropTable('Order');
		await queryInterface.dropTable('User');
	}
};
