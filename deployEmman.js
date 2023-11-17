require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('node:fs');

const commands = [];
commands.push(require('../commands/embed.js').data.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
	try {
		console.log('refreshing command');

		await rest.put(Routes.applicationGuildCommands(process.env.CLIENT, process.env.EMMN), { body: [] })
			.then(() => console.log('deleted all guild commands'))
			.catch(console.error);

		const data = await rest.put(Routes.applicationGuildCommands(process.env.CLIENT, process.env.EMMN), { body: commands });

		console.log(`updated ${data.length} commands`);
	} catch (e) {
		console.error(e);
	}
})();
