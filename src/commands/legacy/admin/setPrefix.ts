import { CommandBuilder } from "@rbxdiscord/builders";
import { default as Client } from '../../../structures/Client.js'
import { Message } from "rbx-discord";
import GuildSchema from '../../../models/guild.js'
const setPrefix = new CommandBuilder()
.setName('setprefix')
.setDescription('Set prefix for guild')
.setClass('Administrator')
.setExecution(
    async(client: Client, message: Message, args: any) => {
        const data: string[] = args

        const targetPrefix = data[0]
        const guildData = await GuildSchema.findOne({ guild: message.guildID }) || await GuildSchema.create({ guild: message.guildID })
        if (guildData) {
            guildData.prefix = targetPrefix;
            guildData.save();
        }

        return console.log(guildData.prefix)
    }
)

export default setPrefix