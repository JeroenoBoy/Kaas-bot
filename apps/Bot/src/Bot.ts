import { Module } from './Module';
import { ApplicationCommand, Client, IntentsBitField, REST, Routes } from "discord.js";

export class Bot {

	readonly clientId: string;
	readonly client: Client<true>;
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

	public async manageCommands(devGuild: string | null = null) {
		const commmands = this.modules.flatMap(it => it.commands)

		const applicationCommands = await this.rest.get(Routes.applicationCommands(this.clientId)) as ApplicationCommand[]

		for (const command in commmands) {
			const cmd = applicationCommands.find(it => it.name == command)
		}
	}

	public async start() {
		if (this.isInitialized) { throw new Error("Please initialize the client before starting the bot") }

		await this.client.login(this.token)

		const promises = new Array<Promise<void>>()
		this.modules.forEach(it => promises.push(it.ready() as any))
		await Promise.all(promises)
	}
}