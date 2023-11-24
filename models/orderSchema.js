import { Schema, model } from 'mongoose';

const OrderSchema = new Schema({
  records: [{ type: Schema.Types.ObjectId, ref: 'Record' }],
  totalPrice: { type: Number, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

const OrderModel = model('Order', OrderSchema);

export default OrderModel;

/* ---ORDER EXAMPLE---
{
    records: [
        { "title": "HP Pavilion 15-DK1056WM",
        "description": "HP Pavilion 15-DK1056WM Gaming Laptop 10th Gen Core i5, 8GB, 256GB SSD, GTX 1650 4GB, Windows 10",
        "price": 1099,
        "rating": 4.43,
        "brand": "HP Pavilion",
        "category": "laptops",
        "thumbnail": "https://i.dummyjson.com/data/products/10/thumbnail.jpeg",
        "images": ["https://i.dummyjson.com/data/products/10/1.jpg", "https://i.dummyjson.com/data/products/10/2.jpg", "https://i.dummyjson.com/data/products/10/3.jpg", "https://i.dummyjson.com/data/products/10/thumbnail.jpeg"]},
        {
            "title": "perfume Oil",
            "description": "Mega Discount, Impression of Acqua Di Gio by GiorgioArmani concentrated attar perfume Oil",
            "price": 13,
            "rating": 4.26,
            "brand": "Impression of Acqua Di Gio",
            "category": "fragrances",
            "thumbnail": "https://i.dummyjson.com/data/products/11/thumbnail.jpg",
            "images": ["https://i.dummyjson.com/data/products/11/1.jpg", "https://i.dummyjson.com/data/products/11/2.jpg", "https://i.dummyjson.com/data/products/11/3.jpg", "https://i.dummyjson.com/data/products/11/thumbnail.jpg"] 
        }
    ],
    totalPrice: 1122,
    userId: '654cd35b9d30192f6193aee3'
} */
