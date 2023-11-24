import OrderModel from '../models/orderSchema.js';
import User from '../models/usersSchema.js';

export const getAllOrders = async (req, res, next) => {
  try {
    // POPULATE - just for info about data
    // not populating the DB !!
    const allOrders = await OrderModel.find()
      // when placing orders - ID gets attached
      // telling, u only wanna see the title of the record
      .populate('records', 'title -_id')
      // don't display ID (MINUS - deselecting property)
      .populate('userId'); // show me userId too

    res.send({ success: true, data: allOrders });
  } catch (err) {
    next(err);
  }
};

export const getSingleOrder = async (req, res, next) => {
  try {
    const singleOrder = await OrderModel.findById(req.params.id)
      .populate('records', 'title')
      // .populate({path: "records", select: {title: 1, _id: 0}})
      .populate('userId', '-_id -password -email');

    res.send({ success: true, data: singleOrder });
  } catch (err) {
    next(err);
  }
};

// "/api/orders/getSingleOrderByUserId/343v24kh2v3h42jh52" get order by user ID
export const getOrdersByUserId = async (req, res, next) => {
  try {
    const singleOrderById = await OrderModel.find({ userId: req.params.id })
      .populate('records', 'title')
      //   .populate({path: "records", select: {title: 1, _id: 0}})
      .populate('userId', '-_id -password -email');
    res.send({ success: true, data: singleOrderById });
  } catch (err) {
    next(err);
  }
};

// verify TOKEN of the user (if allowed to add products / place order)

// class version:
export const createOrder = async (req, res, next) => {
  try {
    const order = await OrderModel.create(req.body);
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $push: { orders: order._id } },
      { new: true }
    );
    res.send({ success: true, data: updatedUser });
  } catch (err) {
    next(err);
  }
};

export const updateOrder = async (req, res, next) => {
  try {
    const changeOrder = await OrderModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.send({ success: true, data: changeOrder });
  } catch (err) {
    next(err);
  }
};

export const deleteOrder = async (req, res, next) => {
  try {
    await OrderModel.findByIdAndDelete(req.params.id);

    res.send({
      success: true,
      data: `order deleted (orderID: ${req.params.id})`,
    });
  } catch (err) {
    next(err);
  }
};

export const createOrderMyVersionNotWorking = async (req, res, next) => {
  try {
    // TOEKN checked 1st before other stuff (email, PW etc.)
    const token = req.headers.token;
    // authorisation (process 2 verify USER AUTHENTICATION)
    const payload = jwt.verify(token, process.env.SECRET_KEY); //2nd ARG --> SIGNATURE
    // JWT returns PAYLOAD (data belonging to specific user to whom u issued the token)

    /* NOTES: u calculate totalPrice on the FRONTEND, not here, BUT
    u don't rely on the client for the PRICES --> for security reasons u get it from the DB !! */

    // CREATE INSTANCE: ('cos of that update user not working ??)
    const newOrder = new OrderModel(req.body);
    const calcTotal = newOrder.records.reduce(
      (acc, cur) => (acc += cur?.price),
      0
    );
    newOrder.totalPrice = calcTotal;
    // SAVE it to DB:
    newOrder.save();
    // res.send(newOrder);
    const updateUser = await User.findByIdAndUpdate(
      req.user._id,
      { $push: { orders: newOrder._id } },
      { new: true }
    );

    res.send({ success: true, data: updateUser });

    /*     
    ***** FIRST SOLUTION *****
    it works, but calling the MODEL twice --> better in 3 lines as above !!
    ****************************************
    const newOrder = await OrderModel.create(req.body);

    const calcTotal = newOrder.records.reduce(
      (acc, cur) => (acc += cur?.price),
      0
    );
    
    const test = await OrderModel.findOneAndUpdate(
      newOrder,
      { totalPrice: calcTotal },
      { new: true }
    );

    res.send(test)
     */
  } catch (err) {
    next(err);
  }
};
