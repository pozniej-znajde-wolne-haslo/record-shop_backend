import { Router } from 'express';
import {
  getAllUsers,
  login,
  register,
  updateUser,
  deleteUser,
} from '../controllers/usersControllers.js';
import {
  userRegisterValidation,
  userValidationTest,
} from '../middleware/validation.js';
import { auth } from '../middleware/authorization.js';
import { isAdmin } from '../middleware/adminAuthorization.js';

const router = Router();

router.post('/login', login);
router.post('/register', userRegisterValidation, register); // validation MIDLLEWARE

// TEST
// router.post("/validation", userValidationsTest);

router.patch('/update/:id', auth, isAdmin, updateUser);
router.delete('/delete/:id', auth, isAdmin, deleteUser);
router.get('/allUsers', auth, isAdmin, getAllUsers);
// verify TOKEN route (to keep USER state, when re-loading the page):
// token saved in the LOCAL STORAGE (set expiry in the controller !!) & used for that
router.get('/verifytoken', auth, (req, res) =>
  res.send({ success: true, data: req.user })
);

export default router;
