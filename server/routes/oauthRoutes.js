import express from 'express';
import axios from 'axios';
import querystring from 'querystring';
import jwt from 'jsonwebtoken';
import { getUserByEmail } from '../models/user/userModel.js';

const router = express.Router();

const clientID = process.env.AUTH0_CLIENT_ID;
const clientSecret = process.env.AUTH0_CLIENT_SECRET;
const domain = process.env.AUTH0_DOMAIN;
const redirectURI = process.env.AUTH0_REDIRECT_URI;

router.get('/login', (req, res) => {
    const authURL = `https://${domain}/authorize?client_id=${clientID}&redirect_uri=${redirectURI}&response_type=code&scope=openid%20profile%20email`;
    res.redirect(authURL);
});

router.get('/callback', async (req, res) => {
    const authCode = req.query.code;

    if (!authCode) {
        return res.status(400).send('Authorization code is missing');
    }

    console.log('Authorization code received:', authCode);

    try {
        const response = await axios.post(`https://${domain}/oauth/token`, querystring.stringify({
            code: authCode,
            client_id: clientID,
            client_secret: clientSecret,
            redirect_uri: redirectURI,
            grant_type: 'authorization_code'
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        console.log('Token response:', response.data);

        const { access_token: accessToken, id_token: idToken } = response.data;
        const decodedToken = jwt.decode(idToken);
        const email = decodedToken.email;

        if (!email) {
            return res.status(400).send('Email not found in token');
        }

        const user = await getUserByEmail(email);

        if (!user) {
            return res.redirect(`http://localhost:3000/create-account?email=${email}`);
        }

        res.redirect(`http://localhost:3000/protected?accessToken=${accessToken}&idToken=${idToken}`);
    } catch (error) {
        if (error.response) {
            console.error('Error during token exchange', error.response.data);
            res.status(error.response.status).send(error.response.data);
        } else if (error.request) {
            console.error('Error during token exchange, no response received', error.request);
            res.status(500).send('Error during token exchange, no response received');
        } else {
            console.error('Error during token exchange', error.message);
            res.status(500).send('Error during token exchange');
        }
    }
});

export default router;
