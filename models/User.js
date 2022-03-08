const { Schema, model } = require('mongoose');

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 20,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 7
        }
    },
    { timestamps: true }
);

module.exports = model("User", userSchema);