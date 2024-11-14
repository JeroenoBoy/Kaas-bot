import { SlashCommandBuilder, CommandInteraction, SlashCommandSubcommandBuilder, SlashCommandIntegerOption, SlashCommandUserOption, RESTPostAPIChatInputApplicationCommandsJSONBody, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js'
import { Command } from '../../../commands/Command'
import { PrismaClient } from '@repo/db'

export class BirthdayCommand extends Command {
	private readonly db: PrismaClient;

	constructor(db: PrismaClient) {
		super();
		this.db = db;
	}

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
			.addSubcommand(new SlashCommandSubcommandBuilder()
				.setName("list")
				.setDescription("Bekijk de geboortedagen van iedereen")
			)
			.toJSON()
	}

	public async execute(interaction: ChatInputCommandInteraction) {

		switch (interaction.options.getSubcommand(false)) {
			case "verander": {
				const dag = interaction.options.getInteger("dag", true)
				const maand = interaction.options.getInteger("maand", true)
				const jaar = interaction.options.getInteger("jaar", true)

				const date = new Date(jaar, maand - 1, dag)

				const user = await this.db.birthday.findUnique({ where: { id: interaction.user.id } })
				if (user == null) {
					await this.db.birthday.create({ data: {
						id: interaction.user.id,
						date: date
					}})
					await interaction.reply({ ephemeral: true, content: "Jouwn kaasdag is gezet naar " + this.formatDate(date) })
				} else {
					await this.db.birthday.update({ where: { id: interaction.user.id }, data: {
						date: date
					}})
					await interaction.reply({ ephemeral: true, content: "Jouwn kaasdag is veranderd naar " + this.formatDate(date) })
				}

				break;
			}
			case "bekijk": {
				const user = interaction.options.getUser("betreffende", true)

				const birthday = await this.db.birthday.findUnique({ where: { id: user.id } })
				if (birthday == null) {
					await interaction.reply({ content: user.toString() + " heeft nog geen kaasdag", ephemeral: true });
					return
				}

				await interaction.reply({ ephemeral: true, content: "Kaasdag van " + user.toString() + " is `" + this.formatDate(birthday.date) + "`"})
				break;
			}
			case "list": {
				const birthdays = await this.db.birthday.findMany()
				await interaction.reply({ephemeral: true, content: "Kaasdagen: 🧀\n"+birthdays.map(it => `- <@${it.id}> is geboren op \`${this.formatDate(it.date)}\``).join("\n")})
				break;
			}
			default:
				await interaction.reply({ content: "Dit commando is mij onbekent", ephemeral: true });
				break;
		}
	}

	private formatDate(date: Date) {
		return date.toLocaleDateString("nl-NL", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric"
		})
	}
}