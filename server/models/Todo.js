const { model, Schema } = require('mongoose');

const todoSchema = new Schema({
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