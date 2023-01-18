import { default as Client } from '../structures/Client.js'

export async function Stable(client: Client, prompt: string) {
  const model = await client.image.models.get('stability-ai/stable-diffusion')
  const prediction: string[] = await model.predict({ prompt: prompt})
  const result = prediction[0]
  return result
}