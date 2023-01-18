import { default as Client } from '../structures/Client.js'

export async function Midjourney(client: Client, prompt: string) {
  const model = await client.image.models.get('prompthero/openjourney')
  const prediction: string[] = await model.predict({ prompt: `mdjrny-v4 style ${prompt}`})
  const result = prediction[0]
  return result
}