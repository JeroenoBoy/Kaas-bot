import { SlashCommandBuilder, CommandInteraction, SlashCommandSubcommandBuilder, SlashCommandIntegerOption, SlashCommandUserOption, RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord.js';
import { Command } from '../../../commands/Command';

export class BirthdayCommand extends Command {
	protected commandData(): RESTPostAPIChatInputApplicationCommandsJSONBody {
		return new SlashCommandBuilder()
			.setName("kaasdag")
			.setDescription("Verander je kaasdag (geboortedag) of bekijk die van een ander")
			.addSubcommand(new SlashCommandSubcommandBuilder()
				.setName("verander")
				.setDescription("Verander je kaasdag")
				.addIntegerOption(new SlashCommandIntegerOption()
					.setDescription("De dag waarop jij geboren bent")
					.setName("dag")
					.setMaxValue(1)
					.setMaxValue(31)
				)
				.addIntegerOption(new SlashCommandIntegerOption()
					.setName("maand")
					.setDescription("De maand waarin jij geboren bent")
					.setMinValue(1)
					.setMaxValue(12)
				)
				.addIntegerOption(new SlashCommandIntegerOption()
					.setName("jaar")
					.setDescription("Het jaar waarin jij geboren bent")
				)
			)
			.addSubcommand(new SlashCommandSubcommandBuilder()
				.setName("bekijk")
				.setDescription("Bekijk de geboorte dag van iemand")
				.addUserOption(new SlashCommandUserOption()
					.setName("betreffende")
					.setDescription("De desbetreffende persoon")
				)
			)
			.toJSON()
	}

	public execute(interaction: CommandInteraction) {
	}

}