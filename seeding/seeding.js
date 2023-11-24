// ***** NEED to RUN this file SEPARATELY !! it's an independent connection !! *****
// if u want to generate data (so ---> nodemon seeding.js) OR with a path?? node seeding/seeding.js
import mongoose from 'mongoose';
import User from '../models/usersSchema.js';
import { faker } from '@faker-js/faker';

/* try {
  await mongoose.connect('mongodb://127.0.0.1:27017/recordShop');
  console.log('seeding file connected');
} catch (err) {
  console.log(err.message);
} */
await mongoose.connect('mongodb://127.0.0.1:27017/recordShop');
console.log('seeding file connected');

const generateUsers = async () => {
  for (let i = 0; i < 10; i++) {
    await User.create({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });
  }
  return;
};

// close connection has to be inside THEN, 'cos it's SYNC code
generateUsers().then(() => mongoose.connection.close());
