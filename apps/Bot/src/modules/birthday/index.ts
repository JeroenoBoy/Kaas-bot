import { Module } from '../../Module';
import { BirthdayCommand } from './commands/BirthdayCommand';

export class BirthdayModule extends Module {
	public async init() {
		this.addCommand(new BirthdayCommand())
	}

	public async ready() {

	}
}