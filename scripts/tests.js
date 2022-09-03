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
	const testVectors = await cohereClient.getEmbeddings(["the loch ness monster","eating grapes on friday", "having fun in the sun"]);
	const searchVector = await cohereClient.getEmbedding("testing is fun!");
	const obj = { 
		"vectors": 
		[{
			"id": "testmessage1",
			"values": testVectors[0]
		},
		{
			"id": "testmessage2",
			"values": testVectors[1]
		},
		{
			"id": "testmessage3",
			"values": testVectors[2]
		}],
		"namespace": test_namespace};	
	let task = await podManager.upsertVectors(obj);
	let task2 = await podManager.search(searchVector,test_namespace);
	console.log(`Search results id-${task2[0].id} score-${task2[0].score}, id-${task2[1].id} score-${task2[1].score}, id-${task2[2].id} score-${task2[2].score}`);
	let task3 = await podManager.deleteVectors(["testmessage1","testmessage2","testmessage3"],test_namespace);
}

async function runTests() {
	const testResults = await Promise.all([runCohereTest(), runPodTest()]);
	return testResults.reduce(
		(agg, v) => agg && v, true
	);
}

module.exports = { runTests };
