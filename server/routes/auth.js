const router = require("express").Router();
const passport = require("passport");
const { MongoClient } = require("mongodb");

// MongoDB connection URI
const uri = "mongodb+srv://srikanthkotamarthi57383:ILoHGQewA2iJ0SsF@cluster0.iohouak.mongodb.net/testing123467";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Google authentication routes
router.get("/google", passport.authenticate("google", ["profile", "email"]));
router.get(
    "/google/callback",
    passport.authenticate("google", {
        successRedirect: process.env.CLIENT_URL+ "home",
        failureRedirect: "/login/failed",
    })
);

// Instagram authentication routes
router.get("/instagram", passport.authenticate("instagram"));
router.get(
    "/instagram/callback",
    passport.authenticate("instagram", {
        successRedirect: process.env.CLIENT_URL,
        failureRedirect: "/login/failed",
    })
);

// Successful authentication route for both Google and Instagram
router.get("/login/success", async (req, res) => {
    if (req.user) {
        try {
            await client.connect(); // Connect to MongoDB

            // Access the test123 database and the UserDetails collection
            const database = client.db("testing123467");
            const userDetailsCollection = database.collection("userdetails");

            // Check if the user already exists in the database
            const user = await userDetailsCollection.findOne({ googleId: req.user.id });

            if (!user) {
                // If user doesn't exist, create a new user document
                await userDetailsCollection.insertOne({
                    googleId: req.user.id,
                    displayName: req.user.displayName,
                    email: req.user.emails[0].value,
                });
                console.log("New user added to UserDetails collection");
            } else {
                console.log("User already exists in UserDetails collection:", user);
            }

            // Respond with success message and user details
            res.status(200).json({
                error: false,
                message: "Successfully Logged In",
                user: req.user,
            });
        } catch (err) {
            // Handle any errors
            console.error("Error creating or finding user in UserDetails collection:", err);
            res.status(500).json({ error: true, message: "Internal Server Error" });
        } finally {
            // Close the MongoDB connection
            await client.close();
        }
    } else {
        res.status(403).json({ error: true, message: "Not Authorized" });
    }
});

// Failed authentication route
router.get("/login/failed", (req, res) => {
    res.status(401).json({
        error: true,
        message: "Log in failure",
    });
});

// Logout route
router.get("/logout", (req, res) => {
    req.logout();
    res.redirect(process.env.CLIENT_URL);
});

module.exports = router;
