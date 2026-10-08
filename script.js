// Load Drinks for Menu Page
function getDrinks() {
  return JSON.parse(localStorage.getItem("drinks")) || [];
}

document.addEventListener("DOMContentLoaded", () => {
  const drinks = getDrinks();
  const menuList = document.getElementById("menu-list");

  if (menuList) {
    drinks.forEach(drink => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${drink.image}" alt="${drink.name}">
        <h3>${drink.name}</h3>
        <p>💵 ${drink.price} Ks</p>
        <label for="qty-${drink.name}">count:</label>
        <select id="qty-${drink.name}">
           <option value="0">0</option>
           <option value="1">1</option>
           <option value="2">2</option>
           <option value="3">3</option>
           <option value="4">4</option>
           <option value="5">5</option>
        </select>
      `;
      menuList.appendChild(card);
    });
  }
});
function placeOrder() {
  const tableNumber = prompt("ကျေးဇူးပြုပြီး ခုံနံပါတ် ရိုက်ထည့်ပါ:");
  if (!tableNumber) {
    alert("Order မပြီးသေးပါ (ခုံနံပါတ်မထည့်သေးပါ)!");
    return;
  }

  const drinks = getDrinks();
  let orderDetails = [];
  let hasOrder = false;
  let total = 0;

  drinks.forEach(drink => {
    const qty = parseInt(document.getElementById("qty-" + drink.name).value);
    if (qty > 0) {
      hasOrder = true;
      const subtotal = qty * parseInt(drink.price);
      total += subtotal;
      orderDetails.push({
        name: drink.name,
        qty: qty,
        subtotal: subtotal
      });
    }
  });

  if (!hasOrder) {
    alert("items မရွေးရသေးပါ");
    return;
  }
// Save order to localStorage
const orderData = {
  table: tableNumber,
  items: orderDetails,
  total: total,
  time: new Date().toLocaleString(), // optional
  id: Date.now() // optional unique ID
};

// 1. orders array ထဲ ထည့်
let orders = JSON.parse(localStorage.getItem("orders")) || [];
orders.push(orderData);
localStorage.setItem("orders", JSON.stringify(orders));

// 2. currentOrder ထဲသီးသန့် သိမ်း
localStorage.setItem("currentOrder", JSON.stringify(orderData));
 // Redirect to order page
  window.location.href = "order.html";
}