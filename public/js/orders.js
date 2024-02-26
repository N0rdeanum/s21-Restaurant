document.addEventListener('DOMContentLoaded', () => {
	const waiterSelect = document.getElementById('waiterSelect');
	const menuItemsSelect = document.getElementById('menuItemsSelect');

	let waiterInstance = M.FormSelect.init(waiterSelect);
	let menuItemsInstance = M.FormSelect.init(menuItemsSelect, {isMultiple: true});

	waiterSelect.addEventListener('change', () => {
		waiterInstance = M.FormSelect.getInstance(waiterSelect);
		waiterInstance.dropdown.close();
	});

	menuItemsSelect.addEventListener('change', () => {
		menuItemsInstance = M.FormSelect.getInstance(menuItemsSelect);
		menuItemsInstance.dropdown.close();
	});

	const orderResetButton = document.getElementById('orderResetButton');
	orderResetButton.addEventListener('click', () => {
		waiterInstance.input.value = "";
		M.FormSelect.init(waiterSelect);
	});
});

const reqUrl = 'http://localhost:8080/orders';

async function menuRequest(url) {
	try {
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			const err = new Error('Ошибка запроса');
			err.data = await response.json();
			throw err;
		}

		return response.json();
	} catch (err) {
		console.error(err);
	}
}

menuRequest(reqUrl)
	.then(data => console.log(data))
	.catch(err => console.error(err));
