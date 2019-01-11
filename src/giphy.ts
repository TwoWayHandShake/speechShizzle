import axios from "axios";

const API_KEYS = [
	"098bp5rbz5oRCsbNqOfrDJT5EecbSCXs",
	"qsJL0hUiBazkjkQTZWvgFX2ATawYOHcp",
	"ppRcLc2j7uB49TVrVAslibdoTZewMPGM",
	"x8D6sHzDy0H4Q959Cm19GNvh0Ydb5Pr5",
	"zyk0hiXD6TduvPafJumM6UBdSQCcZSNb",
	"kxOy2220algKcmTAdh82ARfxpGhNeVMf",
	"4Nu26m9hRLo1ZOv9mXu1QNJptIUTIN2u"
];

export async function getImage(tag: string) {
	const apiKey = API_KEYS[Math.floor(API_KEYS.length * Math.random())];
	const url = `https://api.giphy.com/v1/gifs/random?tag=${encodeURIComponent(
		tag.toLowerCase()
	)}&api_key=${apiKey}&limit=1`;
	const {
		data: {
			data: { image_url }
		}
	} = await axios.get(url);

	return image_url;
}
