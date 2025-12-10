const { Schema, model } = require('mongoose');

const gardenSchema = new Schema({
    name: {
        required: true,
        type: String,
        unique: true,
    },
    description: {
        type: String,
    },
    location: {
        lat: {
            type: Number,
        },
        lng: {
            type: Number,
        },
        address: {
            type: String,
        },
    },
    joinCode: {
        type: String,
        unique: true,
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    maxMembers: {
        type: Number,
        default: 10,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

gardenSchema.index({ name: 1 }, {
    collation: {
        locale: 'en',
        strength: 2
    }
});

const Garden = model('Garden', gardenSchema);

module.exports = Garden;
