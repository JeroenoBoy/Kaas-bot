import { loadEnvFile } from 'process';
import { Bot } from './Bot';
import { config } from './config';
import { HelloModule } from './modules/helloModule';

async function main() {
	
	const bot = new Bot(config.CLIENT_ID, config.BOT_TOKEN);

	if (config.DEV_GUILD != null) {
		console.log("Using dev guild", config.DEV_GUILD)
	}

	bot.addModule(new HelloModule())
	await bot.init()
	await bot.commandHandler.updateCommands(config.DEV_GUILD)

	bot.client.once("ready", c => console.log("Client is ready"))

	await bot.start()
}

main()