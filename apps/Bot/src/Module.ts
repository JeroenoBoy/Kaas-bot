import { Bot } from './Bot';

export class Module {
	bot: Bot
	public get client() {
		return this.bot.client
	}
}