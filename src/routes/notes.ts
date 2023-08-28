import express from 'express';
import { createNote, getAllNotes, updateNoteById, deleteNoteById } from '../controller/noteController';
import { auth } from '../middlewares/auth';


const router = express.Router();

/* GET home page. */
router.post('/create', auth, createNote);
router.get('/get-notes', auth, getAllNotes);
router.patch('/update-note/:id', auth, updateNoteById);
router.delete('/delete-note/:id', auth, deleteNoteById);

export default router;
