const cartIcon = document.getElementById('cartIcon');
  const cartSidebar = document.getElementById('cartSidebar');
  const closeBtn = document.getElementById('closeBtn');
  const proceedBtn = document.getElementById('checkout-container');

  // Cart items array
  let cartItems = [];

  // Open the sidebar when the cart icon is clicked
  cartIcon.addEventListener('click', () => {
    updateCartView();
    cartSidebar.style.right = '0';
  });

  // Close the sidebar
  closeBtn.addEventListener('click', () => {
    cartSidebar.style.right = '-500px';
  });

  // Update the cart view
  function updateCartView() {
    const cartContent = document.querySelector('.cart-sidebar .img');
    cartContent.innerHTML = '';

    if (cartItems.length === 0) {
      // Show empty cart
      cartContent.innerHTML = `
        <img src="empty.png" alt="Empty Cart" style="width: 250px; margin: 20px auto; display: block;">
        <h3 style="text-align: center;">Your Cart is Empty!</h3>
        <div class="btncontainer" style="text-align: center; margin-top: 10px;">
          <button onclick="window.location.href='#godown'">Browse Tests</button>
        </div>
      `;
      proceedBtn.style.display = 'none';
    } else {
      // Show items
      cartItems.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
          <h4>${item.name}</h4>
          <p>Price: ₹${item.price}</p>
          <button onclick="removeFromCart(${index})">Remove</button>
        `;
        cartContent.appendChild(cartItem);
      });

      // Show total price
      const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);
      const totalDiv = document.createElement('div');
      totalDiv.classList.add('cart-total');
      totalDiv.innerHTML = `<h3>Total: ₹${totalPrice}</h3>`;
      cartContent.appendChild(totalDiv);

      proceedBtn.style.display = 'block';
    }
  }

  // Add item to cart
  function addToCart(name, price) {
    cartItems.push({ name, price });
    updateCartBadge();
  }

  // Remove item
  function removeFromCart(index) {
    cartItems.splice(index, 1);
    updateCartBadge();
    updateCartView();
  }

  // Update cart badge
  function updateCartBadge() {
    const cartBadge = document.querySelector('.totalquantity');
    if (cartBadge) {
      cartBadge.textContent = cartItems.length;
    }
  }

  // Redirect to tests
  function redirectToTests() {
    window.location.href = '#redirecttest';
    cartSidebar.style.right = '-500px';
  }

  // Add to cart and open sidebar
  function redirectToCart(testName, testPrice) {
    addToCart(testName, testPrice);

    // Optionally store in localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push({ name: testName, price: testPrice });
    localStorage.setItem('cart', JSON.stringify(cart));

    cartSidebar.style.right = '0';
    updateCartView();
  }

  // Redirect to payment
  function redirectToPayment() {
    const userData = JSON.parse(localStorage.getItem("userData"));
  
    if (userData) {
      // User is logged in, go straight to payment
      window.location.href = "payment.html";
    } else {
      // User not logged in, redirect to signup/login
      window.location.href = "signup.html";
    }
  }
  

  // Handle post-signup redirect
  document.addEventListener("DOMContentLoaded", function () {
    const makePaymentBtn = document.getElementById("makePaymentBtn");
    if (makePaymentBtn) {
      makePaymentBtn.addEventListener("click", function () {
        window.location.href = "signup.html";
      });
    }

    const signinForm = document.getElementById("signinForm");
    if (signinForm) {
      signinForm.addEventListener("submit", function (event) {
        event.preventDefault();
        alert("Sign In Successful!");
        window.location.href = "payment.html";
      });
    }
  });

/*DATABASE*/
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); 

// MongoDB Connection
const dbURL = 'mongodb+srv://admin:admin123@cluster0.gj6d9.mongodb.net/patholab?retryWrites=true&w=majority'; // Replace with your MongoDB URL
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error(err));

// Schema & Model
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true, 
        unique: true,  
        match: /.+\@.+\..+/ // Simple email regex validation
    },
    password: {
        type: String,
        required: true, // Password is required
        minlength: [6, 'Password must be at least 6 characters'], // Minimum length
        maxlength: [30, 'Password cannot be longer than 30 characters'], // Maximum length
        match: [/^(?=.[A-Za-z])(?=.\d)[A-Za-z\d@$!%*?&]{6,30}$/, 'Password must contain at least one letter, one number, and be between 6-30 characters'] // Regex for password format
    }
});

const User = mongoose.model('User', userSchema, 'info');

// POST route to add a new user
app.post('/submit', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).send('Email and Password are required');
        }

        // Create and save user
        const user = new User({ email, password });
        await user.save();

        res.status(201).send('User added successfully!');
    } catch (err) {
        if (err.code === 11000) {
            res.status(400).send('Email already exists'); // Handle unique email constraint
        } else {
            res.status(500).send('An error occurred: ' + err.message); // General error
        }
    }
});

// Routes
app.get('/submit', (req, res) => {
    res.sendFile(__dirname + '/public/signup.html'); // Load your HTML UI
});

// Start the server
const PORT = 27017;
app.listen(PORT, () => console.log('Server running on http://localhost:${PORT}'));