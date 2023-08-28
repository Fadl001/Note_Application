import express,{Request, Response, NextFunction} from 'express';
import { Register, Login, getAllUsers } from '../controller/userController';
import { getNoteById } from '../controller/noteController';
const router = express.Router();

/* GET users listing. */
router.post('/register', Register);
router.post('/login', Login);
router.get('/get-notes', getNoteById);
router.get('/get-users', getAllUsers);

export default router;
