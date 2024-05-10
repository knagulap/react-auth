// models/User.js

const mongoose = require("mongoose");

const userDetailsSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: true,
    },
    displayName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    // Add more fields as needed
});

const UserDetails = mongoose.model("UserDetails", userDetailsSchema);

async function addFakeData() {
    try {
        // Add some fake users
        await UserDetails.insertMany([
            {
                googleId: "googleId123",
                displayName: "User 1",
                email: "user1@example.com"
            },
            {
                googleId: "googleId245",
                displayName: "User 2",
                email: "user2@example.com"
            }
            // Add more fake users as needed
        ]);

        console.log("Fake data added successfully.");
    } catch (error) {
        console.error("Error adding fake data:", error);
    }
}

module.exports = { UserDetails, addFakeData };
