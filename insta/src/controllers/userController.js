const asyncHandler = require("../utils/AsyncHandler.js");
const ApiError = require("../utils/ApiError.js");
const ApiResponse = require("../utils/ApiResponse.js");
const User = require("../models/userModel.js");
const sendEmail = require("../helper/mail.js");
const { forgotPasswordHtml, emailVerificationHTML } = require("../helper/emailHTML.js");
const generateAccessAndRefreshToken = require("../helper/generateTokoens.js");
const adminPermission = require("../middlewares/adminPermisson.js");
const generateUsername = require("../helper/generateUsername.js");
const JWT = require("jsonwebtoken");
const { uploadCloudinary } = require("../utils/cloudinary.js");
const { deleteCloudinary } = require("../utils/cloudinary.js");
const { avatarFolderName } = require("../constants.js");




const userRegister = asyncHandler(async (req, res) => {

    const { username, name, email, password, mobile_number = "", dob } = req.body;

    if (!username || !email || !password || !name || !dob) {
        throw new ApiError(400, "All fields are required");
    }

    const exitingUser = await User.findOneAndUpdate({
        $or: [{ username, email }],
    }, { $set: { is_verified: false } });



    if (exitingUser) {
        throw new ApiError(409, "User already exist");
    }


    const isExistUserByUsername = await User.findOne({ username });



    if (isExistUserByUsername) {
        throw new ApiError(409, "Username already exist");
    }

    const isExistUserByEmail = await User.findOne({ email });


    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();


    if (isExistUserByEmail) {
        if (isExistUserByEmail.is_verified) {
            return res.status(201)
                .json(new ApiResponse(200, isExistUserByEmail, "User already registered with this email"));
        } else {

            isExistUserByEmail.verify_code = verificationCode;
            isExistUserByEmail.verify_code_expiry = new Date(Date.now() + 3600000);

            const userSave = await isExistUserByEmail.save();
            const createdUser = await User.findById(userSave._id).select("-password -refresh_token");

            const HTML = emailVerificationHTML(createdUser.email, verificationCode);


            const emailResponse = await sendEmail(createdUser.email, "Verification of Email", HTML);

            if (!emailResponse) {
                console.log("email not send \n ", emailResponse);
            }

            return res.status(201).json(new ApiResponse(200, createdUser, "User already registered , Please verify your account."));
        }
    } else {

        let user = new User({
            name,
            username,
            email,
            password,
            verify_code: verificationCode,
            date_joined: Date.now(),
            mobile_number: mobile_number,
            dob: dob,
            verify_code_expiry: new Date(Date.now() + 360000),
        });

        user = await user.save();

        const newUser = await User.findById(user._id).select("-password -refresh_token");

        if (!newUser) {
            throw new ApiError(500, "Something went wrong while registering");
        }

        const HTML = emailVerificationHTML(newUser.username, verificationCode);

        const emailResponse = await sendEmail(newUser.email, "Verification of Email", HTML);

        if (!emailResponse) {
            console.log("email not send \n ", emailResponse);
        }


        return res.status(201).json(new ApiResponse(200,{}, "User registered successfully. Please verify your account."));
    }

});




const userLogin = asyncHandler(async (req, res) => {

    const { parameter, password, device_info = "" } = req.body;

    if (!parameter || !password) {
        throw new ApiError(400, "All fields are required");
    }

    const userExist = await User.findOne({
        $or: [{ username: parameter }, { email: parameter }],
    });


    if (!userExist) {
        throw new ApiError(409, "User does not exist");
    }


    if (!userExist) {
        throw new ApiError(409, "Account doen't exist.");
    }

    const isPasswordCorrect = await userExist.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
        throw new ApiError(409, "Username or password is wrong!!");
    }

    const isVerifiedAccount = userExist.is_verified;

    if (!isVerifiedAccount) {
        throw new ApiError(409, "Please verify your account , then login");
    }


    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(userExist._id);

    const loggedUser = await User.findByIdAndUpdate({ _id: userExist._id }, {
        $set: {
            last_login: Date.now(),
            device_info: device_info,
        }
    }, { new: true }).select("-password -refreshtoken -access_token -verify_code_expiry -verify_code");

    const options = {
        httpOnly: true,
        secure: true
    }


    return res.status(201)
        .cookie("refreshToken", refreshToken, options)
        .cookie("accessToken", accessToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    accessToken, refreshToken, user: loggedUser
                },
                "User login Successfully"
            ));
});




const verifyEmail = asyncHandler(async (req, res) => {

    const { code, parameter } = req.body;

    if (!code || !parameter) {
        throw new ApiError(400, "All fields are required.");
    }

    const accountExist = await User.findOne({
        $or: [{ username: parameter }, { email: parameter }]
    });



    if (!accountExist) {
        throw new ApiError(res, 409, "User does not exist");
    }



    if (accountExist.verify_code_expiry && accountExist.verify_code_expiry < new Date) {
        throw new ApiError(409, "The time has been expired.");
    }


    if (accountExist.verify_code == code) {
        accountExist.verify_code = "";
        accountExist.verify_code_expiry = "";
        accountExist.is_verified = true;
        await accountExist.save();



        return res.status(201).json(new ApiResponse(200, "", "Account verified successfully."));
    } else {
        throw new ApiError(409, "Verification code is Invalid.");
    }
});




const checkUsername = asyncHandler(async (req, res) => {

    const { username } = req.query;

    console.log(username);

    const newUsername = await generateUsername(username);

    if (username !== newUsername) {
        return res.status(201)
            .json(new ApiResponse(200, { username: newUsername }, "Username is available."));
    } else {
        return res.status(201)
            .json(new ApiResponse(200, "", "Username is available."));
    }

});



const forgotPassword = asyncHandler(async (req, res) => {
    const { parameter } = req.body;

    if (!parameter) {
        throw new ApiError(409, "Please fill a value.");
    }

    const user = await User.findOne({
        $or: [{ username: parameter }, { email: parameter }]
    });

    if (!user) {
        throw new ApiError(409, "Account doesn't exist.");
    }



    const token = await JWT.sign({
        username: user.username,
        email: user.email,
        mobileNumber: user.mobile_number
    },
        process.env.RESET_PASSWORD_TOKEN,
        {
            expiresIn: "1h"
        }
    )


    const HTML = forgotPasswordHtml(user.username, token);

    const emailResponse = await sendEmail(user.email, "Forgot Password", HTML);

    if (!emailResponse) {
        console.log("email not send \n ", emailResponse);
    }

    user.verify_code = token;
    user.verify_code_expiry = new Date(Date.now() + 3600000);
    await user.save();

    return res.status(200).json(new ApiResponse(200, {}, `We sent an email to ${user.email} with a link to get back to your account.`));

});



const resetPassword = asyncHandler(async (req, res) => {

    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        throw new ApiError(409, "All fields are required.");
    }

    const decodedToken = await JWT.verify(token, process.env.RESET_PASSWORD_TOKEN);

    if (!decodedToken) {
        throw new ApiError(409, "Something went wrong.");
    }

    const user = await User.findOne({
        $or: [{ username: decodedToken?.username }, { email: decodedToken?.email }]
    });

    const newDate = new Date();
    if (user.verify_code_expiry && user.verify_code_expiry < newDate) {
        throw new ApiError(409, "Time has been expired.");
    }

    user.verify_code = "";
    user.verify_code_expiry = null;
    user.is_verified = true;
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res.status(201)
        .json(new
            ApiResponse(200, {}, "Password reset successfully.")
        );
});



const userLogout = asyncHandler(async (req, res) => {

    const loggedUser = req.user;

    if (!loggedUser) {
        throw new ApiError(409, "Unauthorized access.");
    }

    await User.findByIdAndUpdate({ _id: loggedUser._id }, {
        $set: {
            access_token: "",
            refresh_token: "",
        }
    }, {
        new: true
    });

    const options = {
        httpOnly: true,
        secure: true
    }


    return res.status(201)
        .clearCookie("refreshToken", options)
        .clearCookie("accessToken", options)
        .json(
            new ApiResponse(200, {}, "User logout Successfully.")
        );

});



const allUser = asyncHandler(async (req, res) => {
    
    console.log(req.user);
    const permitted = adminPermission(req.user?.is_admin);

    if (!permitted) {
        throw new ApiError(409, "Permission not allowed.");
    }

    const users = await User.find().select("-password -refresh_token -verify_code -verify_code_expiry");

    if (!users) {
        throw new ApiError(409, "Users not found.");
    }

    return res.status(201)
        .json(
            new ApiResponse(200, users, "Users found successfully.")
        );

});



const userUpdate = asyncHandler(async (req, res) => {

    const { name, bio, username, website, private_account } = req.body;

    const loggedUser = req.user;

    if (!loggedUser) {
        throw new ApiError(409, "Unauthorized request.");
    }

    if (name && bio && username && website && private_account) {
        throw new ApiError(409, "Choose any field to edit.");
    }


    const updatedUser = await User.findByIdAndUpdate({ _id: loggedUser._id }, {
        $set: {
            name: name || loggedUser?.name,
            username: username || loggedUser?.username,
            bio: bio || loggedUser?.bio,
            private_account: private_account || loggedUser.private_account,
            website: website || loggedUser._website
        }
    }, {
        new: true
    }).select("-password -verify_code -verify_code_expiry -refresh_token -access_token");


    if (!updatedUser) {
        throw new ApiError(409, "User not updated.");
    }

    return res.status(201)
        .json(
            new ApiResponse(200, updatedUser, "User updated successfully.")
        );

});



const currentUser = asyncHandler(async (req, res) => {

    const loggedUser = req.user;

    if (!loggedUser) {
        throw new ApiError(409, "Unauthorized request.");
    }

    return res.status(201).json(new ApiResponse(200, req.user, "User fetched successfully."));
});


const searchUser = asyncHandler(async (req, res) => {

    console.log(req.query);
    const search = req.query?.search || "";

    const query = {
        $or: [
            {
                username: {
                    $regex: search,
                    $options: "i"
                }
            },
        ]
    }

    const users = await User.find(query).select("-password -refreshtoken -access_token -verify_code_expiry -verify_code").limit(10);

    if (!users) {
        throw new ApiError(409, "Users not found this name");
    }

    return res.status(201)
        .json(new ApiResponse(200, users, "Users fetched successfully."));

});


const refreshToken = asyncHandler(async (req, res) => {


    const token =
        req.cookies?.refreshToken ||
        req.header("Authorization")?.replace("Bearer ", "") || req.body.refreshToken;


    if (!token) {
        throw new ApiError(409, "Unauthorized request.");
    }

    try {

        const decodedToken = JWT.verify(
            token,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken?._id).select("-password ");

        if (!user) {
            throw new ApiError(409, "Invalid refresh token.");
        }

        if (token !== user.refresh_token) {
            throw new ApiError(409, "Refresh token expired or used");
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
        user.access_token = accessToken;
        user.refresh_token = refreshToken;
        await user.save();

        return res.status(201)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(200,
                    { user: user, accessToken, refreshToken },
                    "Accesstoken refreshed successfully."
                )
            );

    } catch (error) {

        throw new ApiError(500, error.message || "Invalid refresh token.");
    }
});


const userFollow = asyncHandler(async (req, res) => {
    const loggedUser = req.user;
    if (!loggedUser) {
        throw new ApiError(409, "Unauthorzed request.");
    }

    const { following_id } = req.body;

    const follow = await User.findById({ _id: loggedUser._id });

    if (!follow) {
        throw new ApiError(409, "User not exist.");
    }

    if (follow.following.includes(following_id)) {
        follow.following.pull(following_id);
    } else {
        follow.following.push(following_id);
    }

    await follow.save();
    return res.status(201)
        .json(new
            ApiResponse(200, follow.following, "Followed successfully.")
        );

});


const userUnfollow = asyncHandler(async (req, res) => {
    const loggedUser = req.user;
    if (!loggedUser) {
        throw new ApiError(409, "Unauthorzed request.");
    }

    const { unfollower_id } = req.body;

    const unfollow = await User.findByIdAndUpdate({ _id: loggedUser._id }, {
        $pull: { following: unfollower_id }
    });


    if (!unfollow) {
        throw new ApiError(409, "Not Unfollowed.");
    }

    return res.status(201)
        .json(new
            ApiResponse(200, unfollow.following, "UnFollowed successfully.")
        );

});


const userFollowers = asyncHandler(async (req, res) => {
    const loggedUser = req.user;
    if (!loggedUser) {
        throw new ApiError(409, "Unauthorzed request.");
    }

    const followers = await User.findById({ _id: loggedUser._id }).populate("followers");

    if (!followers) {
        throw new ApiError(409, "Followers not fetched.");
    }

    return res.status(201)
        .json(
            new ApiResponse(200, followers, "Followers fetched successfully.")
        );

});


const userFollowing = asyncHandler(async (req, res) => {
    const loggedUser = req.user;
    if (!loggedUser) {
        throw new ApiError(409, "Unauthorzed request.");
    }

    const following = await User.findById({ _id: loggedUser._id }).populate("following");

    if (!following) {
        throw new ApiError(409, "Following not fetched.");
    }

    return res.status(201)
        .json(
            new ApiResponse(200, following, "Following fetched successfully.")
        );

});


const profilePicture = asyncHandler(async (req, res) => {

    const loggedUser = req.user;

    if (!loggedUser) {
        throw new ApiError(409, "Unauthorized request.");
    }

    const avatarLocalPath = req.file?.path;
    const file = req.file;


    
    if (!avatarLocalPath) {
        throw new ApiError(409, "Profile picture is missing.");
    }

    let newAvatar = await uploadCloudinary([avatarLocalPath], avatarFolderName);

    if (!newAvatar) {
        throw new ApiError(409, "Error occured while uploading profile picture.");
    }

    if (req.user?.profile_picture && req.user?.profile_picture?.public_id) {
        await deleteCloudinary([req.user?.profile_picture?.public_id], "image");
    }


    newAvatar = newAvatar[0];
    console.log(newAvatar);
    const user = await User.findByIdAndUpdate(
        { _id: loggedUser._id },
        {
            $set: {
                profile_picture: {
                    public_id: newAvatar.public_id,
                    url: newAvatar.secure_url // Use secure_url from Cloudinary
                }
            }
        },
        {
            new: true
        }
    ).select("-password");

    return res.status(201)
        .json(new ApiResponse(200, user, "Profile picture updated successfully."));

});



const userBlockUnblock = asyncHandler(async (req, res) => {

    const loggedUser = req.user;

    if (!loggedUser) {
        throw new ApiError(409, "Unauthorized request.");
    }


    const { userId } = req.body;

    if (!userId) {
        throw new ApiError(409, "All fields are required.");
    }

    const user = await User.findById({ _id: loggedUser._id });

    if (user.blocked_users.includes(userId)) {
        user.blocked_users.pull(userId);
    } else {
        user.blocked_users.push(userId);
    }

    await user.save();

    if (!user) {
        throw new ApiError(409, "User not blcoked or unblock.");
    }
    return res.status(201)
        .json(
            new ApiResponse(200, user, "User blocked or unblock successfully.")
        );

});




const userBlockList = asyncHandler(async (req, res) => {

    const loggedUser = req.user;

    if (!loggedUser) {
        throw new ApiError(409, "Unauthorized request.");
    }

    const blockList = await User.findById({ _id: loggedUser._id }).select("blocked_users").populate("blocked_users,username profile_picture");

    if (!blockList) {
        throw new ApiError(409, "BlockList not found.");
    }

    return res.status(201)
        .json(
            new ApiResponse(200, blockList, "Blocklist found successfully.")
        );


});



const closeUncloseFriend = asyncHandler(async (req, res) => {
    const loggedUser = req.user;

    if (!loggedUser) {
        throw new ApiError(409, "Unauthorized request.");
    }

    const { userId } = req.body;

    if (!userId) {
        throw new ApiError(409, "All fields required.");
    }

    const friend = await User.findById({ _id: loggedUser._id });

    if (friend.close_friends.includes(userId)) {
        friend.close_friends.pull(userId);
    } else {
        friend.close_friends.push(userId);
    }

    await friend.save();

    if (!friend) {
        throw new ApiError(409, "Close friend not added.");
    }

    return res.status(201)
        .json(
            new ApiResponse(200, friend, "Close frind added or removed successfully.")
        );

});



const privateAccount = asyncHandler(async (req, res) => {
    const loggedUser = req.user;

    if (!loggedUser) {
        throw new ApiError(409, "Unauthorized request.");
    }

    const user = await User.findByIdAndUpdate({ _id: loggedUser._id }, {
        $set: {
            private_account: true
        }
    }, { new: true });

    if (!user) {
        throw new ApiError(409, "Account not updated.");
    }

    return res.status(201)
        .json(
            new ApiResponse(200, user.private_account, "Acount updated successfully.")
        );


});

const userProfile = asyncHandler(async (req, res) => {


});


module.exports = { userRegister, userLogin, verifyEmail, checkUsername, forgotPassword, resetPassword, userLogout, allUser, userUpdate, currentUser, searchUser, refreshToken, userFollow, userUnfollow, userFollowing, userFollowers, profilePicture, userBlockUnblock, userBlockList, closeUncloseFriend, privateAccount, userProfile };