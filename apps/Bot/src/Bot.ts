import { Module } from './Module';
import { Client } from "discord.js";

export class Bot {
	private modules = new Array<Module>();
	client: Client;

	constructor(token: String, db: ) {
	}
	
	public addModule(module: Module) {
		module.bot = this;
		this.modules.push(module);
	}
}