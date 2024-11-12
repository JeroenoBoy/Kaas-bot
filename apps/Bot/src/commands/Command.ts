import { APIApplication, APIApplicationCommand, ApplicationCommandData, CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Bot } from '../Bot';
import { Module } from '../Module';

export abstract class Command {
	//@ts-ignore
	module: Module = null
	//@ts-ignore
	data: APIApplicationCommand
	builderData: SlashCommandBuilder

	public get bot() {
		return this.module.bot
	}
	
	public get client() {
		return this.module.bot.client
	}

	constructor() {
		this.builderData = this.commandData()
		this.applyDefaults(this.builderData)
	}

	protected abstract commandData(): SlashCommandBuilder
	public abstract execute(interaction: CommandInteraction): any

	private applyDefaults(builder: SlashCommandBuilder) {
		function setIfUndefined<V, T extends keyof V>(data: V, property: T, value: V[T] | null) {
			if (data[property] == undefined) {
				// @ts-ignore
				data[property] = value
			}
		}

		setIfUndefined(builder, "default_member_permissions", null)
		setIfUndefined(builder, "contexts", null)
		setIfUndefined(builder, "nsfw", false)
	}

}