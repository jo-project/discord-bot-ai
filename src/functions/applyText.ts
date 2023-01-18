import { Canvas } from '@napi-rs/canvas'

export async function applyText(canvas : Canvas, text: string) {
    const context = canvas.getContext('2d');

	// Declare a base size of the font
	let fontSize = 70;

	do {
		// Assign the font to the context and decrement it so it can be measured again
		context.font = `${fontSize -= 10}px sans-serif`;
		// Compare pixel width of the text to the canvas minus the approximate avatar size
	} while (context.measureText(text).width > canvas.width);

	// Return the result to use in the actual canvas
	return context.font;
}

