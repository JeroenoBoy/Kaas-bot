import { APIApplicationCommand, ChatInputCommandInteraction, CommandInteraction, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes } from 'discord.js'
import { Command } from './Command'
import { Bot } from '../Bot'
import { commandMatches } from './compareCommands'

export type CommandData = RESTPostAPIChatInputApplicationCommandsJSONBody

export class CommandHandler {
	private commands = new Array<Command>()
	private commandMap = new Map<string, Command>()
	private bot: Bot

	public get rest() { return this.bot.rest }
	public get clientId() { return this.bot.clientId }

	constructor(bot: Bot) {
		this.bot = bot
	}

	public addCommand(command: Command) {
		this.commands.push(command)
	}

	public async handleCommand(interaction: ChatInputCommandInteraction) {
		const cmd = this.commandMap.get(interaction.commandId)
		if (cmd == null) {
			interaction.reply({ ephemeral: true, content: "Command niet gevonden, misschien heeft Gouda kaas 'm gestolen 🧀" })
			return
		}
		cmd.execute(interaction)
	}

	public async updateCommands(devGuild: string | null = null) {
		const commands = [...this.commands]

		const route = devGuild == null ? Routes.applicationCommands(this.clientId) : Routes.applicationGuildCommands(this.clientId, devGuild)

		const applicationCommands = await this.rest.get(route) as APIApplicationCommand[]
		let commandsToRemove = [...applicationCommands]
		const promises = new Array<Promise<any>>()

		for (const command of commands) {
			const cmd = applicationCommands.find(it => it.name == command.builderData.name)
			if (cmd == null) {
				promises.push(this.registerCommand(command, devGuild))
				continue
			}

			commandsToRemove = commandsToRemove.filter(it => it.id != cmd.id)

			if (!commandMatches(command.builderData, cmd)) {
				promises.push(this.updateCommand(cmd.id, command, command.builderData, devGuild))
				continue
			}

			command.data = cmd;
		}

		for (const cmd of commandsToRemove) {
			promises.push(this.deleteCommand(cmd, devGuild))
		}

		await Promise.all(promises)
		
		for (const cmd of commands) {
			this.commandMap.set(cmd.data.id, cmd)
		}
	}

	private async registerCommand(command: Command, devGuild: string | null = null) {
		const route = devGuild == null ? Routes.applicationCommands(this.clientId) : Routes.applicationGuildCommands(this.clientId, devGuild)
		const d = await this.rest.post(route, { body: command.builderData }) as APIApplicationCommand
		command.data = d;
		console.log("Registered command", command.builderData.name)
	}

	private async updateCommand(id: string, command: Command, body: CommandData, devGuild: string | null) {
		const route = devGuild == null ? Routes.applicationCommand(this.clientId, id) : Routes.applicationGuildCommand(this.clientId, devGuild, id)
		const d = await this.rest.patch(route, { body: body }) as APIApplicationCommand
		command.data = d;
		console.log("Updated command", command.builderData.name)
	}

	private async deleteCommand(command: APIApplicationCommand, devGuild: string | null = null) {
		const route = devGuild == null ? Routes.applicationCommand(this.clientId, command.id) : Routes.applicationGuildCommand(this.clientId, devGuild, command.id)
		await this.rest.delete(route) as APIApplicationCommand
		console.log("Deleted command", command.name)
	}
}