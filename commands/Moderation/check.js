const { Command, util } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			permLevel: 6,
			runIn: ['text'],
			requiredSettings: ['minAccAge'],

			description: 'Checks the guild for any user accounts younger than the minimum account age.'
		});
	}

	async run(msg) {
		const accAge = msg.guild.configs.minAccAge;
		const mtime = msg.createdTimestamp;

		const users = [];
		for (const member of msg.guild.members.values()) {
			if ((mtime - member.user.createdTimestamp) >= accAge) continue;
			users.push(`${member.user.tag}, Created:${((mtime - member.user.createdTimestamp) / 1000 / 60).toFixed(0)} min(s) ago`);
		}

		return msg.send(users.length > 0 ?
			`The following users are less than the Minimum Account Age:${util.codeBlock('', users.join('\n'))}` :
			'No users less than Minimum Account Age were found in this server.');
	}

	async init() {
		if (!this.client.gateways.guilds.schema.hasKey('minAccAge')) {
			await this.client.gateways.guilds.schema.addKey('minAccAge', { type: 'integer', default: 1800000 });
		}
	}

};
