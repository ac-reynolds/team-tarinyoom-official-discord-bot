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


async function sleuthChannel(client, guildId, channel) {
	console.log(`Sleuthing ${channel.name}...`);
	const channelMessages = await channel.messages.fetch({ 
		limit: 10,
		cache: false, 
	});
	let ctr = 0;
	let msgArray = [];
	for (m of channelMessages) {
		console.log(`sleuthing ${ctr}`);
		ctr++;
		let embedding = await cohere.getEmbedding(m[1].content);
		msgArray.push({
			"id": m[0],
			"embedding": embedding
		});
	}
	//pinecone.recordMessages(guildId, channel.id, msgArray); //throwing exception
}

async function initiateSleuthing(client, guildId, callbackSuccess) {
	//console.log(`Sleuthing ${client.guilds.cache.get(guildId).name}...`);

	const channelManager = client.guilds.cache.get(guildId).channels;
	const sleuthing = Array.from(channelManager.cache.values())
						   .filter(channel => channel.type == 0)
						   .map(async channel => await sleuthChannel(client, guildId, channel));

	// TODO: wait for sleuthing array to finish, then call callback
	
	return false;
}

/**
 * 
 * @param {string} msg 
 */
async function record(msg) {

	const embedding = await cohere.getEmbedding(msg.content); 

	pinecone.recordMessages(msg.guildId,
							msg.channelId,
							[{
								"id": msg.id,
								"embedding": embedding 
							}]);
}

module.exports = { initiateSleuthing, record };
