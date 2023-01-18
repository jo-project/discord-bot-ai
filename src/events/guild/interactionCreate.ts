import { EmbedBuilder, EventBuilder } from "@rbxdiscord/builders";
import { default as Client } from "../../structures/Client.js";

import { ChatInputCommandInteraction, InteractionTypes } from "rbx-discord";
const interactionCreate = new EventBuilder(false)
.setName('interactionCreate')
.setCallback(
    async (client: Client, interaction: ChatInputCommandInteraction) => {
        if (interaction.type == InteractionTypes.APPLICATION_COMMAND) {
            const command : any = await client.commands.get(interaction.data.name)
            if (command.class === 'Owner' && interaction.user.id !== process.env.OWNER_ID) {
                var errEmbed = new EmbedBuilder()
                .setTitle('Error')
                .setColor(0XFF0000)
                .setDescription(`You can't access owner-class command`)
                .build()

                return interaction.createMessage({ embeds: [errEmbed] })
            }
            await command.callback(client, interaction)
        }
    }
)

export default interactionCreate