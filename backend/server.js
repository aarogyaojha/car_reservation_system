const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const cors = require('cors');  // Import cors
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb+srv://arogyaojha251:123@cluster0.chh8mcu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Route to handle form submission
app.post('/submit-form', upload.single('licenseFile'), async (req, res) => {
  console.log('Received form submission');
  console.log('Request body:', req.body);
  console.log('File info:', req.file);

  const { name, email, password, numberPlate } = req.body;
  const licenseFile = req.file.path;

  const newUser = new User({
    name,
    email,
    password,
    numberPlate,
    licenseFile,
  });

  try {
    await newUser.save();
    console.log('User created successfully');
    res.status(201).send('User created successfully');
  } catch (error) {
    console.error('Error creating user:', error.message);
    res.status(400).send('Error creating user: ' + error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
