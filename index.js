import data from '/data.js'


const listEl = document.querySelector('.menu-list');
let menuItemEl = '';

data.forEach( item => {
    const listItemHtml = `
        <li id="item-${item.id}" class="menu-item h-[5rem] mb-2 flex items-center justify-between border-t-none border-l-none border-r-none border-b-2 border-slate-300 pb-10 my-10">
            <div class="menu-description flex gap-10">
                <img class="list-image max-w-[70px]" src="${item.image}" alt="${item.name}">
                <div class="item-descriptions max-w-70% mx-1 tracking-wider"">
                    <h2 class="item-description-name font-bold">${item.name}</h2>
                    <p class="item-ingredients font-extralight text-xs text-slate-600 my-2">${item.ingredients.join(', ')}</p>
                    <h3 class="item-price font-bold">$${item.price}</h3>
                </div>
            </div>
            <button class="add-btn w-[4rem] h-[4rem] border-2 border-slate-300 rounded-full " data-id="${item.id}"><i class="fa-thin fa-plus-large"></i></button>
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
});
