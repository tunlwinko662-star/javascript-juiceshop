// 🔐 Admin Password
const ADMIN_PASSWORD = "juice123";

// Login
function login() {
  const passInput = document.getElementById("admin-password").value;
  const msg = document.getElementById("login-message");

  if (passInput === ADMIN_PASSWORD) {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("admin-section").style.display = "block";

    renderDrinks();
    loadOrders(); // Orders load after login
  } else {
    msg.textContent = "Wrong password!";
  }
}

// LocalStorage functions
function getDrinks() {
  return JSON.parse(localStorage.getItem("drinks")) || [];
}

function saveDrinks(drinks) {
  localStorage.setItem("drinks", JSON.stringify(drinks));
}

// Render drinks with delete & edit button
function renderDrinks() {
  const list = document.getElementById("admin-list");
  list.innerHTML = "";
  getDrinks().forEach((drink, i) => {
    const div = document.createElement("div");
    div.className = "drink-card";
    div.innerHTML = `
      <img src="${drink.image}" alt="${drink.name}" width="50" height="50" >
      <h3>${drink.name}</h3>
      <p>💵 ${drink.price}</p>
      <button onclick="editDrink(${i})">✏️ ပြင်မယ်</button>
      <button onclick="deleteDrink(${i})">❌ ဖျက်မယ်</button>
    `;
    list.appendChild(div);
  });
}

// Delete drink
function deleteDrink(index) {
  const drinks = getDrinks();
  drinks.splice(index, 1);
  saveDrinks(drinks);
  renderDrinks();
}

// Edit drink
function editDrink(index) {
  const drinks = getDrinks();
  const drink = drinks[index];

  // form ထဲကို data ပြန်ထည့်ပေး
  document.getElementById("name").value = drink.name;
  document.getElementById("price").value = drink.price;
  document.getElementById("image").value = drink.image;

  // update mode အတွက် hidden field ထည့်
  document.getElementById("drink-form").dataset.editIndex = index;
}

// Add / Update drink
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("drink-form");
  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const name = document.getElementById("name").value;
      const price = document.getElementById("price").value;
      const image = document.getElementById("image").value;

      const drinks = getDrinks();
      const editIndex = form.dataset.editIndex;

      if (editIndex !== undefined) {
        // Update
        drinks[editIndex] = { name, price, image };
        delete form.dataset.editIndex; // clear edit mode
      } else {
        // Add new
        drinks.push({ name, price, image });
      }

      saveDrinks(drinks);
      renderDrinks();
      e.target.reset();
    });
  }
});


// --- Orders Management ---
function loadOrders() {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const tbody = document.getElementById("orders-body");
  tbody.innerHTML = "";

  if (orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4">📭 Orders မရှိသေးပါ</td></tr>`;
    return;
  }

  orders.forEach((order, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${order.table}</td>
      <td>${order.items.map(i => `${i.name} × ${i.qty} (${i.subtotal} Ks)`).join("<br>")}</td>
      <td>${order.total}</td>
      <td>${order.time}</td>
    `;
    tbody.appendChild(row);
  });
}

function clearOrders() {
  if (confirm("အားလုံးဖျက်မှာ သေချာပြီလား?")) {
    localStorage.removeItem("orders");
    loadOrders();
  }
}