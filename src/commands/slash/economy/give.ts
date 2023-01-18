import { CommandBuilder } from "@rbxdiscord/builders";
import { default as Client } from '../../../structures/Client.js'
import { ChatInputCommandInteraction } from "rbx-discord";
import EconomySchema from '../../../models/economy.js'
import { GiveBalance } from "../../../functions/economy.js";

const give = new CommandBuilder()
.setName('give')
.setDescription('Give money to a person (Owner only)')
.setClass('Owner')
.addNumberOption(option => option
    .setName('amount')
    .setDescription('Amount of money to give')
    .setRequired(true))
.addUserOption(option => option
    .setName('target')
    .setDescription('Target to give')
    .setRequired(false))
.setCallback(
    async (client: Client, interaction: ChatInputCommandInteraction) => {
        await interaction.defer()
        const { user, guildID, options, data } = interaction
        const amount = options.getNumber('amount')
        const target = data.options.getMember('target') || user
        const giveBalance = await GiveBalance(target.id, guildID!, amount!)
        if (giveBalance) {
            return interaction.editOriginal({ content: `<@${user.id}> has gives ${amount} to <@${target.id}>`})
        }
    }
)


export default give