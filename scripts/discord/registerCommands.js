const { SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');

const commands = [
	new SlashCommandBuilder().setName('tsleuth').setDescription('Starts sleuthing through the server. This could take a while...'),
	new SlashCommandBuilder().setName('tsearch').setDescription('Searches for the given string using approximate semantic search.')
		.addStringOption(option => 
			option
			.setName('target')
			.setDescription('The target to search for!')
			.setRequired(true))
		.addIntegerOption(option =>
			option
			.setName('n')
			.setDescription('The number of results to return.')
			.setRequired(false)),
	new SlashCommandBuilder().setName('tsleuthnt').setDescription('Pauses sleuthing progress.'),
	new SlashCommandBuilder().setName('tstats').setDescription('Get sleuthing stats.')
].map(command => command.toJSON());

/**
 * Registers the appropriate command according to the passed parameters.
 * @param {{botToken, clientId}} config 
 */
function register(config) {
	
	const rest = new REST({ version: '10' }).setToken(config.botToken);
	const route = Routes.applicationCommands(config.clientId);
	
	rest.put(route, { body: commands })
		.then(() => console.log('Successfully registered application commands.'))
		.catch(console.error);
};

module.exports = { register };
