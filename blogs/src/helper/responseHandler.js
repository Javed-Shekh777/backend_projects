const responseHandler = (res, data = "",message="" )=>{

    res.status(200).json({
        success:true,
        data:data,
        message:message
    });

}

module.exports = responseHandler;