const { model, Schema } = require('mongoose');

const todoSchema = new Schema({
    task: {
        type: String,
        required: [true, 'Task to do is required']
    },
    details: {
        type: [String]
    },
    category: {
        type: String,
        enum: [
            'Immediate',
            'Urgent',
            'High Priority',
            'Moderate Priority',
            'Low Priority'
        ],
        required: true,
        message: 'Category must be one of: Immediate, Urgent, High Priority, Moderate Priority, Low Priority'
    },
    owner_id: {
        type: String,
        required: [true, 'User id is required']
    },
    deadline: {
        type: Date,
        required: [true, 'Deadline of task is required']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: new Date().toISOString()
    },
    updatedAt: {
        type: Date,
        default: new Date().toISOString()
    },
    deletedAt: {
        type: Date,
        default: null
    }
});

module.exports = model('Todo', todoSchema);