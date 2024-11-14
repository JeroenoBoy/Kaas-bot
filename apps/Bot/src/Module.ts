import { Bot } from './Bot.js';
import { Command } from './commands/Command.js';

export abstract class Module {
	//@ts-ignore
	bot: Bot = null
	
	public get client() {
		return this.bot.client
	}

	addCommand(command: Command) {
		command.module = this;
		this.bot.commandHandler.addCommand(command)
	}

	public abstract init(): Promise<void> | void
	public abstract ready(): Promise<void> | void
}