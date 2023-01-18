import path from 'path'
import url from 'url'

export async function GenerateImage() {
    const imagePath = '../images/Stability-AI.png'
    const imageUrl = url.format({
        protocol: 'file',
        pathname: path.resolve(imagePath)
    });

    return imageUrl
}