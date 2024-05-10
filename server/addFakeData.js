// // addFakeData.js

// const mongoose = require("mongoose");
// const User = require("./models/User"); // Import the User model

// async function addFakeData() {
//     try {
//         // Connect to MongoDB
//         await mongoose.connect("mongodb+srv://srikanthkotamarthi57383:ILoHGQewA2iJ0SsF@cluster0.iohouak.mongodb.net/testing1234", {
//             useNewUrlParser: true,
//             useUnifiedTopology: true
//         });

//         // Call the function to add fake data to the "userdetails" collection
//         await User.addFakeData();

//         // Disconnect from MongoDB
//         await mongoose.disconnect();
//     } catch (error) {
//         console.error("Error adding fake data:", error);
//     }
// }

// // Call the function to add fake data
// addFakeData();
