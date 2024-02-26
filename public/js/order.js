document.addEventListener('DOMContentLoaded', function () {
	const closeOrderButton = document.getElementById('closeOrderButton');
	const orderIdInput = document.getElementById('orderId');
	const orderButton = document.getElementById('orderButton');
	const orderForm = document.getElementById('orderForm');
	const orderFormContainer = document.getElementById('orderFormContainer');

	const employeeForm = document.getElementById('orderFormContainer');
	if (!employeeForm) {
		// Если формы нет, значит, мы на другой странице, и скрипт не должен выполняться
		// console.error('Скрипт order.js не должен выполняться на этой странице.');
		return;
	}

	// Обработчик кнопки "Показать заказ"
	orderButton.addEventListener('click', async function () {
		const orderId = orderIdInput.value;

		try {
			const response = await fetch(`http://localhost:8080/order/${orderId}`);

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const data = await response.json();

			// Проверяем, найден ли заказ
			if (response.ok) {
				updateOrderDetails(data);
				orderFormContainer.style.display = 'none'; // Скрываем контейнер формы
			} else {
				console.error('Error fetching order data:', data.message);
				// Выводим сообщение об ошибке пользователю
			}
		} catch (error) {
			console.error('Error fetching order data:', error.message);
			// Выводим сообщение об ошибке пользователю
		}
	});

	// Обработчик кнопки "Закрыть заказ"
	closeOrderButton.addEventListener('click', async function () {
		const orderId = orderIdInput.value;

		try {
			const response = await fetch(`http://localhost:8080/order/${orderId}`, {
				method: 'POST',
			});

			if (response.ok) {
				// Успешно закрыт заказ, выполните необходимые действия
				orderFormContainer.style.display = 'none';
			} else {
				console.error('Error closing order:', response.statusText);
				// Отобразите сообщение об ошибке пользователю
			}
		} catch (error) {
			console.error('Error closing order:', error.message);
			// Отобразите сообщение об ошибке пользователю
		}
	});

	// Обработчик формы для предотвращения отправки запроса по умолчанию
	orderForm.addEventListener('submit', function (event) {
		event.preventDefault();
	});

	// Функция для обновления данных на странице
	async function updateOrderDetails(data) {
		console.log('Received Order Data:', data);

		const orderList = document.getElementById('orderList');
		orderList.innerHTML = ''; // Очистим содержимое, чтобы избежать дублирования данных

		const table = document.createElement('table');

		const thead = document.createElement('thead');
		const headerRow = document.createElement('tr');
		const headers = ['Наименование блюда', 'Изображение'];

		headers.forEach(headerText => {
			const th = document.createElement('th');
			th.textContent = headerText;
			headerRow.appendChild(th);
		});

		thead.appendChild(headerRow);
		table.appendChild(thead);

		const tbody = document.createElement('tbody');

		// Добавим проверку на наличие свойства items и является ли оно массивом
		if (data.order.items && Array.isArray(data.order.items)) {
			// Создадим массив промисов для получения данных о каждом блюде в заказе
			const menuItemPromises = data.order.items.map(async itemId => {
				try {
					// Запрос на сервер для получения данных о блюде
					const menuItemResponse = await fetch(`http://localhost:8080/menu/${itemId}`);

					if (!menuItemResponse.ok) {
						throw new Error(`HTTP error! Status: ${menuItemResponse.status}`);
					}

					const menuItemData = await menuItemResponse.json();

					// Возвращаем данные о блюде
					return menuItemData;
				} catch (menuItemError) {
					console.error('Error fetching menu item data:', menuItemError.message);
					// Возвращаем объект с информацией об ошибке
					return {
						title: 'Error: Menu item not found',
						picture: 'error.jpg', // Укажите путь к изображению для ошибки
					};
				}
			});

			try {
				// Дождемся выполнения всех промисов
				const menuItems = await Promise.all(menuItemPromises);

				// Теперь у вас есть массив menuItems с полной информацией о каждом блюде в заказе
				menuItems.forEach(menuItem => {
					// Создаем элементы для таблицы и добавляем их в tbody
					const tr = document.createElement('tr');

					const tdName = document.createElement('td');
					tdName.textContent = menuItem.title;

					const tdImage = document.createElement('td');
					const img = document.createElement('img');
					img.src = menuItem.picture;
					img.alt = menuItem.title;
					img.style.maxWidth = '100px';
					tdImage.appendChild(img);

					tr.appendChild(tdName);
					tr.appendChild(tdImage);

					tbody.appendChild(tr);
				});
			} catch (error) {
				// Обработка ошибок при получении данных о блюдах
				console.error('Error fetching menuItems data:', error.message);
				// Можно предпринять дополнительные действия по обработке ошибок
			}
		} else {
			// Если свойство items отсутствует или не является массивом, выведите сообщение об ошибке или предпримите другие действия по вашему усмотрению.
			console.error('Error: items array is missing or not an array');
		}

		table.appendChild(tbody);

		orderList.appendChild(table);

		const totalPriceParagraph = document.createElement('p');
		totalPriceParagraph.textContent = `Текущая стоимость заказа: ${data.order.totalPrice} рублей`;
		orderList.appendChild(totalPriceParagraph);

		const closeOrderButton = document.createElement('button');
		closeOrderButton.id = 'closeOrderButton';
		closeOrderButton.className = 'btn waves-effect waves-light';
		closeOrderButton.textContent = 'Закрыть заказ';

		closeOrderButton.addEventListener('click', async function () {
			const orderId = data.order.id;

			try {
				const response = await fetch(`http://localhost:8080/order/${orderId}`, {
					method: 'POST',
				});

				if (response.ok) {
					window.location.reload();
				} else {
					console.error('Error closing order:', response.statusText);
				}
			} catch (error) {
				console.error('Error closing order:', error.message);
			}
		});

		orderList.appendChild(closeOrderButton);
	}

});
