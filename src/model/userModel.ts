import mongoose, { Document, Schema, Model, model } from 'mongoose';
import { NoteDocument } from './noteModel'; // Import the NoteDocument interface

export interface UserAttributes {
    fullName: string;
    email: string;
    gender: string;
    phone: string;
    address: string;
    password: string;
}

export interface UserDocument extends Document, UserAttributes {
    notes: NoteDocument['_id'][];
}

export interface UserModel extends Model<UserDocument> {}

const userSchema = new Schema<UserDocument, UserModel>({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    gender: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
},{
    timestamps: true,
});

userSchema.virtual('notes', {
    ref: 'Note', // The model to use
    localField: '_id',
    foreignField: 'userId',
    justOne: false,
});

const UserInstance = model<UserDocument, UserModel>('User', userSchema);

export { UserInstance };