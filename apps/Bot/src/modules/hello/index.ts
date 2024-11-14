import { Module } from '../../Module.js';
import { HelloCommand } from './commands/HelloCommand.js';

export class HelloModule extends Module {
	public async init() {
		this.addCommand(new HelloCommand())
	}

	public async ready() {

	}
}