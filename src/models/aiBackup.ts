import { Schema, model } from 'mongoose'

const backup = new Schema({
    user: String,
    conversationId: String,
    parentMessageId: String
})

export default model('rbx__ai__backup', backup)