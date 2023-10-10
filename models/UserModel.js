const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    email: { type: String, trim: true, required: true, unique: true },
    password: { type: String, trim: true, required: true },    
}, { timestamps: true })

module.exports = mongoose.model("Users", UserSchema)