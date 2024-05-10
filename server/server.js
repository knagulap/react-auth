require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const authRoute = require("./routes/auth");
const cookieSession = require("cookie-session");
const passportStrategy = require("./passport");
const app = express();
const mongoose = require("mongoose");
const { UserDetails, addFakeData } = require("./models/User");
const instaauth = require("./routes/instaauth")
app.use(
	cookieSession({
		name: "session",
		keys: ["cyberwolve"],
		maxAge: 24 * 60 * 60 * 100,
	})
);

// Connect to MongoDB
mongoose.connect("mongodb+srv://Srikanth:Srikanth123@cluster0.iohouak.mongodb.net/testing123467", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("Connected to MongoDB");
	// addFakeData();
})
.catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});

app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
	origin: 'http://localhost:3000', // Allow requests from this origin
	credentials: true, // Allow credentials (cookies, authorization headers)
  }));
  
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

const signupRoutes = require("./routes/Signup")
app.use("/sign", signupRoutes);


const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listenting on port ${port}...`));
