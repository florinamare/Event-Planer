const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'secretkey';

function authMiddleware(req, res, next) {
  const token = req.header('Authorization') && req.header('Authorization').split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Nu a fost furnizat token' });

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token invalid' });
  }
}

function verifyAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acces interzis: doar admini' });
  }
  next();
}

// Export corect
module.exports = { authMiddleware, verifyAdmin };
