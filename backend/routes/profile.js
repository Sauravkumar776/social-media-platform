import express from 'express';
import { viewProfile, updateProfile, deleteProfile } from '../controllers/profile.js';

const router = express.Router();

router.get('/:id', viewProfile);
router.put('/:id', updateProfile);
router.delete('/:id', deleteProfile);

export default router;
