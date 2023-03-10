import { EventBuilder, AttachmentBuilder, EmbedBuilder } from "@rbxdiscord/builders"
import { Collection, Message } from "rbx-discord"
import { default as Client } from '../../structures/Client.js'
import { data } from "../../configurations/data.js"
import { OpenAI } from "../../functions/openai.js"
import { processText } from "../../functions/process.js"
import { Midjourney } from "../../functions/midjourney.js"
import { Stable } from "../../functions/stable.js"
import { Dalle } from "../../functions/dalle.js"
import { FindCommandData } from "../../functions/findCommandData.js"
import { FindData } from "../../functions/findData.js"
import { CheckBalance, GiveBalance } from "../../functions/economy.js"
import { ChatGPT } from "../../functions/chatgpt.js"

const message = new EventBuilder(false)
.setName('messageCreate')
.setCallback(
    async (client: Client, message: Message) => {
        if (message.author.bot) return;
        // const isDM = await message.inDirectMessageChannel()
        if (message.channelID === data.openai) {
            const response = await OpenAI(client, message.content, message.author.id)
            return message.channel?.createMessage({ content: response, messageReference: { messageID: message.id }})
        } else if(message.channelID === data.chatgpt) {
            const response = await ChatGPT(client, message.content, message.author.id)
            return message.channel?.createMessage({ content: response, messageReference: { messageID: message.id }})
        } else if (message.channelID === data.midjourney) {
            const content = await processText(message.content)
            const res = await Midjourney(client, content!)
            const embed = new EmbedBuilder()
            .setImage(res)
            .setColor(0xFFFFFF)
            .setFooter({ text: `Generated by Midjourney v4`, iconURL: 'https://styles.redditmedia.com/t5_5zvcfk/styles/communityIcon_zy03g6nwnyf91.png?width=256&s=bcbcf64a58885281e2b854ade9dca682de9c2951'})
            .build()

            return message.channel?.createMessage({ content: `**${content}** - <@${message.author.id}>`, embeds: [embed], messageReference: {messageID: message.id}})
        } else if (message.channelID === data.stable) {
            const content = await processText(message.content)
            const res = await Stable(client, content!)


            const embed = new EmbedBuilder()
            .setImage(res)
            .setColor(0xA977DA)
            .setFooter({ text: `Generated by Stable Diffusion 2.1`, iconURL: `https://i.ibb.co/HtN974J/ai.png`})
            .build()

            return message.channel?.createMessage({ content: `**${content}** - <@${message.author.id}>`, embeds: [embed], messageReference: {messageID: message.id}})
        } else if (message.channelID === data.dalle) {
            const content = await processText(message.content)
            const res = await Dalle(client, content!)

            const embed = new EmbedBuilder()
            .setImage(res)
            .setColor(0x151515)
            .setFooter({ text: `Generated by DALL??E`, iconURL: 'https://openai.com/content/images/2022/05/openai-avatar.png'})
            .build()

            return message.channel?.createMessage({ content: `**${content}** - <@${message.author.id}>`, embeds: [embed], messageReference: {messageID: message.id}})
        } else if (message.channelID === data.command) {
            const cmdData = await FindCommandData(client, message)
            if (cmdData) {
                const command : any = cmdData.command
                const message = cmdData.message
                const args : any = cmdData.data
                console.log(args)

                try {
                    await command.execute(client, message, args)
                } catch(e) {
                    console.error(e)
                }
            }
        } else if (message.channelID === `1064850550895685682`) {
            await message.channel?.sendTyping()
            const result = await FindData(client, message)
            if (result) {
                if (result.type === 'check') {
                    const data = await CheckBalance(message.author.id, message.guildID!)
                    if (data) {
                        return message.reply({ content: `You have $${data.deposit} on deposit and $${data.balance} on balance.`})
                    }
                } else if (result.type === 'transfer') {
                    console.log(result.amount, result.target)
                }
            }
        }
    }
)

export default message