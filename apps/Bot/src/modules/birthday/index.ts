import { PrismaClient } from '@repo/db';
import { Module } from '../../Module';
import { BirthdayCommand } from './commands/BirthdayCommand';
import schedule from 'node-schedule'
import { TextChannel } from 'discord.js';

const day = 1000 * 60 * 60 * 24

export class BirthdayModule extends Module {
	private readonly db: PrismaClient;
	private readonly messageIntervals = [ day * 2, day * 3, day * 7, day * 14, day * 28 ]

	constructor(db: PrismaClient) {
		super();
		this.db = db;
	}

	public async init() {
		this.addCommand(new BirthdayCommand(this.db))
	}

	public async ready() {
		schedule.scheduleJob("0 12 * * *", () => this.checkBirthdays())
	}

	private async checkBirthdays() {
		const birthdays = await this.db.birthday.findMany()
		const date = new Date()
		const now = new Date(date.getFullYear(), date.getMonth(), date.getDate())

		const channel = await this.client.channels.fetch("1303992247544582151")
		if ((channel instanceof TextChannel) == false) {
			throw new Error("Channel is not a text channel")
		}
		
		for (const birthday of birthdays) {
			const date = new Date(birthday.date.getFullYear(), birthday.date.getMonth(), birthday.date.getDate())
			const difference = now.getTime() - date.getTime()

			if (difference <= 0) {
				await channel.send(`🧀🧀🧀 Het is de kaasdag van <@${birthday.id}>! 🧀🧀🧀`)
				continue
			}

			const user = (await this.client.users.fetch(birthday.id))?.toString() ?? `<@${birthday.id}>`

			if (difference <= day) {
				await channel.send(`🧀 Het is morgen de kaasdag van ${user}! 🧀`)
				continue
			}
			
			for (const interval of this.messageIntervals) {
				if (difference <= interval) {
					let dayMsg: number | string = interval / day
					if (dayMsg == 7) { dayMsg = "een week" }
					else if (dayMsg == 14) { dayMsg = "twee weken" }
					else if (dayMsg == 28) { dayMsg = "vier werekn" }

					await channel.send(`🧀 Het is over ${dayMsg} de kaasdag van ${user}! 🧀`)
					break
				}
			}
		}
	}
}