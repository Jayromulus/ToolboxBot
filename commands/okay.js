const { SlashCommandBuilder } = require('discord.js');
const { format } = require('../helpers'); 

module.exports = {
	data: new SlashCommandBuilder()
		.setName('okay')
		.setDescription('Okay! Okay!'),
	async execute(interaction) {
		await interaction.reply('https://www.youtube.com/shorts/zEM6XdrWEMw');
	}
};
