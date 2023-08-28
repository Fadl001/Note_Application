"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteInstance = void 0;
const mongoose_1 = require("mongoose");
const noteSchema = new mongoose_1.Schema({
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
});
const NoteInstance = (0, mongoose_1.model)('Note', noteSchema);
exports.NoteInstance = NoteInstance;
