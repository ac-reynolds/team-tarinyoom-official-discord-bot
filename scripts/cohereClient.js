const cohere = require('cohere-ai');
const secrets = require('./secretManager');

async function getEmbedding(input) {
	const response = await getEmbeddings([input]);
	return response;
}

async function getEmbeddings(inputs) {
	cohere.init(secrets.getCohereApiKey());
	const response = await cohere.embed({
		texts: inputs
	})
	return response;
}

async function runCohereTest(){

	const testResponses = await Promise.all([
		getEmbedding("single test message"),
		getEmbeddings(["test message 1", "another test message"])
	]);

	const numSuccesses = testResponses.reduce(
		(agg, v) => verifyResponse(v) ? agg + 1 : agg, 0);
	
	console.log(`Passed ${numSuccesses}/${testResponses.length} test cases.`);

}

function verifyResponse(response) {
	switch (response.statusCode) {
		case 200:
			break;
		case 401:
			console.error(`Cohere rejected authentication. Check your cohere ai token.`);
			return false;
		default:
			console.error(`Error connecting to cohere backend.`);
			return false;
	}

	try {
		response.body.embeddings.forEach(l => {
			if (l.length != 4096) {
				console.error(`Expected embeddings of length 4096, but found an embedding of length ${l.length}.`);
				return false;
			}
		})
	} catch (error) {
		console.error(`Error reading message body: ${error}`);
		return false;
	}

	return true;
}

module.exports = { runCohereTest, getEmbedding, getEmbeddings };
