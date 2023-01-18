import axios from 'axios'
import fs from 'fs'

export async function download(prediction_url: string) {
    let response;
    do {
        if (!response) {
            response = await axios.get(prediction_url, {
                headers: {
                    'Authorization': 'Token f978b6f9e9a64392651c305779df2ee33d193488'
                }
            }); 
        } else {
            if (response.data) {
                response = await axios.get(response.data.urls.get, {
                    headers: {
                        'Authorization': 'Token f978b6f9e9a64392651c305779df2ee33d193488'
                    }
                });
            }
        }
    } while (response.data.status !== 'succeeded');
    return response;
}

export async function process(uri: string, filename: string) {
    const { data } = await axios.get(uri, { responseType: 'arraybuffer' });
    fs.writeFileSync(filename, Buffer.from(data));
    return data
}