import { Schema, model } from 'mongoose'

const guild = new Schema({
    guild: String,
    prefix: String
})

export default model('rbx__guild_data', guild)