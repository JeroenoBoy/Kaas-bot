import { Command } from './commands/Command';
import { CommandHandler } from './commands/CommandHandler';
import { Module } from './Module';
import { ApplicationCommand, Client, IntentsBitField, Interaction, REST, Routes, SlashCommandBuilder } from "discord.js";

export class Bot {

	readonly clientId: string;
	readonly client: Client<true>;
	readonly commandHandler: CommandHandler
	get rest(): REST { return this.client.rest }

	private readonly token: string;
	private readonly modules = new Array<Module>();
	private isInitialized = false;

	constructor(clientId: string, token: string) {
		this.token = token;
		this.clientId = clientId;
		this.client = new Client({
			intents: []
		});
		this.client.rest.setToken(token)
		this.commandHandler = new CommandHandler(this)
		this.client.on("interactionCreate", i => this.handleInteraction(i))
	}
	
	public addModule(module: Module) {
		if (this.isInitialized) { throw new Error("Cannot add module after bot has been initialized") }
		module.bot = this;
		this.modules.push(module);
	}

	public async init() {
		if (this.isInitialized) { throw new Error("Bot has already been initialized") }
		
		const promises = new Array<Promise<void>>()
		this.modules.forEach(it => promises.push(it.init() as any))
		await Promise.all(promises)

		this.isInitialized = true;
	}

	public async start() {
		if (!this.isInitialized) { throw new Error("Please initialize the client before starting the bot") }

		await this.client.login(this.token)

		const promises = new Array<Promise<void>>()
		this.modules.forEach(it => promises.push(it.ready() as any))
		await Promise.all(promises)
	}

	private handleInteraction(interaction: Interaction) {
		if (interaction.isCommand()) {
			this.commandHandler.handleCommand(interaction)
		}
	}
}