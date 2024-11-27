import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const hashPassword = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(12, (err, salt) => {
            if (err) {
                reject(err);
            } else {
                bcrypt.hash(password, salt, (err, hash) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(hash);
                    }
                });
            }
        });
    });
};

const comparePassword = (password, hashed) => {
    return bcrypt.compare(password, hashed)
}
const isAdmin = async (req, res, next) => {
    try {

  

      const token = req.header('Authorization').replace('Bearer ', '');

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findOne({ userID: decoded.id });

  
      if (!user) {
        return res.status(401).json({ message: 'Invalid user.' });
      }
  
      if (user.role !== 'admin' && user.role !== 'superadmin') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
      }
  

      req.user = user;
      next();
    } catch (error) {
      console.error('Error in isAdmin middleware:', error.message);
      return res.status(401).json({ message: 'Invalid token.' });
    }
  };

export { hashPassword, comparePassword, isAdmin };