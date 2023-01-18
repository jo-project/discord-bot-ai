import { Client, Intents, Collection, SendStatuses, BotActivity } from "rbx-discord";
import { EventHandler } from "../handlers/EventHandler.js";
import { Configuration, OpenAIApi } from "openai";
import { ChatGPTAPIBrowser } from "chatgpt";
import { Replicate } from 'replicate-js'
import { config } from 'dotenv';
import { HttpClient } from "./httpClient.js";
import { CommandHandler } from "../handlers/CommandHandler.js";
config();

const configuration = new Configuration({
    organization: process.env.OPEN_AI_ORG,
    apiKey: process.env.OPEN_AI_KEY
})

type PresenceOptions = {
    activity: BotActivity,
    status: SendStatuses,
}


export default class ExtendedClient extends Client {

    constructor(token : string, cookie: string, handlers = { commands: '', events: ''}) {
        super({
            auth: `Bot ${token}`,
            cookie: cookie,
            gateway: {
                intents: [
                    Intents.DIRECT_MESSAGES,
                    Intents.GUILDS,
                    Intents.GUILD_BANS,
                    Intents.GUILD_INTEGRATIONS,
                    Intents.GUILD_MEMBERS,
                    Intents.GUILD_MESSAGE_TYPING,
                    Intents.DIRECT_MESSAGE_TYPING,
                    Intents.GUILD_MESSAGES,
                    Intents.GUILD_PRESENCES,
                    Intents.GUILDS,
                    Intents.MESSAGE_CONTENT
                ],
                maxShards: 'auto',
                presence: {
                    activities: [{ name: 'AI', type: 3 }],
                    status: 'invisible'
                }
            },
            handlers: handlers,
            
        })
    }

    addGuildId(id: string): this {
        if (!this.guildIds.some(id => id)) {
            this.guildIds.push(id)
        }

        return this
    }

    setDefaultPrefix(prefix: string) : this {
        this.prefix = prefix;

        return this
    }

    async setPresence(options: PresenceOptions) : Promise<void> {
        this.editStatus(options.status, [options.activity])
    }

    public api: ChatGPTAPIBrowser = new ChatGPTAPIBrowser({
        isGoogleLogin: true,
        email: 'routildiscord@gmail.com',
        password: 'discordroutil'
    });

    public image: Replicate = new Replicate({
        token: `48bde030673fbdd323d7ab5b1bb33896c1eb5887`,
        httpClient: HttpClient,
        pollingInterval: 5000
    })

    public commands = new Collection()
    public prefix: string = ';'
    public ai = new OpenAIApi(configuration)
    public events = new Collection();
    public guildIds : string[] = [];

    async loadEvents() {
        await EventHandler(this)
    }

    async loadCommands() {
        await CommandHandler(this)
    }

    /**
     * Run the client
     */
    start(): this {
        this.connect().then((async () => {
            await this.loadEvents()
            await this.connectRoblox()
            await this.api.initSession()
        }))
        return this;
    }
}