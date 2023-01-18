import { default as Client } from "../structures/Client.js";
import { Guild, Message } from "rbx-discord";
import GuildSchema from '../models/guild.js'

export async function FindCommandData(client : Client, message: Message) {
    var data = await GuildSchema.findOne({ guild: message.guildID })

    let prefix: string = ''
    if (data && data.prefix) prefix = data.prefix
    else prefix = client.prefix

    if (message.content.startsWith(prefix!)) {
        let args = message.content.slice(prefix!.length).trim().split(/ +/).filter(Boolean)
        console.log(args)
        let command = args.length > 0 ? args.shift()?.toLowerCase() : null
        if (!command || command.length == 0) return;
        let cmd = client.commands.get(command);

        if (cmd) return {
            command: cmd,
            message: message,
            data: args
        }
    }
}