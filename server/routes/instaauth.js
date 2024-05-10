const express = require('express');
const router = express.Router();
const axios = require('axios');
const querystring = require('querystring');


// Instagram authentication route
router.get('/auth/instagram', (req, res) => {
    const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${process.env.INSTAGRAM_CLIENT_ID}&redirect_uri=${process.env.INSTAGRAM_REDIRECT_URI}&scope=user_profile,user_media&response_type=code`;
    res.redirect(authUrl);
});

// Instagram callback route
router.get('/auth/instagram/callback', async (req, res) => {
    const code = req.query.code;

    // Exchange authorization code for access token
    const tokenUrl = 'https://api.instagram.com/oauth/access_token';
    const params = {
        client_id: process.env.INSTAGRAM_CLIENT_ID,
        client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: process.env.INSTAGRAM_REDIRECT_URI,
        code: code
    };

    try {
        const response = await axios.post(tokenUrl, querystring.stringify(params));
        const accessToken = response.data.access_token;
        // Use access token to make authenticated API requests on behalf of the user
        // Store access token in session or database for future use
        res.send('Authentication successful! Access token: ' + accessToken);
    } catch (error) {
        console.error('Error exchanging authorization code for access token:', error);
        res.status(500).send('Error occurred during authentication');
    }
});

module.exports = router;
