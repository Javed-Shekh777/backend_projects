class ApiResponse{
    constructor(statusCode, data , message = "Succsss"){
        this.statusCode  = statusCode;
        this.data = data;
        this.message = message;
        this.successs = statusCode < 400;
    }
}


module.exports = ApiResponse;