document.querySelectorAll('.price').forEach(node => {
	node.textContent = new Intl.NumberFormat('ru-RU', {
		currency: 'rub',
		style: 'currency'
	}).format(Number(node.textContent));
});

async function fetchAndDisplayOrders(orderStatus) {
	const ordersList = document.getElementById('list');
	const employeeIdInput = document.getElementById('employeeId');
	const employeeId = employeeIdInput.value.trim();

	if (!employeeId || !/^\d+$/.test(employeeId)) {
		alert('Некорректный ID сотрудника (только цифры).');
		return;
	}

	try {
		const response = await fetch(`http://localhost:8080/user/${employeeId}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
		});

		const orders = await response.json();

		const responseUserName = await fetch("http://localhost:8080/user", {
			method: 'GET',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
		});

		const userName = await responseUserName.json();

		ordersList.innerHTML = '';

		for (const order of orders) {

			if ((orderStatus === 'all') || (orderStatus === 'active' && order.isActive) || (orderStatus === 'complete' && !order.isActive)) {
				const orderElement = document.createElement('div');
				orderElement.classList.add('col', 's12', 'm6', 'order-item');

				if (!order.isActive) {
					orderElement.classList.add('inactive');
				}

				const menuItemsHtml = [];

				if (order.items && order.items.length > 0) {
					for (const itemId of order.items) {
						try {
							const menuItemResponse = await fetch(`http://localhost:8080/menuItem/${itemId}`, {
								method: 'GET',
								headers: {
									'Content-Type': 'application/x-www-form-urlencoded'
								},
							});

							const menuItem = await menuItemResponse.json();

							menuItemsHtml.push(`
                                <tr>
                                    <td>${menuItem.title}</td>
                                    <td>${menuItem.cost}</td>
                                </tr>
                            `);
						} catch (error) {
							console.error('Error fetching menu item:', error);
						}
					}
				} else {
					menuItemsHtml.push('<tr><td colspan="2">(Нет товаров в заказе)</td></tr>');
				}

				const orderStatusElement = document.createElement('p');
				orderStatusElement.textContent = order.isActive ? 'Заказ в работе' : 'Заказ завершен';
				orderStatusElement.classList.add(order.isActive ? 'active' : 'inactive');
				orderStatusElement.style.color = order.isActive ? 'green' : 'red';

				const waiterInfo = userName.find(user => order.UserId === user.id);
				const waiterName = waiterInfo ? waiterInfo.name : 'Пользователь не найден';

				const cardElement = document.createElement('div');
				cardElement.classList.add('card');

				const cardContentElement = document.createElement('div');
				cardContentElement.classList.add('card-content');
				cardContentElement.innerHTML = `
                    <span class="card-title">Заказ №: ${order.id}</span>
                    <p>${orderStatusElement.outerHTML}</p>
                    <p>Официант: ${waiterName}</p>
                    <table class="menu-table">
                        <thead>
                            <tr>
                                <th>Наименование</th>
                                <th>Цена</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${menuItemsHtml.join('')}
                        </tbody>
                    </table>
                `;

				cardElement.appendChild(cardContentElement);
				orderElement.appendChild(cardElement);
				ordersList.appendChild(orderElement);
			}
		}
	} catch (error) {
		console.error('Ошибка при получении заказов сотрудника:', error.message);
		if (error.message.includes('Сотрудник не найден')) {
			alert('Сотрудник не найден. Пожалуйста, введите корректный ID сотрудника.');
		} else {
			alert('Произошла ошибка при получении заказов.');
		}
	}
}

document.addEventListener('DOMContentLoaded', async function () {

	const showOrdersButton = document.getElementById('showOrdersButton');
	const activeOrdersButton = document.getElementById('activeOrdersButton');
	const completeOrdersButton = document.getElementById('completeOrdersButton');

	const employeeForm = document.getElementById('employeeForm');
	if (!employeeForm) {
		// Если формы нет, значит, мы на другой странице, и скрипт не должен выполняться
		// console.error('Скрипт completedOrders.js не должен выполняться на этой странице.');
		return;
	}

	// Проверяем наличие всех кнопок
	if (showOrdersButton && activeOrdersButton && completeOrdersButton) {
		// Добавляем слушатели событий только если кнопки присутствуют
		showOrdersButton.addEventListener('click', async function () {
			await fetchAndDisplayOrders('all');
		});

		activeOrdersButton.addEventListener('click', async function () {
			await fetchAndDisplayOrders('active');
		});

		completeOrdersButton.addEventListener('click', async function () {
			await fetchAndDisplayOrders('complete');
		});
	} else {
		// Если хотя бы одной из кнопок нет, выводим сообщение об ошибке
		console.error('Не удалось найти один из элементов: "showOrdersButton", "activeOrdersButton" или "completeOrdersButton".');
	}

});
