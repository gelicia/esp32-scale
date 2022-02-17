module.exports = function (req, res, next) {
    const authHeader = req.headers.authorization
  
    if (!authHeader) {
      return res.status(403).json({
        status: 403,
        message: 'FORBIDDEN'
      })
    } else {
      const headerToken = authHeader.split(" ")[1];
      const realToken = process.env.TOKEN;
  
      if (headerToken === realToken) {
        next();
      } else {
        return res.status(403).json({
          status: 403,
          message: 'FORBIDDEN'
        })
      }
    }
  }