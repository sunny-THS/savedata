const { Schema, model } = require('mongoose');

const filesSchema = new Schema({
    name: {
        type: String,
    },
    own: {
        type: String,
    },
    parent: {
        type: String,
    }
});

module.exports =  model("files", filesSchema);