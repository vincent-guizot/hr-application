// Allows the request through if the authenticated employee is acting on
// their own record (req.params.id matches their own id) or if they are an
// admin. Must run after verifyToken.
module.exports = function selfOrAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  const targetId = Number(req.params.id);
  if (req.user.role === 'admin' || req.user.id === targetId) {
    return next();
  }
  return res.status(403).json({ message: 'You can only modify your own record' });
};
