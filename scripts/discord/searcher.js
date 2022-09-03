const cohere = require('../cohereClient');
const pinecone = require('../podManager');

async function search(query, guildId, numResults) {
	const embedding = await cohere.getEmbedding(query);
	//const results = await pinecone.search(embedding, guildId, numResults);
	return [ // hardcoded values for now
		{
			"channelId": "861796985362055173",
			"messageId": "864998871976509461"
		},
		{
			"channelId": "891085535270027315",
			"messageId": "891850982407938088"
		}
	];
}

module.exports = { search }
