
let cart = [];
let total = 0;

// Add to Cart Function
function addToCart(itemName, price) {

    cart.push({
        name: itemName,
        price: price
    });

    total += price;

    updateCart();
}

// Update Cart UI
function updateCart() {

    const cartItems = document.getElementById("cartItems");
    const totalElement = document.getElementById("total");

    cartItems.innerHTML = "";

    cart.forEach((item, index) => {

        const li = document.createElement("li");

        li.innerHTML = `
            ${item.name} - ₹${item.price}
            <button onclick="removeItem(${index})">
                Remove
            </button>
        `;

        cartItems.appendChild(li);
    });

    totalElement.textContent = total;
}

// Remove Item
function removeItem(index) {

    total -= cart[index].price;

    cart.splice(index, 1);

    updateCart();
}

// Order Form
document.getElementById("orderForm")
    .addEventListener("submit", function (e) {

        e.preventDefault();

        if (cart.length === 0) {
            alert("Please add at least one item to the cart.");
            return;
        }

        const name = document.getElementById("name").value;

        document.getElementById("orderMessage").innerHTML =
            `✅ Thank You ${name}! <br>
        Your order has been placed successfully. <br>
        Total Amount: ₹${total}`;

        cart = [];
        total = 0;

        updateCart();

        this.reset();
    });