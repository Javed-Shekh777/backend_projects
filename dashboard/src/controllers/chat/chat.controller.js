const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");
const asyncHandler = require("../../utils/asyncHandler");
const Chat = require("../../models/chat.model");
const Message = require("../../models/message.model");
const { uploadCloudinary } = require("../../utils/cloudinary");
const { FoldersName } = require("../../constants");

const createOneToOneChat = asyncHandler(async (req, res) => {
  const loggedIn = req.user;

  if (!loggedIn) {
    throw new ApiError(400, "Unauthorized request.");
  }

  const { userId } = req.body;

  if (!userId) {
    throw new ApiError(400, "Another users ID is required.");
  }

  let participants = [userId, loggedIn._id];

  const sortedParticipants = participants.sort();

  let chat = await Chat.findOne({
    participants: { $all: sortedParticipants },
  });

  if (!chat) {
    chat = await Chat.create({
      participants: sortedParticipants,
      isGroupChat: false,
    });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, chat, "Chat created successfully."));
});

const createGroupChat = asyncHandler(async (req, res) => {
  const loggedIn = req.user;

  if (!loggedIn) {
    throw new ApiError(400, "Unauthorized request.");
  }

  const { name, participants } = req.body;

  if (participants.langth < 2) {
    throw new ApiError(400, "At least 2 members required!");
  }

  if (!name) {
    throw new ApiError(400, "Chat name is required!");
  }

  const groupChat = await Chat.create({
    isGroupChat: true,
    groupDetails: {
      name,
      createdBy: loggedIn._id,
      admins: [loggedIn._id], // Admins list
    },
    participants: [...participants, loggedIn._id], // All members including creator
  });

  return res
    .status(200)
    .json(new ApiResponse(200, groupChat, "Group Chat created successfully."));
});

const getUserChats = asyncHandler(async (req, res) => {
  const loggedIn = req.user;
  if (!loggedIn) {
    throw new ApiError(400, "Unauthorized request.");
  }

  const chats = await Chat.find({
    participants: loggedIn._id, // The user must be part of the chat
  })
    .populate("participants", "username email profilePicture") // Populating participant info (optional)
    .populate("lastMessage")
    .sort({ updatedAt: -1 });

  if (!chats) {
    throw new ApiError(400, "Chat not loaded.");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, chats, "Chat loaded successfully."));
});

const getMessages = asyncHandler(async (req, res) => {
  const loggedIn = req.user;
  if (!loggedIn) {
    throw new ApiError(400, "Unauthorized request.");
  }
  const { chatId } = req.body;
  if (!chatId) {
    throw new ApiError(400, "Chat ID is required.");
  }
  const messages = await Message.findById({ _id: chatId })
    .populate("sender", "username email profilePicture") // Populate the messages field
    .sort({ timestamp: 1 });
  if (!messages) {
    throw new ApiError(400, "Messages not fetched.");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, messages, "Messages fetched successfully."));
});

 
const sendMessages = asyncHandler(async (req, res) => {
  const loggedIn = req.user;

  if (!loggedIn) {
    throw new ApiError(400, "Unauthorized request.");
  }

  const { chatId, content, messageType } = req.body;

  if (!chatId || !messageType) {
    throw new ApiError(400, "Chat ID and Message Type are required.");
  }

  const isChatExist = await Chat.findById({ _id: chatId }).populate(
    "participants"
  );

  if (!isChatExist) {
    throw new ApiError(400, "Chat not exist.");
  }

  let receiverId = null;

  // Determine receiver for one-to-one chats
  if (!isChatExist.isGroupChat) {
    receiverId = isChatExist.participants
      .map((id) => id.toString())
      .filter((id) => id !== loggedIn._id.toString())[0];
  }

  let messageData = {
    receiver: receiverId,
    chatId: chatId,
    sender: loggedIn._id,
    messageType: messageType,
  };

  // For text and link messages
  if (messageType === "text" || messageType === "link") {
    messageData.content = content;
  }

  // For media messages (image, video, audio, pdf)
  else if (["image", "video", "pdf", "audio"].includes(messageType)) {
    const files = req.files; // Multiple files in array for 'image', 'audio', etc.
    const file = req.file; // For single file upload

    if (!files && !file) {
      throw new ApiError(409, "Media file is missing.");
    }

    let localFilePaths = [];

    if (file) localFilePaths.push(file.path);
    if (files) files.forEach((f) => localFilePaths.push(f.path));

    const cloudinaryResponse = await uploadCloudinary(
      localFilePaths,
      FoldersName.media
    );

    if (!cloudinaryResponse || cloudinaryResponse.length === 0) {
      throw new ApiError(409, "Media not uploaded.");
    }

    messageData.media = cloudinaryResponse.map((file) => {
      return {
        url: file.secure_url,
        publicId: file.public_id,
        type: file.format,
        size: file.bytes,
        name: file.original_filename,
        ...(file.resource_type === "video" && { duration: file.duration }),
        ...(file.resource_type === "audio" && { duration: file.duration }),
        ...(file.resource_type === "pdf" && { pages: file.pages }),
      };
    });
  }

  // Saving the message to the database
  const message = new Message(messageData);
  await message.save();

  // Update last message in the chat schema
  isChatExist.lastMessage = message._id;
  await isChatExist.save();

  return res
    .status(200)
    .json(new ApiResponse(200, message, "Message sent successfully."));
});

module.exports = {
  createOneToOneChat,
  createGroupChat,
  getMessages,
  getUserChats,
  sendMessages
};
