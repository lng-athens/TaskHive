const { model, Schema } = require('mongoose');

const userkeySchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required']
    },
    privateKey: {
        type: [Map],
        of: Schema.Types.Mixed,
        required: [true, 'Private key is required']
    }
});

module.exports = model('UserKey', userkeySchema);