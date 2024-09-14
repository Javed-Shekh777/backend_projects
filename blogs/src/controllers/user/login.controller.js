const errorHandler = require("../../helper/errorHandler");
const responseHandler = require("../../helper/responseHandler");
const User = require("../../models/user.model");
const bcrypt = require("bcryptjs");


 

const login = async (req, res) => {
    // We identify user by email and password
    const { email, password } = req.body;

    try {
        // 1. If all fields are not filled return 
        if (!email || !password) {
            return errorHandler(res, 404, "Please fill all fields");
        }

        
        // 2. Check that user exist or not 

        const userExist = await User.findOne({ email });

        if (!userExist) {
            return errorHandler(res, 401, "User not exist");
        }
       

        // 3. If user exist then check password 

        const isPasswordCorrect = await userExist.isPasswordCorrect(password);
        

        if (!isPasswordCorrect) {
            return errorHandler(res, 401, "Email or Password is wrong");;
        }

         

        // 4. If user exist and password is correct then generate a token 
        const token = userExist.generateToken();

        if (!token) {
            return errorHandler(res, 404, "Token not generated");
        }

        

        // 5. Setting token/cookie into header.
        const options = {
            httpOnly: true,
            secure: true
        }

        res.cookie("token",token,options);
        // 6. After all send the userdata with generated token as a response 
        return responseHandler(res, { userExist, token },"User Login Successfully!!");
        



    } catch (error) {
        return errorHandler(res, 500, error.message);

    }
}

module.exports = login;