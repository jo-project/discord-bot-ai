import { balanceOptions, transferOptions } from "../configurations/balance.js";
import { Message } from "rbx-discord";
import { default as Client } from '../structures/Client.js'

export async function FindData(client : Client, message: Message) {
    const match_1 = transferOptions.find(option => option.exec(message.content));
    const match_2 = balanceOptions.some(option => new RegExp(`^${option}\\?*$`, 'i').test(message.content));
    console.log(match_1)
    if (match_1) {
        console.log('A')
        const checkMatch = match_1.exec(message.content)
        return {
            type: "transfer",
            amount: checkMatch![0],
            target: checkMatch![1]
        }
    }
    else if (match_2) return {
        type: "check"
    }
}