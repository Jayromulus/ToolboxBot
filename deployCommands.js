require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('node:fs');

const commands = [];
const commandFiles = fs.readdirSync('../commands');

for (const file of commandFiles) {
	const command = require(`../commands/${file}`);
	commands.push(command.data.toJSON());
};

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
	try {
		console.log(`Started updating ${commands.length} application commands...`);
	
		await rest.put(Routes.applicationGuildCommands(process.env.CLIENT, process.env.GUILD), { body: [] })
			.then(() => console.log('Successfully deleted all guild commands'))
			.catch(console.error);
	
		const data = await rest.put(Routes.applicationGuildCommands(process.env.CLIENT, process.env.GUILD), { body: commands });
		
		console.log(`Successfully updated ${data.length} guild commands`);
	} catch (error) {
		console.error(error)
	}
})();
