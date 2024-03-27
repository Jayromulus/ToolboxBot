// initialize environment variables
require('dotenv').config();
// bring in fs and path for importing and referencing individual command files
const fs = require('node:fs');
const path = require('node:path');
// import the required properties from discord.js
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const token = process.env.TOKEN;

// instantiate a new client giving it certain intents, originally Guilds but trying to limit permissions
const client = new Client({ intents: [GatewayIntentBits.GuildMessages] });

// only runs once when the clientready event is fired, and logs a message in the console signaling the app is ready
client.once(Events.ClientReady, current => {
	console.log(`Ready! Logged in as ${current.user.tag}`);
	client.user.setActivity('/embed to share a tweet');
});

// create a new collection of commands the bot will know
client.commands = new Collection();

// grab the local commands folder and only get javascript files from it
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// loop over the files and add a command to the collection if it has the required information attached
for (const file of commandFiles) {
	const filePath = path.join(__dirname, 'commands/', file);
	const command = require(filePath);

	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command)
	} else {
		console.warn(`[WARNING]: the command at ${filePath} is missing a required "data" or "execute" property`);
	}
};

// every time an interaction is created run this chunk
client.on(Events.InteractionCreate, async interaction => {
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} found`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch(error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command', ephemeral: true });
	}
});

// log in to discord with the token
client.login(token);
