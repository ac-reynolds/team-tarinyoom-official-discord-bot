var request = require('request');
const secrets = require('./secretManager')

function updateVector(id, jsonArray, guildId){
    return request({
        url: "https://hackathon-s1-95bcf95.svc.us-west1-gcp.pinecone.io/vectors/update",
        method: "POST",
        headers: {
            'Api-Key': secrets.getPineconeToken(),
            'Content-Type': 'application/json'
        },
        json: true,   
        body:  {
            "id": id,
            "values": jsonArray,
            "namespace": guildId
        }
    }, function (error, response, body){
        console.log(response);
    });
}
