const errorMiddleware = (err,req,res,next)=>{
    const statusCode = err.status || 500;
    const message = err.message || "Internal server error";
    const extraDetails = err.extraDetails || "Errr from Backend";
    res.status(statusCode).json({
        status:statusCode,
        message:message,
        extraDetails:extraDetails
    })
}

module.exports = errorMiddleware;