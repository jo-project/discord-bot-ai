import { default as Client } from './structures/Client.js'
import { config } from 'dotenv'

config();

const client = new Client(process.env.TOKEN!, process.env.COOKIE!)
.addGuildId('1055340720430526464')
.start()