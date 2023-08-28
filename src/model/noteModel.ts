import mongoose, { Document, Schema, Model, model } from 'mongoose';

export interface NoteAttributes {
    Title: string;
    Description: string;
    DueDate: Date;
    Status: string;
    userId: string;
}

export interface NoteDocument extends Document, NoteAttributes {}

export interface NoteModel extends Model<NoteDocument> {}

const noteSchema = new Schema<NoteDocument, NoteModel>({
    Title: {
        type: String,
        required: true,
    },
    Description: {
        type: String,
        required: true,
    },
    DueDate: {
        type: Date,
        required: true,
    },
    Status: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
    },
}, {
    timestamps: true,
}
);

const NoteInstance = model<NoteDocument, NoteModel>('Note', noteSchema);

export { NoteInstance };