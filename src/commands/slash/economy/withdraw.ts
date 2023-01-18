import { CommandBuilder, EmbedBuilder } from "@rbxdiscord/builders";
import { default as Client } from '../../../structures/Client.js'
import { ChatInputCommandInteraction } from "rbx-discord";
import { IfBankBalanceEnough, Withdraw } from "../../../functions/economy.js";

const withdraw = new CommandBuilder()
.setName('withdraw')
.setDescription('Withdraw money from bank to wallet')
.setClass('Member')
.addNumberOption(option => option
    .setName('amount')
    .setDescription('Amount of money to withdraw')
    .setRequired(true)
    .setMinValue(1))
.setCallback(
    async (client: Client, interaction: ChatInputCommandInteraction) => {
        const { user, guildID, options } = interaction
        const amount = options.getNumber('amount')
        if (amount) {
            const CheckBalance = await IfBankBalanceEnough(user.id, guildID!, amount)
            if (CheckBalance.status === false) {
                
            }
        }
    }
)


export default withdraw