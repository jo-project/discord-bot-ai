import { EventBuilder } from "@rbxdiscord/builders"
import { default as Client } from '../../structures/Client.js'
import { BotActivityTypes } from "rbx-discord";
import mongoose from 'mongoose';

const ready = new EventBuilder(true)
.setName('ready')
.setCallback(
    async (client: Client) => {
        await client.loadCommands()
        console.log(`Logged in as ${client.user.tag}`)
        await mongoose.set('strictQuery', false)
        await mongoose.connect(process.env.BACKUP_URI!)
        client.setPresence({
            status: 'invisible',
            activity: {
                name: 'Artificial Intelligence',
                type: 3
            }
        })
    }
)

export default ready