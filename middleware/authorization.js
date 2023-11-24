// all FNs in EXPRESS caleed middleware
import jwt from 'jsonwebtoken';
import User from '../models/usersSchema.js';

// middleware is a plain FN
export const auth = async (req, res, next) => {
  // authorization is a process of checking or verifying user is authenticated or not.
  try {
    const token = req.headers.token;
    const payload = jwt.verify(token, process.env.SECRET_KEY); // payload can be called DECODE
    console.log(payload);

    if (payload) {
      // {_id: "dsfsea4w4222",email:"test123@gmail.com"}
      const user = await User.findById(payload._id);
      req.user = user; // attaching the whole USER data to the REQ (so u can refer to it in the next midleware)

      console.log(user);
      next(); // forwarding REQ to the next middleware
    }
  } catch (err) {
    next(err); // (send ERR to ERR HANDLER) --> if TOKEN not validated
  }
};
