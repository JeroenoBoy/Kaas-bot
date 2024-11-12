import { ApplicationCommandData, CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command } from '../../../Command';

export class HelloCommand extends Command {
	public data(): SlashCommandBuilder {
		return new SlashCommandBuilder()
			.setName("ping")
			.setDescription("Send a ping!")
	}
	
	public async execute(interaction: CommandInteraction) {
		await interaction.reply("Hi " + interaction.member?.toString());
	}
}