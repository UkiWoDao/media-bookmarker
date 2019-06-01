const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// app level schema is good practice even in nonschematic databases like mongo
const MediaSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    type:{
        // FIX: find way to get radio input
        type: String,
        required: true
    },
    favourite:{
        default: false,
        type: Boolean,
        required: true
    },
});

mongoose.model('media', MediaSchema);