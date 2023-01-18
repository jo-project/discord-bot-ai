import { CommandBuilder, EmbedBuilder } from "@rbxdiscord/builders";
import { default as Client } from '../../../structures/Client.js'
import { ChatInputCommandInteraction } from "rbx-discord";
import EconomySchema from '../../../models/economy.js'
import { IfBalanceEnough, Pay } from "../../../functions/economy.js";

const pay = new CommandBuilder()
.setName('pay')
.setDescription('Pay money to a person')
.setClass('Owner')
.addUserOption(option => option
    .setName('target')
    .setDescription('Target to give')
    .setRequired(true))
.addNumberOption(option => option
    .setName('amount')
    .setDescription('Amount of money to give')
    .setRequired(true))
.setCallback(
    async (client: Client, interaction: ChatInputCommandInteraction) => {
        const { user, guildID, options, data } = interaction
        const amount = options.getNumber('amount')
        const target = data.options.getMember('target')
        if (target) {
            if (target.id === user.id && user.id !== process.env.OWNER_ID) {
                await interaction.defer(64)
                const errEmbed = new EmbedBuilder()
                .setTitle(`Error`)
                .setDescription(`\`\`\`You can't pay to yourself [1431]\`\`\``)
                .build()

                return interaction.editOriginal({ embeds: [errEmbed]})
            }

            const BalanceEnough = await IfBalanceEnough(target.id, guildID!, amount!)
            if (BalanceEnough) {
                if (BalanceEnough.status === false) {
                    await interaction.defer(64)
                    const errEmbed = new EmbedBuilder()
                    .setTitle(`Error`)
                    .setDescription(`\`\`\`${BalanceEnough.description} [1578]\`\`\``)
                    .build()

                    return interaction.editOriginal({ embeds: [errEmbed]})
                } else if (BalanceEnough.status === true) {
                    await interaction.defer(64)
                    const Payment = await Pay(user.id, target.id, guildID!, amount!)
                    if (Payment?.status === true) {
                        const succEmbed = new EmbedBuilder()
                        .setTitle(`Success`)
                        .setDescription(`\`\`\`You have successfully pay $${amount} to ${target.username}\`\`\``)
                        .build();

                        return interaction.editOriginal({ embeds: [succEmbed]})
                    } else if (Payment?.status === false) {
                        const errEmbed = new EmbedBuilder()
                        .setTitle(`Error`)
                        .setDescription(`\`\`\`${target.username} doesn't have an account yet. [1326]\`\`\``)
                        .build();

                        return interaction.editOriginal({ embeds: [errEmbed]})
                    }
                }
            }
        }
    }
)


export default pay