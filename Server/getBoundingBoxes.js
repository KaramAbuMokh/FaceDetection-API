function boundface(boundingBox){
    
    return bounds = {
      leftcol: Number(boundingBox.left_col)  ,
      toprow: Number(boundingBox.top_row),
      bottomrow: Number(boundingBox.bottom_row) ,
      rightcol: Number(boundingBox.right_col) ,
    };

  };

function addToScore(user,url,type,faceBox){
 
  user.score++
  user.history.push({
    type:type,
    data: url,
    faceBox
  })
  return user 
}

function getFaceBox(regs){
  let faceBox=[]
  regs.forEach(box => {
    if(box.value>0.9){
        faceBox.push(boundface(box.region_info.bounding_box))
    }
  });
  return faceBox
}

module.exports = { getFaceBox ,addToScore};