import data from '/data.js';

const listEl = document.querySelector('.menu-list');
let menuItemEl = '';

data.forEach(item => {
    const listItemHtml = `
        <li id="item-${item.id}" class="menu-item h-[5rem] mb-2 flex items-center justify-between border-t-none border-l-none border-r-none border-b-2 border-slate-300 pb-10 my-10">
            <div class="menu-description flex gap-10">
                <img class="list-image max-w-[70px]" src="${item.image}" alt="${item.name}">
                <div class="item-descriptions max-w-70% -ml-8 tracking-wider">
                    <h2 class="item-description-name font-bold">${item.name}</h2>
                    <p class="item-ingredients font-extralight text-xs text-slate-600 my-2">${item.ingredients.join(', ')}</p>
                    <h3 class="item-price font-bold">$${item.price}</h3>
                </div>
            </div>
            <button class="add-btn w-[4rem] h-[4rem] border-2 border-slate-300 rounded-full" data-id="${item.id}">
                <i class="fa-thin fa-plus-large"></i>
            </button>
        </li>`;

    menuItemEl += listItemHtml;
});

// Once all items are built, set the innerHTML of the menu list all at once
listEl.innerHTML = menuItemEl;

const addBtns = document.querySelectorAll('.add-btn');

// Style all buttons
addBtns.forEach(btn => {
    // Add event listener for mouseover
    btn.addEventListener('mouseover', () => {
        btn.style.backgroundColor = 'gray';  // Change background color to gray on hover
        btn.style.color = '#fff';  // Change text color to white
        btn.style.border = 'none';  // Remove the border
    });

    // Add event listener for mouseout to reset the background color
    btn.addEventListener('mouseout', () => {
        btn.style.backgroundColor = '';  // Reset background color when mouse leaves the button
        btn.style.color = 'black';  // Reset text color to black
        btn.style.border = '2px solid lightgray';  // Reset border to a light gray color
    });

    btn.addEventListener('click', () => {
        let orderSecEl = document.querySelector('.order-section');
        if(orderSecEl.classList.contains('hidden')){
            orderSecEl.classList.remove('hidden');
        }
    });
});

document.addEventListener('click', (e) => {
    if (e.target && e.target.closest('.add-btn')) {
        const itemId = e.target.closest('.add-btn').dataset.id;

        // Getting the corresponding item from the data array
        const item = data.find(item => item.id.toString() === itemId);

        if (item) {
            let orderList = JSON.parse(localStorage.getItem('orderList')) || [];

            const existingItem = orderList.find(orderItem => orderItem.id === item.id);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                orderList.push({ ...item, quantity: 1 });
            }

            localStorage.setItem('orderList', JSON.stringify(orderList));
            updateOrderList(orderList);
            totalPrice(orderList);  // Update the total price when the order list changes
        }
    }
});

function updateOrderList(orderList) {
    let orderListEl = document.querySelector('.order-items-list');
    let orderSecEl = document.querySelector('.order-section');

    // Clear the current list
    orderListEl.innerHTML = '';

    orderList.forEach(item => {
        const orderListItem = document.createElement('li');
        orderListItem.classList.add('w-full', 'font-semibold', 'text-lg', 'flex', 'justify-between', 'items-center', 'grid', 'grid-cols-6', 'gap-2');

        // Create span elements for the item name, price, and quantity.
        const itemName = document.createElement('span');
        itemName.classList.add('item-name', 'col-span-1');
        itemName.textContent = item.name;

        const itemPrice = document.createElement('span');
        itemPrice.classList.add('item-price');
        itemPrice.textContent = `$${item.price}`;

        const itemQuantity = document.createElement('span');
        itemQuantity.classList.add('item-quantity');
        itemQuantity.textContent = `x ${item.quantity}`;

        // Create a remove button
        const removeBtn = document.createElement('button');
        removeBtn.classList.add('remove-btn', 'text-slate-600', 'font-semibold', 'text-xs', 'col-span-3', 'tracking-wider', 'pointer');
        removeBtn.textContent = 'Remove';
        removeBtn.dataset.id = item.id;

        // Append all elements to the order list item
        orderListItem.appendChild(itemName);
        orderListItem.appendChild(removeBtn);
        orderListItem.appendChild(itemPrice);
        orderListItem.appendChild(itemQuantity);

        // Append the item to the list
        orderListEl.appendChild(orderListItem);
    });

    // Add event listeners to the remove buttons (this ensures dynamic buttons get listeners)
    const removeBtns = document.querySelectorAll('.remove-btn');
    removeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemId = e.target.dataset.id;

            // Get the current order list from localStorage
            let orderList = JSON.parse(localStorage.getItem('orderList')) || [];

            // Remove the item with the matching id
            orderList = orderList.filter(item => item.id !== parseInt(itemId));

            // Save the updated order list back to localStorage
            localStorage.setItem('orderList', JSON.stringify(orderList));

            // Update the UI and the total price
            updateOrderList(orderList);
            totalPrice(orderList);
        });
    });

    // Hide order section if no items in the list
    if (orderListEl.children.length === 0 && !orderSecEl.classList.contains('hidden')) {
        orderSecEl.classList.add('hidden');
    }
}

// Initial update of the order list from localStorage if there are any saved items
const savedOrderList = JSON.parse(localStorage.getItem('orderList')) || [];
updateOrderList(savedOrderList);
totalPrice(savedOrderList);  // Also update the total price initially

function totalPrice(orderList) {
    let totalPriceEl = document.querySelector('.total-price');

    totalPriceEl.innerHTML = '';

    let total = orderList.reduce((sum, item) => sum + (item.quantity * item.price), 0);

    totalPriceEl.innerHTML = `$${total.toFixed(2)}`;
}
