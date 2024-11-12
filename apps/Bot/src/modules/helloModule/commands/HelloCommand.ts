import { ApplicationCommandData, CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command } from '../../../commands/Command';

export class HelloCommand extends Command {
	protected commandData(): SlashCommandBuilder {
		return new SlashCommandBuilder()
			.setName("hello")
			.setDescription("Send a ping")
	}
	
	public async execute(interaction: CommandInteraction) {
		await interaction.reply("Hooi " + interaction.member?.toString() + " 🧀");
	}
}