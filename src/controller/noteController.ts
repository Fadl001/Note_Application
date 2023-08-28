import { Request, Response } from 'express';
import { NoteDocument, NoteInstance } from '../model/noteModel'; // Adjust the path as needed
import { createNoteSchema, updateNoteSchema, options } from '../utils/utils';
import jwt from 'jsonwebtoken';


// Create a new note
export const createNote = async (req: Request, res: Response) => {
    try {
        const jwtsecret = process.env.JWT_SECRET as string;
        // Validate the request body
        const { error } = createNoteSchema.validate(req.body, options);
        if (error) {
            return res.status(400).json({ message: error.details[0].message, error:error.message });
        }

        // Retrieve the token from the cookies
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized. Token missing.' });
        }

        interface TokenPayload {
            userId: string; // Must be a string, not a UserDocument
        }
        
        try {
            const decodedToken = jwt.verify(token, jwtsecret) as TokenPayload;
            const userId = decodedToken.userId; // Extracted userId from token payload
            console.log(userId);

            // Now you have the userId associated with the authenticated user
            const newNoteData = {
                ...req.body,
                userId: userId, // Associate the note with the authenticated user
            };
            const newNote = new NoteInstance(newNoteData);
            console.log(newNote);
            const note = await NoteInstance.create(newNote);
            console.log(note);
            return res.status(201).json({note});
        } catch (error: any) {
            return res.status(401).json({ message: 'Unauthorized. Invalid token.', error: error.message });
        }
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};


// Get all notes
export const getAllNotes = async (_req: Request, res: Response) => {
    try {
        const notes = await NoteInstance.find();
        res.status(200).json(notes);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Get note by ID
export const getNoteById = async (req: Request, res: Response) => {
    const noteId = req.params.id;
    try {
        const note = await NoteInstance.findById(noteId);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.status(200).json(note);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Update note by ID
export const updateNoteById = async (req: Request, res: Response) => {
    const noteId = req.params.id;
    try {
        // Validate the request body
        const { error } = updateNoteSchema.validate(req.body, options);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const updatedNote = await NoteInstance.findByIdAndUpdate(noteId, req.body, {
            new: true,
        });
        if (!updatedNote) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.status(200).json(updatedNote);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

// Delete note by ID
export const deleteNoteById = async (req: Request, res: Response) => {
    const noteId = req.params.id;
    try {
        const deletedNote = await NoteInstance.findByIdAndRemove(noteId);
        if (!deletedNote) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export default {
    createNote,
    getAllNotes,
    getNoteById,
    updateNoteById,
    deleteNoteById,
};