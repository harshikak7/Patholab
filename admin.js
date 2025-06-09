// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = 3000;

// MongoDB connection URI (replace with your credentials)
const mongoURI = 'mongodb+srv://harshikaa7:harshika@patholab.ngt6t.mongodb.net/pathotab?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected...'))
  .catch((err) => console.log('❌ MongoDB connection error:', err));

// Define user schema
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  age: Number,
  gender: String,
  email: String,
  contactNo: String,
  address: String,
  createdAt: Date,
});

// Create User model
const User = mongoose.model('User', userSchema);

// Set EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Route to display admin page with user data
app.get('/admin', async (req, res) => {
  try {
    const users = await User.find();
    res.render('admin', { users });
  } catch (err) {
    res.status(500).send('Error fetching user data');
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}/admin`);
});
