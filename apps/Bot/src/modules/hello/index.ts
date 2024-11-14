import { Module } from '../../Module';
import { HelloCommand } from './commands/HelloCommand';

export class HelloModule extends Module {
	public async init() {
		this.addCommand(new HelloCommand())
	}

	public async ready() {

	}
}