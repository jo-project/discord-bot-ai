import { Message } from "rbx-discord";
import { default as Client } from '../structures/Client.js'
import { default as ChatBackup } from '../models/chatBackup.js'
export async function OpenAI(client: Client, text: string, user: string) {
    var backupData = await ChatBackup.findOne({ user: user })
    if (!backupData) {
        backupData = new ChatBackup({
            user: user,
            message: ''
        })
    }

    const newMessage = `${backupData.message}` + `${text}\n\n`
    const messageResponse = await client.ai.createCompletion({
        model: 'text-davinci-003',
        prompt: newMessage,
        temperature: 0.9,
        max_tokens: 500,
        stop: ['RbxChat:', 'JW:']
    })

    const response = messageResponse.data.choices[0].text
    const saveMessage = newMessage + `${response}\n\n`

    backupData.message = saveMessage
    backupData.save();

    return response
}