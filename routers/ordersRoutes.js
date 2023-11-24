import { Router } from 'express';
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getSingleOrder,
  updateOrder,
  getOrdersByUserId,
} from '../controllers/ordersControllers.js';
import { auth } from '../middleware/authorization.js';

const router = Router();

// '/api/orders'
router.get('/allorders', getAllOrders); // read
router.get('/singleorder/:id', getSingleOrder); // read single file
router.get('/getOrderByUserId/:id', getOrdersByUserId); // read single order by the user ID

router.post('/neworder', auth, createOrder); // add middleware 2 verify the token
router.patch('/update/:id', auth, updateOrder); // update
router.delete('/delete/:id', auth, deleteOrder); // delete

export default router;
