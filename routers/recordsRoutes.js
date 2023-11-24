import { Router } from 'express';
import {
  getAllRecords,
  getSingleRecord,
  createRecord,
  updateRecord,
  deleteRecord,
} from '../controllers/recordsControllers.js';
import { auth } from '../middleware/authorization.js';
import { isAdmin } from '../middleware/adminAuthorization.js';

const router = Router();

// '/api/records'
router.get('/allrecords', getAllRecords); // read
router.get('/singlerecord/:id', getSingleRecord); // read single record
router.post('/newrecord', auth, isAdmin, createRecord); // write
router.patch('/update/:id', auth, isAdmin, updateRecord); // update
router.delete('/delete/:id', auth, isAdmin, deleteRecord); // delete

export default router;
