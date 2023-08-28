"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNoteById = exports.updateNoteById = exports.getNoteById = exports.getAllNotes = exports.createNote = void 0;
const noteModel_1 = require("../model/noteModel"); // Adjust the path as needed
const utils_1 = require("../utils/utils");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Create a new note
const createNote = async (req, res) => {
    try {
        const jwtsecret = process.env.JWT_SECRET;
        // Validate the request body
        const { error } = utils_1.createNoteSchema.validate(req.body, utils_1.options);
        if (error) {
            return res.status(400).json({ message: error.details[0].message, error: error.message });
        }
        // Retrieve the token from the cookies
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized. Token missing.' });
        }
        try {
            const decodedToken = jsonwebtoken_1.default.verify(token, jwtsecret);
            const userId = decodedToken.userId; // Extracted userId from token payload
            console.log(userId);
            // Now you have the userId associated with the authenticated user
            const newNoteData = {
                ...req.body,
                userId: userId, // Associate the note with the authenticated user
            };
            const newNote = new noteModel_1.NoteInstance(newNoteData);
            console.log(newNote);
            const note = await noteModel_1.NoteInstance.create(newNote);
            console.log(note);
            return res.status(201).json({ note });
        }
        catch (error) {
            return res.status(401).json({ message: 'Unauthorized. Invalid token.', error: error.message });
        }
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.createNote = createNote;
// Get all notes
const getAllNotes = async (_req, res) => {
    try {
        const notes = await noteModel_1.NoteInstance.find();
        res.status(200).json(notes);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAllNotes = getAllNotes;
// Get note by ID
const getNoteById = async (req, res) => {
    const noteId = req.params.id;
    try {
        const note = await noteModel_1.NoteInstance.findById(noteId);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.status(200).json(note);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getNoteById = getNoteById;
// Update note by ID
const updateNoteById = async (req, res) => {
    const noteId = req.params.id;
    try {
        // Validate the request body
        const { error } = utils_1.updateNoteSchema.validate(req.body, utils_1.options);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const updatedNote = await noteModel_1.NoteInstance.findByIdAndUpdate(noteId, req.body, {
            new: true,
        });
        if (!updatedNote) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.status(200).json(updatedNote);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.updateNoteById = updateNoteById;
// Delete note by ID
const deleteNoteById = async (req, res) => {
    const noteId = req.params.id;
    try {
        const deletedNote = await noteModel_1.NoteInstance.findByIdAndRemove(noteId);
        if (!deletedNote) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deleteNoteById = deleteNoteById;
exports.default = {
    createNote: exports.createNote,
    getAllNotes: exports.getAllNotes,
    getNoteById: exports.getNoteById,
    updateNoteById: exports.updateNoteById,
    deleteNoteById: exports.deleteNoteById,
};
