import dotenv from "dotenv"
dotenv.config()

export const config = {
	CLIENT_ID: process.env.BOT_CLIENT_ID ?? Throw<string>(new Error("BOT_CLIENT_ID was not defined")),
	DEV_GUILD: process.env.DEV_GUILD_ID ?? null,
	BOT_TOKEN: process.env.BOT_TOKEN ?? Throw<string>(new Error("BOT_TOKEN was not defined")),
}

function Throw<T>(error: Error): T {
	throw error
}