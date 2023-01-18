export async function processText(args: string) {
    let argArray = args.split(" ")
    if (argArray[0].toLowerCase().startsWith('generate')) {
        let flag = argArray.shift();
        const result = argArray.join(' ')
        return result
    }
}