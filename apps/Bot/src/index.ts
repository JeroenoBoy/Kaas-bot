import { loadEnvFile } from 'process';
import { Bot } from './Bot';
import { config } from './config';
import { HelloModule } from './modules/helloModule';

async function main() {
	
	const bot = new Bot(config.CLIENT_ID);

	bot.addModule(new HelloModule())
	await bot.init()
	await bot.manageCommands()

	await bot.start(config.BOT_TOKEN)
}

main()