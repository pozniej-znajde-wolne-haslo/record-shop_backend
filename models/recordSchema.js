import { Schema, model } from 'mongoose';

const RecordSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  brand: { type: String },
  rating: { type: Number },
  category: { type: String, required: true },
  thumbnail: { type: String, required: true },
  // where u store the img of the product !!??
  images: [String],
  // ARR of string values (string URLs for the IMGs)
});

const RecordModel = model('Record', RecordSchema);
// model()  is a METHOD
// 'Record' --> u should use SINGULAR here! Mongo makes plural
// automatically, when creating DB collection

export default RecordModel;
// export { RecordModel } ===> NAMED EXPORT !!
