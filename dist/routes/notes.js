"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const noteController_1 = require("../controller/noteController");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
/* GET home page. */
router.post('/create', auth_1.auth, noteController_1.createNote);
router.get('/get-notes', auth_1.auth, noteController_1.getAllNotes);
router.patch('/update-note/:id', auth_1.auth, noteController_1.updateNoteById);
router.delete('/delete-note/:id', auth_1.auth, noteController_1.deleteNoteById);
exports.default = router;
