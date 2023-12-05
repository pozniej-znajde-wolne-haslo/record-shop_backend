/* in JSON - start - nodemon app.js (need only npm start im terminal)
u can type anything, e.g: bla: nodemon app.js
but then u needto type npm run && the bla word !!


interaction with a DB --> always returns a promise, and is asynchronous, always runs as ASYNC code !!
---> need to use AWAIT keyword, otherwise, sync code will execute first (res.send() should wait for the async code)
AWAIT --> 'wait and go first' !!
SYNC code -- executed first*/

// always send the same FORMAT in the RES in all controllers !!
// if JSON data ({msg:'vvvv}), then not TEXT data ('dsfhkdgfhkd')...
// for text, u have to use RES.TEXT in react
// it causes problems in the forntend

// import stuff you need
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';
// CROSS ORIGIN RESOURCE SHARING (package)
import dotenv from 'dotenv';
// calling DOTENV 2 be able to use the ENV VARIABLES (e.g. --PORT--)
dotenv.config();
// import ROUTES:
import usersRoutes from './routers/usersRoutes.js';
import recordsRoutes from './routers/recordsRoutes.js';
import ordersRoutes from './routers/ordersRoutes.js';
import RecordModel from './models/recordSchema.js';
// (if u import the MODEL --> MONGO creates COLL in the DB) automatically !! (delete it potem ??)
/* OR u click PLUS sign next to DB name in MONGO && add collecion
THEN - IMPORT DATA (newer version --> can choose b/n JSON or CVS), my version NOT
and u mnie only 'stop on errors', newer version -->
another option (sth sth)*/

// creating express server
const app = express();

// middleware to parse any incoming json data
app.use(express.json());

// connect to MongoDB through mongoose
mongoose
  .connect(
    'mongodb+srv://anuch:j0iLuClecIyE2Iy9@cluster0.4wuv4h7.mongodb.net/record-shop'
  )
  .then(() => console.log('connected to DB'))
  .catch((err) => console.log(err));

// cors middleware
/* app.use(
  cors({
    origin: 'https://record-shop-frontend-zcy0.onrender.com',
    //allowHeaders: ['Content-Type', 'Authorization'],
    // methods: 'GET,POST,PATCH,PUT,DELETE',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    exposedHeaders: ['token'],
    //credentials: true,
    //preflightContinue: true,
  })
); */

//app.options('*', cors());

app.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Origin',
    'https://record-shop-frontend-zcy0.onrender.com'
  );
  res.header('Access-Control-Allow-Methods', [
    'GET',
    'POST',
    'PATCH',
    'PUT',
    'DELETE',
  ]);
  res.header('Access-Control-Allow-Headers', ['Content-Type', 'Authorization']);
  res.header('Access-Control-Expose-Headers', 'token');
  next();
});

// middleware morgan
// each time u make REQ, it logs the method & time of your REQ
app.use(morgan('tiny'));

// the routers
// like middleware, to handle the REQ & send them to a specific route
// --API-- used, whenever u work with REST-API
// localhost:8000/api/users
app.use('/api/users', usersRoutes);
// localhost:8000/api/records
app.use('/api/records', recordsRoutes);
// localhost:8000/api/orders
app.use('/api/orders', ordersRoutes);

// middleware to handle errors
// so u can use NEXT(err) in the CATCH blocks
app.use((error, req, res, next) => {
  res.status(error.status || 500).send(error.message || 'something went wrong');
});

// the server should listen on port 8000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('server running on PORT', PORT));
