const mongoose = require('mongoose');

const taskSchema = mongoose.Schema(
    {
        title: { type: String, required: true, minLength: 1, maxLength: 150 },
        description: { type: String, minLength: 5, maxLength: 300 },
        date: { type: Date },
        status: {
            type: String,
            enum: ['toDo', 'inProgress', 'done'],
            default: 'toDo',
            required: true,
        },
        category: { type: String },
        userId: { type: mongoose.SchemaTypes.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true },
);

module.exports = mongoose.model('Task', taskSchema);
