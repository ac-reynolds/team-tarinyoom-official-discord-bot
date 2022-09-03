const cohereClient = require('./cohereClient');
const podManager = require('./podManager');
const test_namespace = "test";

async function runCohereTest(){

	function verifyEmbeddingFormat(embedding) {
		try {
			if (embedding.length != 4096) {
				console.error(`Expected embeddings of length 4096, but found an embedding of length ${embedding.length}.`);
				return false;
			}
		} catch (error) {
			console.error(`Error reading embeddings: ${error}`);

			return false;
		}

		return true;
	}

	function verifyEmbeddingsFormat(embeddings) {
		try {
			embeddings.forEach(e => {
				verifyEmbeddingFormat(e);
			})
		} catch (error) {
			console.error(`Error reading embeddings: ${error}`);

			return false;
		}
	
		return true;
	}

	const soloResponse = await cohereClient.getEmbedding("single test message");
	if (!verifyEmbeddingFormat(soloResponse)) {
		console.log("Single embedding test failed.");
	}
	const multiResponse = await cohereClient.getEmbeddings(["test message 1", "another test message"]);
	if (!verifyEmbeddingsFormat(multiResponse)) {
		console.log("Multi embedding test failed.");
	}
}

async function runPodTest(){
//id - discord messageId
//values - cohere embed array data
//namespace - discord guildId


	//update using cohere
	const vals = await cohereClient.getEmbedding("this is a test");
	//podManager.updateVector("message 1", vals, test_namespace);
}

async function runTests() {
	const testResults = await Promise.all([runCohereTest(), runPodTest()]);
	return testResults.reduce(
		(agg, v) => agg && v, true
	);
}

module.exports = { runTests };
