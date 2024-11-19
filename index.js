// JavaScript (index.js)

import data from '/data.js';

const listEl = document.querySelector('.menu-list');
let menuItemEl = '';

// Dynamically create menu items
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

// Add the items to the menu
listEl.innerHTML = menuItemEl;

const addBtns = document.querySelectorAll('.add-btn');
const orderSecEl = document.querySelector('.order-section');
const orderListEl = document.querySelector('.order-items-list');

// Handle adding items to the order
addBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const itemId = e.target.closest('.add-btn').dataset.id;
    const item = data.find(item => item.id.toString() === itemId);
    let orderList = JSON.parse(localStorage.getItem('orderList')) || [];

    const existingItem = orderList.find(orderItem => orderItem.id === item.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      orderList.push({ ...item, quantity: 1 });
    }

    localStorage.setItem('orderList', JSON.stringify(orderList));
    updateOrderList(orderList);
    totalPrice(orderList);

    // Show order section if items are added
    if (orderList.length > 0) {
      orderSecEl.classList.remove('hidden');
    }
  });
});

// Update the order list in the UI
function updateOrderList(orderList) {
  orderListEl.innerHTML = '';

  orderList.forEach(item => {
    const orderListItem = document.createElement('li');
    orderListItem.classList.add('order-item', 'flex', 'justify-between', 'mb-2');

    const itemName = document.createElement('span');
    itemName.textContent = item.name;

    const itemQuantity = document.createElement('span');
    itemQuantity.textContent = `x ${item.quantity}`;

    const itemPrice = document.createElement('span');
    itemPrice.textContent = `$${(item.price * item.quantity).toFixed(2)}`;

    orderListItem.append(itemName, itemQuantity, itemPrice);
    orderListEl.appendChild(orderListItem);
  });
}

// Calculate and display the total price
function totalPrice(orderList) {
  const totalPriceEl = document.querySelector('.total-price');
  const total = orderList.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  totalPriceEl.textContent = `$${total.toFixed(2)}`;
}

// Complete Order
const completeOrderBtn = document.querySelector('.complete-order-btn');
const paymentModalEl = document.querySelector('.payment-modal');

completeOrderBtn.addEventListener('click', () => {
  if (paymentModalEl.classList.contains('hidden')) {
    paymentModalEl.classList.remove('hidden');
  }
});

// Handle Payment Modal Form Submission
paymentModalEl.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.querySelector('.name-input').value;

  // Show a success message in the order section
  const paymentNotification = `
    <div class="bg-[#ECFDF5] text-[#056f46] p-4 rounded">
      <p>Thanks, ${name}! Your order is on its way!</p>
    </div>
  `;
  orderSecEl.innerHTML = paymentNotification;

  // Hide the payment modal
  paymentModalEl.classList.add('hidden');

  // Clear order from localStorage
  localStorage.removeItem('orderList');
});
