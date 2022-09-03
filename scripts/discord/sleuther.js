const cohere = require('../cohereClient');
const pinecone = require('../podManager');

/*
const sleuthingStatus = {
	guilds: {
		guildId: {
			sleuthingActive: true,
			channels: {
				channelId: {
					//sleuthingActive: true,
					earliestMessage: id,
					finished: false
				}
			}

		}
}};
*/

async function sleuthChannel(client, channel) {
	console.log(`Sleuthing ${channel.name}...`);
	const channelMessages = await channel.messages.fetch({ // this is causing some errors
		limit: 1
	});

	for (m of channelMessages) {
		console.log(m);
	}
}

async function initiateSleuthing(client, guildId, callbackSuccess) {

	console.log(`Sleuthing ${client.guilds.cache.get(guildId).name}...`);

	const channelManager = client.guilds.cache.get(guildId).channels;
	const sleuthing = Array.from(channelManager.cache.values())
						   .filter(channel => channel.isTextBased()) // i don't think this is the correct filter
						   .map(async channel => await sleuthChannel(client, channel));

	// TODO: wait for sleuthing array to finish, then call callback
	
	return false;
}

module.exports = { initiateSleuthing };
