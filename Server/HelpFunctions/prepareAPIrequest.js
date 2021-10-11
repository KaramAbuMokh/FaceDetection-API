
// 'data:image/jpeg;base64,'+
function getRequestOptions(url,type){
  let data= type==='file' ? {base64:url} : {url: url}
  return {
    model_id: "d02b4508df58432fbb84e800597b8959",
    inputs: [
        {data: {image: data}}
    ],
  }
}

module.exports = { getRequestOptions };