import { default as Client } from '../structures/Client.js'
import { default as ChatBackup } from '../models/aiBackup.js'
import { ChatResponse } from "chatgpt";
export async function ChatGPT(client: Client, text: string, user: string) {
    var backupData = await ChatBackup.findOne({ user: user }) || await ChatBackup.create({ user: user })

    var response : ChatResponse
    if (backupData.conversationId && backupData.parentMessageId) {
        response = await client.api.sendMessage(text, {
            conversationId: backupData.conversationId,
            parentMessageId: backupData.parentMessageId
        })
    } else {
        response = await client.api.sendMessage(text)
    }
    
    backupData.conversationId = response.conversationId
    backupData.parentMessageId = response.messageId
    backupData.save()

    const res = response.response
    return res
}