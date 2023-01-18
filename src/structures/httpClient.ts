type HttpGetOptions = {
    url: string,
    token: string,
    event?: any
}

type HttpPostOptions = {
    url: string,
    token: string,
    body?: any,
    event?: any
}

import axios from 'axios'

export const HttpClient = {
    // Method arguments use object destructuring
    // All arguments are optional, can be in any order, but cannot be renamed
    get: async (options: HttpGetOptions) => {
        const response = await axios.get(options.url, {headers: {'Authorization': `Token ${options.token}`}})
        console.log(`Handling ${options.event} event`); // Possible values: getModel, getPrediction
        return response.data;
    },
    post: async (options: HttpPostOptions) => {
        const response = await axios.post(options.url, options.body, {headers: {'Authorization': `Token ${options.token}`}})
        console.log(`Handling ${options.event} event`); // Possible values: startPrediction
        return response.data;
    }
}