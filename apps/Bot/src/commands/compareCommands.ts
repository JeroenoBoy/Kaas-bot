import { APIApplicationCommand, RESTPostAPIChatInputApplicationCommandsJSONBody, SlashCommandBuilder } from 'discord.js';

export function commandMatches(cmd: RESTPostAPIChatInputApplicationCommandsJSONBody, data: APIApplicationCommand): boolean {

	if (cmd.type != data.type) { return false; }
	if (cmd.description != data.description) { return false; }
	if ((cmd.options?.length ?? 0) != 0) { throw new Error("Opptions are not yet supported") }
	if ((cmd.default_member_permissions ?? null) != (data.default_member_permissions ?? null)) { return false; }
	if ((cmd.nsfw ?? false) != (data.nsfw ?? false)) { return false }
	if ((cmd.integration_types?.length ?? 0) != (data.integration_types?.length ?? 0)) { return false }
	if ((cmd.handler ?? null) != (data.handler ?? null)) { return false }
	if ((cmd.contexts?.length ?? 0) != (data.contexts?.length ?? 0)) { return false }

	return true;
}