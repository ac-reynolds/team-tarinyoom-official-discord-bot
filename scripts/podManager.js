var request = require('request');
const secrets = require('./secretManager')

//jsonObject properties
//id - discord messageId
//values - cohere embed array data
//namespace - discord guildId
function updateVector(messageId, values, namespace){
    var jsonObject = {
        "id" : messageId,
        "values" : values,
        "namespace" : namespace
    }
    return callAPI("vectors/update", jsonObject);
}

function upsertVectors(jsonObjects){
    return callAPI("vectors/upsert", jsonObjects);
}

function deleteVectors(ids, namespace){
    var jsonObject = {
        "id" : ids,
        "deleteAll" : false,
        "namespace" : namespace
    }
    return callAPI("vectors/delete", jsonObject);
}

function deleteAllVectors(namespace){
    var jsonObject = {
        "id" : [],
        "deleteAll" : true,
        "namespace" : namespace
    }
    return callAPI("vectors/delete", jsonObject);
}

function callAPI(urlPoint, jsonObject) {
    return request({
        url: "https://hackathon-s1-95bcf95.svc.us-west1-gcp.pinecone.io/"+urlPoint,
        method: "POST",
        headers: {
            'Api-Key': secrets.getPineconeToken(),
            'Content-Type': 'application/json'
        },
        json: true,   
        body: jsonObject
    }, function (error, response, body){
        console.log(response);
    });
}

module.exports = { updateVector, upsertVectors, deleteVectors, deleteAllVectors };
