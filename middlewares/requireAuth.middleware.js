
function requireAuth(req, res, next) {
  if (!req.session || !req.session.user) {
    res.status(401).end('Not authenticated, Please Login')
    return
  }
  next()
}

function requireAdmin(req, res, next) {
  const user = req.session.user
  console.log(user);
  if (!user.is_admin) {
    res.status(403).end('Unauthorized Enough..')
    return
  }
  next()
}


// module.exports = requireAuth

module.exports = {
  requireAuth,
  requireAdmin
}
