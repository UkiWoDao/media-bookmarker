<<<<<<< HEAD
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
    }
});

=======
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
    }
});

>>>>>>> 69dcf7cd57e9128688be461bf20835f57a4b8422
mongoose.model('media', MediaSchema);