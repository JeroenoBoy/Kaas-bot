import { Bot } from './Bot';
import { Command } from './Command';

export abstract class Module {
	bot: Bot
	readonly commands = new Array<Command>()
	
	public get client() {
		return this.bot.client
	}

	addCommand(command: Command) {
		this.commands.push(command)
	}

	public abstract init(): Promise<void> | void
	public abstract ready(): Promise<void> | void
}