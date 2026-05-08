import express from 'express';
import { createLead, deleteLead, getLeads, updateLead } from '../controllers/lead.controller.js';
const router = express.Router();

router.post('/', createLead);
router.get('/', getLeads);
router.patch('/', updateLead);
router.delete('/', deleteLead);

export default router;