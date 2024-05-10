const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');

// MongoDB connection URI
const uri = "mongodb+srv://srikanthkotamarthi57383:ILoHGQewA2iJ0SsF@cluster0.iohouak.mongodb.net/testing123467";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Function to handle MongoDB transactions
async function withTransaction(callback) {
    const session = client.startSession();
    session.startTransaction();
    try {
        await callback(session);
        await session.commitTransaction();
        session.endSession();
    } catch (error) {
        console.error('Transaction aborted:', error);
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
}


// Signup Route
router.post('/signup', async (req, res) => {
    console.log("hii");
    const { name, email, password } = req.body;
    console.log("hlo");

    try {
        await client.connect(); // Connect to MongoDB
        const database = client.db("testing123467"); // Update with your database name
        const collection = database.collection("userdetails"); // Collection for storing users

        // Check if the user already exists
        const existingUser = await collection.findOne({ $or: [{ name }, { email }] });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user
        await withTransaction(async (session) => {
            await collection.insertOne({ name, email, password: hashedPassword }, { session });
        });

        // Get the newly created user details
        const newUser = await collection.findOne({ name });
        
console.log(newUser)
        // Send back the userdetails object as response
        res.status(201).json({ message: 'User created successfully', userdetails: newUser });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
});


// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        await client.connect(); // Connect to MongoDB
        const database = client.db("testing123467"); // Update with your database name
        const collection = database.collection("userdetails"); // Collection for storing users

        // Find the user by email
        const user = await collection.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verify the password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        console.log("hi")
        res.status(200).json({ message: 'Login successful',  userdetails:user});
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
});

module.exports = router;
