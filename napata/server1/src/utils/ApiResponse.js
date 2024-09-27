class ApiRespons {
    constructor(statusCode,data,message="Success",){
        this.message = message;
        this.data = data;
        this.statusCode = statusCode;
        this.success = statusCode < 400;
    }
}

module.exports = ApiRespons;