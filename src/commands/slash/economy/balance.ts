import { CommandBuilder, EmbedBuilder } from "@rbxdiscord/builders";
import { default as Client } from '../../../structures/Client.js'
import { ChatInputCommandInteraction } from "rbx-discord";
import EconomySchema from '../../../models/economy.js'
import { CheckBalance } from "../../../functions/economy.js";
import Canvas, { GlobalFonts } from '@napi-rs/canvas'
import { join } from "path";

const balance = new CommandBuilder()
.setName('balance')
.setDescription('Set prefix for guild')
.setClass('Administrator')
.setCallback(
    async (client: Client, interaction: ChatInputCommandInteraction) => {
        const { user, guildID } = interaction
        const getBalance = await CheckBalance(user.id, guildID!)

        await interaction.defer()
        if (getBalance) {
            const canvas = Canvas.createCanvas(372, 235);
            const context = canvas.getContext('2d');
            const background = await Canvas.loadImage('https://i.ibb.co/m8rHqMt/Credit-Card.png')
            context.drawImage(background, 0, 0, canvas.width, canvas.height);
            context.font = '28px sans-serif Candara'
	        context.fillStyle = '#ffffff';
	        context.fillText('RbxDiscord', 28, 39)

            const userId = user.id
            const result = userId.match(/.{1,4}/g) ?? [];

            console.log(canvas.width)
            context.font = '20px sans-serif Candara'
	        context.fillStyle = '#ffffff';
	        context.fillText(result.join(' '), 70, 180)

            const image = await canvas.encode('png')

            const attachment = {
                name: `credit-card.png`,
                contents: image
            }

            const embed = new EmbedBuilder()
            .setTitle('Balance')
            .addFields(
                {
                    name: 'Wallet',
                    value: `$${getBalance.deposit}`
                },
                {
                    name: 'Bank',
                    value: `$${getBalance.balance}`
                }
            )
            .setImage('attachment://credit-card.png')
            .build();
            
            return interaction.editOriginal({ embeds: [embed], files: [attachment]})
        }
    }
)


export default balance