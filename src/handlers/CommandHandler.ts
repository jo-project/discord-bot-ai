import { AsciiTable3 } from 'ascii-table3'
import { default as Client } from '../structures/Client.js'

import { promises } from "fs";
import { pathToFileURL } from 'url';
import { resolve } from 'path';

/**
 * 
 * @param {string} path 
 * @returns {string}
 */
export const globalFilePath = (path: string) => pathToFileURL(path)?.href || path

export async function CommandHandler(client : Client) {
    const table = new AsciiTable3('Utility Bot Commands')
    .setHeading('Command', 'Type', 'Status')
    .setAlignCenter(3)

    try {
        client.commands.clear();
        const paths = await walks(`${process.cwd()}\\dist\\commands`)


        await Promise.all(
            paths.map(async (path) => {
                const command = await import(globalFilePath(resolve(path))).then(x => x.default)
                client.commands.set(command.name, command)
                console.log(command)
                let status: string = '';
                if (command.callback && command.execute) {
                    status = 'Hybrid'
                } else if (command.callback && !command.execute) {
                    status = 'Slash'
                } else if (!command.callback && command.execute) {
                    status = 'Legacy'
                }

                table.addRow(command.name, status, 'CONNECTED')
            })
        )

        client.guildIds.forEach(async guildId => {
            const commands = await client.application.getGuildCommands(guildId)

            commands.forEach(command => {
                const found = client.commands.find((cmd : any) => cmd.name === command.name)
                if (!found) command.delete()
            })

            client.commands.forEach(async (command: any) => {
                if (command.callback) {
                    const found = commands.find(cmd => (cmd.name === command.name))
                    if (!found) client.application.createGuildCommand(guildId, command)
                    else client.application.editGuildCommand(guildId, found.id, command)
                }
            })
        })

        return console.log(table.toString())
    } catch (e) {
        console.log(e)
    }
}

async function walks(path: string, recursive = true) {
    let files: any[] = [];
    const items = await promises.readdir(path, { withFileTypes: true});
    for (const item of items) {
        if (item.isDirectory()) {
            files = [ ...files, ...(await walks(`${path}\\${item.name}`))]
        } else if (item.isFile() && item.name.endsWith('.js')) {
            files.push(`${path}\\${item.name}`)
        }
    }

    return files
}