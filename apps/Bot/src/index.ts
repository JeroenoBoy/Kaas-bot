import { Bot } from './Bot.js';
import { config } from './config.js';
import { HelloModule } from './modules/hello/index.js';
import { PrismaClient } from '@repo/db';
import { BirthdayModule } from './modules/birthday/index.js';

async function main() {

	const prisma = new PrismaClient()
	await prisma.$connect()
	console.log("Connected to db")
	
	const bot = new Bot(config.CLIENT_ID, config.BOT_TOKEN);

	if (config.DEV_GUILD != null) {
		console.log("Using dev guild", config.DEV_GUILD)
	}

	bot.addModule(new HelloModule())
	bot.addModule(new BirthdayModule(prisma))
	await bot.init()
	await bot.commandHandler.updateCommands(config.DEV_GUILD)

	bot.client.once("ready", c => console.log("Client is ready"))

	await bot.start()
}

main()