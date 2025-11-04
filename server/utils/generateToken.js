import jwt from 'jsonwebtoken';

// 1. FIX: The function must accept 'res' (response) and 'userId' (or 'id')
const generateToken = (res, userId) => {
    
    // 2. Use the ID to sign the token
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: '30d', // Token expires in 30 days
    });

    // 3. CRITICAL: Use res.cookie() to set the secure HTTP-only cookie
    res.cookie('jwt', token, {
        httpOnly: true,                                         // Prevents client-side JavaScript access (security)
        secure: process.env.NODE_ENV !== 'development',         // Use secure cookies in production/deployment
        sameSite: 'strict',                                     // Prevents CSRF attacks
        maxAge: 30 * 24 * 60 * 60 * 1000,                       // 30 days expiry (in milliseconds)
    });

    // NOTE: The function no longer needs to return the token string.
};

export default generateToken;