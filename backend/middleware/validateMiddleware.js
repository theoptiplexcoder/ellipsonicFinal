const validate = (schema) => async(req,res,next) =>{
    try{
       const parseBody = await schema.parseAsync(req.body); 
       req.body = parseBody;
       next();
    }
    catch(err){
        res.status(400).json({message:err});
        console.log(err.errors[0].message);
        next(err);
    }
}

module.exports = validate;