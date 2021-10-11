

const handleImage=(req,res,db)=>{
    const {id,type, data} = req.body;
    const {prepareImageResponse} =require('../HelpFunctions/image_req')
    prepareImageResponse(db,id,type, data,res)
}

module.exports={handleImage}