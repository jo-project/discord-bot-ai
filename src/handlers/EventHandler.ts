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

export async function EventHandler(client : Client) {
    const table = new AsciiTable3('Utility Bot Events')
    .setAlignCenter(2)
    .setHeading('Event', 'Status')

    try {
        client.events.clear();
        const paths = await walks(`${process.cwd()}\\dist\\events`)
        await Promise.all(
            paths.map(async (path) => {
                const event = await import(globalFilePath(resolve(path))).then(x => x.default)
                const callback = (...args: any) => void event.callback(client, ...args)
                client.events.set(event.name, callback);

                if (event.once) client.once(event.name, callback);
                else client.on(event.name, callback)

                table.addRow(event.name, 'CONNECTED')
            })
        )
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