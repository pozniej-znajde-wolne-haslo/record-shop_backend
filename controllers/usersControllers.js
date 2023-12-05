// use the same pattern for ALL RESPONSES !! (otherwise problems in react, when dealing with RES)
/* 
SUCCESS: res.send({success: true, data: bla})
ERROR: res.send({success: false, message: bla}) 
*/

import User from '../models/usersSchema.js';
// import #-ing package
import bcrypt from 'bcryptjs'; // (npm i bcrypt)
// import JWT (JSON web token package)
import jwt from 'jsonwebtoken';

//http is a stateless protocol
//every request for server is unique

/* find() // findByIdAndDelete() etc..
STATIC METHODS from MONGOOSE (built-in) */

/* update: --/req.body, {new: true}/-- needed
in DELETE - NOT, 'cos u're not storing anything ! so just
req.params.id && weg 

{new: true} ---> not saving the data, more returning the updated elem (so makes sense with UPDATE, but not DELETE)
u can return DELETED elem (it would use the 1st method (findById) &&
return the outcome of the first one)
2 methods in one
*/

// LOGIN
export const login = async (req, res, next) => {
  try {
    // check EMAIL
    // cannot check PW 1st (need the user to know which hash PW to check)
    // (2 users could have the same PW, but hashed diff. - e.g. with diff. SALTS)
    const foundUser = await User.findOne({
      email: req.body.email,
      /* RESULT: (user in the DB)
    {
      "firstName": "Syed",
    "lastName": "Naqvi",
    "email": "test@gmail.com",
    "password": "$2b$10$nR/cAZRI7b2z5KOV2ZAZF..dFg97jVz2AUMlOC2je94D9n.lvjnjq",
    } */
    });

    // check PASSWORD
    if (foundUser) {
      //"12345"  === "$2b$10$nR/cAZRI7b2z5KOV2ZAZF..dFg97jVz2AUMlOC2je94D9n.lvjnjq"
      const check = await bcrypt.compare(req.body.password, foundUser.password); // TRUE / FALSE

      if (check) {
        // AUTHENTICATION PROCESS (SIGN method 2 create a TOKEN)
        const token = jwt.sign(
          { id: foundUser._id, email: foundUser.email }, // _id ??
          process.env.SECRET_KEY, // can set anything as its value in the --/.ENV/-- file
          { issuer: 'Naqvi', expiresIn: '2d' }
        );
        // ***** jwt.sign({ paylodad }, secret key, { other options }) *****
        // payload - data displayed on top, can be 1 or more value, but has 2 b an OBJ
        // secret key - a signature, like a PW u use 2 sign / store in the --.ENV-- file ('cos u decrypt stuff with that)
        // other options - OPTIONAL (e.g. who issued TOKEN, when it expires ('2y', '1h', etc.)
        console.log(token);
        //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTUzM2I2NzllMzZlMWUwNzRjNTc1Y2YiLCJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwiaWF0IjoxNjk5OTU4NTYzLCJleHAiOjE2OTk5NjIxNjMsImlzcyI6Ik5hcXZpIn0.uAu44QFLVlRQNkHbgwYF9SPCRGQOQwvUO8Ho07Lo1Us

        // u have to send token BACK to ur CLIENT: !!! (3 ways)
        // WHY ? here routes not PROTECTED (anyone can make REQ & add PRODUCT bez LOGIN)
        // to protect it ---> u use TOKEN (use AUTHORISATION) // create ROLES allowed 2 do certain stuff
        // given roles HAVE specific admin(owner) rights (add produts, see all users, change price etc..)
        // NORMAL USER - can place order (has 2 authenticate), but should not b able 2 UPDATE/DELETE sby else's order

        // res.send({ msg: 'welcome back', foundUser, token }); // pass TOKEN here (1 way to do it - to save it in the account 4 future use) ---> send it in the RES-BODY

        // *** 2nd way to do it ***
        // send it in the RESPONSE-HEADER (placed before BODY of the RES) --> saved in the HEADER (in the THUNDER CLIENT e.g.)
        res
          .header('secrettoken', token) // KEY (usu called just 'token') / VALUE ('token' is the value)
          .send({ msg: 'welcome back', data: foundUser });

        // *** 3rd WAY ***
        // send it in the COOKIE (will be stored in the COOKIES)
        // res.cookie("token",token).send({msg: "welcome back", foundUser, token});

        // first 2 WAYS ---> have to take token OUT && send it MANUALLY with the REQ
        //(attach it in the HEADER in the thunder client --->
        //copy from the RESPONSE HEADER & tick the BOX in the REQ HEADER)
        // 3rd WAY (COOKIE) - automatically saved & no need 4 manual copying (deleted when u clear cookies, need to log in again)

        // COOKIE && HEADER methods ---> ALMOST THE SAME,
        // safer than BODY (u can just parse it with JSON() in react & reag/get it)
        // HEADERS u have to expose (inside CORS) !!
        // and store it in LOCAL STORAGE
      } else {
        res
          .status(401)
          .send({ success: false, message: "password doesn't match!" });
      }
      // or with RETURN & line below without ELSE statement (einfach so after RETURN) !!!
      //return;
    } else {
      // if no user found
      res.status(404).send({ success: false, message: 'No such user' });
    }
  } catch (error) {
    next(err); // it notifies the ERROR HANDLER from the APP.JS
    // or errOR ??!!
  }
};

// REGISTER
export const register = async (req, res, next) => {
  try {
    /* generate SALT & add it
    const salt = bcrypt.genSaltSync(10)
    console.log(salt)
    const hashedPassword = await bcrypt.hash(req.body.password,salt) */
    // create # PW (bez generating SALT before)
    const hashedPW = await bcrypt.hash(req.body.password, 10);
    // 10 - standard (but can be 6, 8 or sth)
    // SALT - (here) 10 random CHARs added at the beg of ur PW
    // hash - ASYNC (needs AWAIT) / hashSync - SYNC
    console.log(hashedPW);

    /*  const newUser = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPW,
    }); */
    const newUser = await User.create({ ...req.body, password: hashedPW });

    res.send({ success: true, data: newUser });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
};

// UPDATE
// class version:
export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(203).send({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

/* export const updateUser = async (req, res, next) => {
  try {
    //  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    // new: true,
    // });

    // to update the PW (hash it):
    const hashedPW = await bcrypt.hash(req.body.password, 10);
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPW,
      },
      { new: true }
    );

    // --OR--
    // const user = await User.findOne(_id: req.params.id)
    // user.email = req.body.email

    res.send({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}; */

export const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.send({ success: true, data: 'user deleted' });
  } catch (err) {
    next(err);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    // interaction with db is asynchronous
    const users = await User.find(req.query); // ASYNC

    users.length > 0
      ? res.send({ success: true, data: users })
      : res.status(404).send({ success: false, message: 'no user found' }); // SYNC
  } catch (err) {
    /*  res.status(500).send(err) */
    next(err);
  }
};
