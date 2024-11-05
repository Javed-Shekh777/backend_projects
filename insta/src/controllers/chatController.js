const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const Chat = require("../models/chatModel");


const asyncHandler = require("../utils/AsyncHandler");
const { sendNotification } = require("../helper/NotificationHandler");

const createChat = asyncHandler(async (req, res) => {

    const loggedUser = req.user;

    if (!loggedUser) {
        throw new ApiError(409, "Unauthorized request.");
    }
    const { userIds } = req.body;

    if (!userIds.length) {
        throw new ApiError(403, "Please connect to someone.");
    }

    const newChat = await Chat.create({
        participants: [userIds],
    });

    const createdChat = await Chat.findById({ _id: newChat._id });

    if (!createdChat) {
        throw new ApiError(403, "Chat Room not created.");
    }

    return res.status(201)
        .json(new
            ApiResponse(200, createdChat._id, "Char room created successfully.")
        );
});



const deleteChat = asyncHandler(async (req, res) => {

    const loggedUser = req.user;

    if (!loggedUser) {
        throw new ApiError(409, "Unauthorized request.");
    }


    const { chatId } = req.body;

    if (!chatId) {
        throw new ApiError(403, "Please select any chat.");
    }

    const deletedRoom = await Chat.findByIdAndDelete({ _id: chatId });

    if (!deletedRoom) {
        throw new ApiError(403, "Chat not deleted");
    }

    return res.status(201)
        .json(
            new ApiResponse(200, {}, "Chat deleted successfully")
        );

});



const deleteMessage = asyncHandler (async ( req,res)=>{

    let {chatId,message} = req.body;

    if(!chatId || !message){
        throw new ApiError(403,"All fields are required");
    }


    const result = await chatModel.updateOne(
        { _id: chatId },
        { $pull: { messages: { message_text: message } } }
    );

    if (!result.modifiedCount > 0) {
        throw new ApiError(403,"Message not found or already deleted");
    }

    return res.status(201)
    .json(
        new ApiResponse(200,{},"Message deleted successfully")
    );

});



const handleSocketChatEvents = (socket, io) => {

    socket.on("joinChat",async ({ chatId, userId ,senderId}) => {
        try {
            if (!chatId || !userId || !senderId) {
                throw new ApiError(403, "All fields are essential.");
            }

            const chat = await Chat.findById({_id:chatId});
            chat.last_seen.push({ user_id: userId, last_seen_at: Date.now() });
            await chat.save();

            socket.join(chatId);
            console.log(`${userId} join this room : ${chatId}`);
        
        socket.to(chatId).emit('userJoined', { userId, chatId });
        } catch (error) {
            throw new ApiError(500, error.message);
        }
    });


    socket.on("startTyping", ({ chatId }) => {
        socket.to(chatId).emit('startTyping');
    });


    socket.on("stopTyping", ({ chatId }) => {
        socket.to(chatId).emit("stopTyping");
    });

    socket.on("chatHistory", async (chatId) => {
        try {
            if (!chatId) {
                throw new ApiError(403, "Chat not selected.");
            }

            const chat = await Chat.findById({_id:chatId}).polygon("messages.sender_id","username profile_picture");

            if(!chat){
                throw new ApiError(403,"Chat not found");
            }

            socket.emit("chatHistory",chat);
        } catch (error) {
            throw new ApiError(500, error.message || "Chat not fetched.");
        }
    });


    socket.on("newMessage", async (data) => {
        try {
            const { chatId, userId, senderId, messageText, media } = data;
            if (!chatId || !userId || !senderId || !(messageText || media)) {
                throw new ApiError(403, "All fields are essential.");
            }
            const chat = await Chat.findById({ _id: chatId });
            if (!chat) {
                throw new ApiError(403, "Chat not found");
            }

            const updatedChat = await Chat.findByIdAndUpdate({ _id: chat._id }, {
                $set: {
                    sender_id: senderId || chat.sender_id,
                    message_text: messageText || chat.message_text,
                    media: media || chat.media,
                    sent_at:Date.now()
                }
            }, { new: true });

            if (!updatedChat) {
                throw new ApiError(403, "Message not send");
            }

            socket.to(roomId).emit("newMessage", data);

            const noti = await sendNotification(userId, "message", "New Message recieved.", updatedChat.sender_id);

            if (!noti) {
                throw new ApiError(403, "Notfication not send.");
            }

        } catch (error) {
            throw new ApiError(500, error.message || "Notfication not send.");
        }

    });


    socket.on('markAsSeen', async (data) => {
        try {
            const { chatId, userId } = data;

            if (!chatId || !userId) {
                throw new ApiError(403, "All fields are essential.");
            }
            const chat = await Chat.findById({ _id: chatId });
            if (!chat) {
                throw new ApiError(403, "Chat not found");
            }

            chat.messages.forEach(message => {
                if (!message.seen_by.includes(userId)) {
                    message.seen_by.push(userId);
                }
            });

            await chat.save();
            io.to(chatId).emit('messageSeen', { userId });

        } catch (error) {
            throw new ApiError(500, error.message);
        }
    });

    socket.on('lastSeen', async ({chatId,userId}) => {
        const chat = await Chat.findById({_id:chatId});
        if (!chat){
            throw new ApiError(403,"Chat not found");
        };


    
        const lastSeenIndex = chat.last_seen.findIndex((seen) => seen.user_id.toString() === userId);
        if (lastSeenIndex !== -1) {
            chat.last_seen[lastSeenIndex].last_seen_at = Date.now();
            await chat.save();
        }
    });
};



module.exports = { handleSocketChatEvents, createChat,deleteChat,deleteMessage };