import axios from 'axios';

export const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token is missing or invalid' });
    }

    try {
        const response = await axios.get('https://oauth-provider.com/userinfo', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        req.user = response.data; // assuming the response contains user info
        next();
    } catch (error) {
        console.error('Error during token verification', error);
        res.status(401).json({ message: 'Invalid access token' });
    }
};
