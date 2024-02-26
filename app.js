const express = require('express');
const exphbs = require('express-handlebars');
const path = require("path");
const {fileURLToPath} = require('url');

const menuRouter = require('./routes/menuRoutes.js');
const userRouter = require("./routes/userRoutes.js");
const orderRouter = require("./routes/orderRoutes.js");

const PORT = 8080;

const app = express();
const hbs = exphbs.create({
	defaultLayout: "main",
	extname: "hbs",
	runtimeOptions: {
		allowProtoPropertiesByDefault: true,
		allowProtoMethodsByDefault: true,
	},
	helpers: {
		formatCurrency: function (value) {
			return new Intl.NumberFormat('ru-RU', {
				style: 'currency',
				currency: 'rub'
			}).format(value);
		}
	}
});

const currentDirname = path.dirname(__filename);

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");

app.use(express.json());
app.use(express.static(path.join(currentDirname, 'public')));

app.get('/', (req, res) => {
	res.render('index', {
		completedOrdersScript: true,
		title: "Главная",
		isHome: true
	});
});

app.get('/order', (req, res) => {
	res.render('orderDetailsView', {
		orderScript: true,
		title: 'Информация о заказе',
	});
});

app.use("/", menuRouter);
app.use("/", orderRouter);
app.use("/", userRouter);

const server = app.listen(PORT, () => {
	console.log("start server " + PORT);
});

process.on('SIGTERM', () => {
	server.close(() => {
		console.log('Server is gracefully terminating.');
		process.exit(0);
	});
});
