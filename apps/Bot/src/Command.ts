import { ApplicationCommandData, CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Bot } from './Bot';
import { Module } from './Module';

export abstract class Command {
	module: Module

	public get bot() {
		return this.module.bot
	}
	
	public get client() {
		return this.module.bot.client
	}

	public abstract data(): SlashCommandBuilder
	public abstract execute(interaction: CommandInteraction): any
}