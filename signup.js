/* DATABASE */
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
app.use(cors());
// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // Parse JSON requests
app.use(express.static('public'));

// MongoDB Connection
const dbURL = "mongodb+srv://harshikaa7:harshika@patholab.ngt6t.mongodb.net/pathotab?retryWrites=true&w=majority";

mongoose.connect(dbURL)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Schema & Model
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
    contactNo: { type: String, required: true, match: /^\d{10}$/ },
    address: { type: String, required: true }
});

const User = mongoose.model('User', userSchema,'users');

// POST route for signup
app.post('/signup', async (req, res) => {
    try {
        const { firstName, lastName, age, gender, email, contactNo, address } = req.body;

        // Validate input
        if (!firstName || !lastName || !age || !gender || !email || !contactNo || !address) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Create user
        const newUser = new User({ firstName, lastName, age, gender, email, contactNo, address });
        await newUser.save();

        res.status(201).json({ message: '✅ User added successfully!' });
    } catch (err) {
        if (err.code === 11000) {
            res.status(400).json({ message: '❌ Email already exists.' });
        } else {
            res.status(500).json({ message: '❌ Server error: ' + err.message });
        }
    }
});
// Appointment Schema
const appointmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    contactNo: { type: String, required: true },
    appointmentDate: { type: Date, default: Date.now },
    status: { type: String, default: 'Scheduled' }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

// Appointment Endpoint
// Get user details by email
app.get('/users', async (req, res) => {
    const { email } = req.query;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: '❌ User not found.' });
        }
        res.json(user);
    } catch (error) {
        console.error("🚫 Error fetching user:", error);
        res.status(500).json({ message: '❌ Failed to fetch user.' });
    }
  
});


// Test Route
app.get('/', (req, res) => {
    res.send('🚀 Server is running!');
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`🌐 Server running on http://localhost:${PORT}`));