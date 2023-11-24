export const isAdmin = async (req, res, next) => {
  if (req.user.role === 'admin') {
    // can use 'REQ.USER', 'cos u set it in the AUTH middleware
    next(); // forwarding REQ to the next middleware (u can anything as ADMIN)
  } else if (
    req.user._id.toString() === req.params.id ||
    req.user.orders.includes(req.params.id)
  ) {
    // _ID is an OBJ, so need --toString()--
    // req.user._id has a objectId type  // req.params.id is a normal string type
    next(); // u can delete/update ur OWN profile as NORMAL USER
  } else {
    res.status(401).send('Unauthorized access!');
  }
};
