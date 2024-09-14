const errorHandler = (res, statusCode,message)=>{

    res.status(statusCode || 500).json({
        success:false,
        message:message || "Internal Server error"
    });

}

module.exports = errorHandler;