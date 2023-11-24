import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],

  // in reality - remove ADMIN here & create a separate SCHEMA 4 ADMIN
  // OR create ADMIN user && then DELETE ADMIN from ENUM
  // SO ---Y just once 4 PRODUCTION create ADMIN
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  // can add mor roles & conditions (e.g. manager - cann see all users, but not change any data)
});

const User = model('User', userSchema);

export default User;
