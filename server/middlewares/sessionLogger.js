// middleware/sessionLogger.js
const sessionLogger = (req, res, next) => {
  console.log('Request Session:', req.session);
  next();
};

export default sessionLogger;
