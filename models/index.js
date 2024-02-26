const {Sequelize} = require('sequelize');


const sequelize = new Sequelize('test', 'postgres', '', {
	dialect: "postgres",
	host: 'localhost',
	port: 5432,
	logging: false
});

sequelize.authenticate()
	.then(() => {
		console.log('Соединение успешно установлено.');
	})
	.catch((err) => {
		console.error('Невозможно подключиться к базе данных:', err);
	});

sequelize
	.sync()
	.then(() => {
		console.log("Таблицы успешно созданы (если они не существуют)");
	})
	.catch((error) => {
		console.error("Ошибка при создании таблиц:", error);
	});

module.exports = {sequelize};
