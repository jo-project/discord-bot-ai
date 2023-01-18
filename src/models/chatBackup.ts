import { Schema, model } from 'mongoose'

const backup = new Schema({
    user: String,
    message: String
})

export default model('rbx__chat__backup', backup)