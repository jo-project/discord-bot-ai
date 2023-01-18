import { Schema, model } from 'mongoose'

const economy = new Schema({
    guild: String,
    user: String,
    deposit: Number,
    balance: Number
})

export default model('rbx__economy', economy)