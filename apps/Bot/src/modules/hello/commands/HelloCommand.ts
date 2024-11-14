import { ApplicationCommandData, CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command } from '../../../commands/Command';
import { CommandData } from '../../../commands/CommandHandler';

export class HelloCommand extends Command {
	protected commandData(): CommandData {
		return new SlashCommandBuilder()
			.setName("hello")
			.setDescription("Send a ping")
			.toJSON()
	}
	
	public async execute(interaction: CommandInteraction) {
		await interaction.reply("Hooi " + interaction.member?.toString() + " 🧀");
	}
}