import { loadEnvFile } from 'process';

loadEnvFile()

export const config = {
	CLIENT_ID: process.env.BOT_CLIENT_ID ?? Throw<string>(new Error("BOT_CLIENT_ID was not defined")),
	BOT_TOKEN: process.env.BOT_TOKEN ?? Throw<string>(new Error("BOT_TOKEN was not defined")),
}

function Throw<T>(error: Error): T {
	throw error
}