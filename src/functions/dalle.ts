import { default as Client } from "../structures/Client.js";

export async function Dalle(client: Client, prompt: string) {
    const imageData = await client.ai.createImage({
        prompt: prompt,
        n: 1,
        size: '1024x1024'
    })

    const image: string = imageData.data.data[0].url!

   return image
}