// models.js

const {DataTypes, Model} = require('sequelize');
const {sequelize} = require('./index.js');

class User extends Model {
}

User.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false
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
			allowNull: true
		},
	},
	{
		sequelize,
		freezeTableName: true,
		timestamps: false,
		tableName: "User",
		// modelName: "User"
	}
);

User.beforeCreate((user) => {
	user.orders = user.orders || [];
})

class Order extends Model {
}

Order.init(
	{
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
		},
	},
	{
		sequelize,
		freezeTableName: true,
		timestamps: false,
		tableName: "Order",
		// modelName: "Order"
	}
);

class MenuItem extends Model {
}

MenuItem.init(
	{
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
	},
	{
		sequelize,
		timestamps: false,
		tableName: 'MenuItem',
		// modelName: "MenuItem"
	},
);

MenuItem.beforeSave((menuItem) => {
	menuItem.callQuantity = menuItem.callQuantity || 0;
	menuItem.callQuantity += 1;
});

class OrderMenu extends Model {
}

OrderMenu.init(
	{
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
	},
	{
		sequelize,
		freezeTableName: true,
		timestamps: false,
		tableName: 'OrderMenu',
	}
);

User.hasMany(Order, {as: 'userOrders', foreignKey: 'UserId'});
Order.belongsTo(User, {as: 'user', foreignKey: 'UserId'});

Order.belongsToMany(MenuItem, {
	through: OrderMenu,
	foreignKey: 'OrderId',
	otherKey: 'MenuId',
});

MenuItem.belongsToMany(Order, {
	through: OrderMenu,
	foreignKey: 'MenuId',
	otherKey: 'OrderId',
});

module.exports = {User, Order, MenuItem, OrderMenu};
