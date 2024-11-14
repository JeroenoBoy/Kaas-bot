import { loadEnvFile } from 'process';
import { Bot } from './Bot';
import { config } from './config';
import { HelloModule } from './modules/hello';
import { PrismaClient } from '@repo/db';
import { BirthdayModule } from './modules/birthday';

async function main() {

	const db = new PrismaClient()
	await db.$connect()
	console.log("Connected to db")
	
	const bot = new Bot(config.CLIENT_ID, config.BOT_TOKEN);

	if (config.DEV_GUILD != null) {
		console.log("Using dev guild", config.DEV_GUILD)
	}

	bot.addModule(new HelloModule())
	bot.addModule(new BirthdayModule(db))
	await bot.init()
	await bot.commandHandler.updateCommands(config.DEV_GUILD)

	bot.client.once("ready", c => console.log("Client is ready"))

	await bot.start()
}

main()