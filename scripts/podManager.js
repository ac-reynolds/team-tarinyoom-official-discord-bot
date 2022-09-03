var request = require('request');
const secrets = require('./secretManager')

//jsonObject properties
//id - discord messageId
//values - cohere embed array data
//namespace - discord guildId
function updateVector(jsonObject){
    return request({
        url: "https://hackathon-s1-95bcf95.svc.us-west1-gcp.pinecone.io/vectors/update",
        method: "POST",
        headers: {
            'Api-Key': secrets.getPineconeToken(),
            'Content-Type': 'application/json'
        },
        json: true,   
        body:  jsonObject
    }, function (error, response, body){
        console.log(response);
    });
}


function upsertVectors(jsonObjects){
    return request({
        url: "https://hackathon-s1-95bcf95.svc.us-west1-gcp.pinecone.io/vectors/upsert",
        method: "POST",
        headers: {
            'Api-Key': secrets.getPineconeToken(),
            'Content-Type': 'application/json'
        },
        json: true,   
        body:  jsonObjects
    }, function (error, response, body){
        console.log(response);
    });
}



module.exports = { updateVector, upsertVectors };
