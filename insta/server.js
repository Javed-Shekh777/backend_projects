const dotenv = require("dotenv");
// dotenv configuration 
dotenv.config();

const app = require("./src/app.js");
const connectDB = require("./src/config/db.js");


// Port 
const port = process.env.PORT || 3000;


// Databse calling and server starting 

connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is Running on PORT : http://localhost:${port}`);
        });
    }).catch((error) => console.log("MongoDB connection failed ", error));




 
 

// ChatGPT said:
// ChatGPT
// Below is the raw data for two users with the specified conditions. The data is designed to align with the schema provided earlier, with randomized values for attributes not explicitly mentioned.

// 1. First User Data
// User Document
// json
// Copy code
// {
//   "_id": ObjectId("64f123456789abc123456780"),
//   "username": "first_user",
//   "email": "firstuser@example.com",
//   "password": "hashed_password_1",
//   "fullName": "First User",
//   "bio": "Exploring the world through my lens!",
//   "website": "https://firstuserblog.com",
//   "profilePicture": "https://example.com/profile1.jpg",
//   "followers": [ObjectId("64f223456789abc123456781")], 
//   "following": [ObjectId("64f223456789abc123456781")],
//   "posts": [ObjectId("64f623456789abc123456780"), ObjectId("64f623456789abc123456781")],
//   "stories": [ObjectId("64f823456789abc123456780")],
//   "savedPosts": [ObjectId("64f623456789abc123456780"), ObjectId("64f623456789abc123456781"), ObjectId("64f623456789abc123456782")],
//   "savedReels": [ObjectId("64f723456789abc123456780"), ObjectId("64f723456789abc123456781"), ObjectId("64f723456789abc123456782")],
//   "notifications": [ObjectId("64f923456789abc123456780")],
//   "verified": true,
//   "privateAccount": false,
//   "blockedUsers": [],
//   "dateJoined": ISODate("2023-01-10T14:48:00.000Z"),
//   "lastLogin": ISODate("2024-08-27T10:00:00.000Z"),
//   "deviceInfo": [
//     {
//       "deviceType": "Mobile",
//       "deviceID": "device_id_1",
//       "loginTime": ISODate("2024-08-27T09:00:00.000Z")
//     }
//   ],
//   "usageData": {
//     "totalPosts": 2,
//     "totalLikes": 16, 
//     "totalComments": 8, 
//     "totalStories": 1,
//     "totalReels": 3,
//     "totalFollowers": 1,
//     "totalFollowing": 1,
//     "averageTimeSpent": 40 
//   },
//   "settings": {
//     "notifications": {
//       "likes": true,
//       "comments": true,
//       "newFollowers": true,
//       "directMessages": true,
//       "mentions": true
//     },
//     "privacy": {
//       "accountPrivacy": "Public",
//       "activityStatus": true,
//       "storySharing": true,
//       "messageReplies": "Everyone",
//       "tagging": "Everyone"
//     }
//   }
// }
// Post Documents for First User
// json
// Copy code
// [
//   {
//     "_id": ObjectId("64f623456789abc123456780"),
//     "userId": ObjectId("64f123456789abc123456780"),
//     "caption": "Sunset by the beach!",
//     "media": [
//       {
//         "type": "image",
//         "url": "https://example.com/photo1.jpg",
//         "dimensions": {
//           "width": 1080,
//           "height": 1080
//         }
//       }
//     ],
//     "likes": [ObjectId("64f223456789abc123456781"), ObjectId("64f323456789abc123456781")],
//     "comments": [ObjectId("64f523456789abc123456780"), ObjectId("64f523456789abc123456781"), ObjectId("64f523456789abc123456782"), ObjectId("64f523456789abc123456783")],
//     "location": "Malibu Beach",
//     "tags": [],
//     "createdAt": ISODate("2024-08-01T10:00:00.000Z"),
//     "updatedAt": ISODate("2024-08-01T10:00:00.000Z"),
//     "isReel": false,
//     "isShared": false,
//     "originalPostId": null
//   },
//   {
//     "_id": ObjectId("64f623456789abc123456781"),
//     "userId": ObjectId("64f123456789abc123456780"),
//     "caption": "Mountain adventures!",
//     "media": [
//       {
//         "type": "image",
//         "url": "https://example.com/photo2.jpg",
//         "dimensions": {
//           "width": 1080,
//           "height": 720
//         }
//       }
//     ],
//     "likes": [ObjectId("64f223456789abc123456781"), ObjectId("64f323456789abc123456782")],
//     "comments": [ObjectId("64f523456789abc123456784"), ObjectId("64f523456789abc123456785"), ObjectId("64f523456789abc123456786"), ObjectId("64f523456789abc123456787")],
//     "location": "Rocky Mountains",
//     "tags": [],
//     "createdAt": ISODate("2024-08-05T10:00:00.000Z"),
//     "updatedAt": ISODate("2024-08-05T10:00:00.000Z"),
//     "isReel": false,
//     "isShared": false,
//     "originalPostId": null
//   }
// ]
// Reel Documents for First User
// json
// Copy code
// [
//   {
//     "_id": ObjectId("64f723456789abc123456780"),
//     "userId": ObjectId("64f123456789abc123456780"),
//     "caption": "Quick dance moves!",
//     "media": [
//       {
//         "url": "https://example.com/reel1.mp4",
//         "duration": 30 
//       }
//     ],
//     "likes": [ObjectId("64f223456789abc123456781"), ObjectId("64f323456789abc123456783")],
//     "comments": [ObjectId("64f623456789abc123456784"), ObjectId("64f623456789abc123456785"), ObjectId("64f623456789abc123456786"), ObjectId("64f623456789abc123456787")],
//     "shares": [],
//     "createdAt": ISODate("2024-08-10T10:00:00.000Z")
//   },
//   {
//     "_id": ObjectId("64f723456789abc123456781"),
//     "userId": ObjectId("64f123456789abc123456780"),
//     "caption": "My workout routine!",
//     "media": [
//       {
//         "url": "https://example.com/reel2.mp4",
//         "duration": 45 
//       }
//     ],
//     "likes": [ObjectId("64f223456789abc123456781"), ObjectId("64f323456789abc123456784")],
//     "comments": [ObjectId("64f623456789abc123456788"), ObjectId("64f623456789abc123456789"), ObjectId("64f623456789abc123456790"), ObjectId("64f623456789abc123456791")],
//     "shares": [],
//     "createdAt": ISODate("2024-08-15T10:00:00.000Z")
//   },
//   {
//     "_id": ObjectId("64f723456789abc123456782"),
//     "userId": ObjectId("64f123456789abc123456780"),
//     "caption": "How to make a quick recipe!",
//     "media": [
//       {
//         "url": "https://example.com/reel3.mp4",
//         "duration": 60 
//       }
//     ],
//     "likes": [ObjectId("64f223456789abc123456781"), ObjectId("64f323456789abc123456785")],
//     "comments": [ObjectId("64f623456789abc123456792"), ObjectId("64f623456789abc123456793"), ObjectId("64f623456789abc123456794"), ObjectId("64f623456789abc123456795")],
//     "shares": [],
//     "createdAt": ISODate("2024-08-20T10:00:00.000Z")
//   }
// ]
// Comment Documents for First User
// json
// Copy code
// [
//   {
//     "_id": ObjectId("64f523456789abc123456780"),
//     "postId": ObjectId("64f623456789abc123456780"),
//     "userId": ObjectId("64f223456789abc123456781"),
//     "commentText": "Amazing shot!",
//     "likes": [ObjectId("64f223456789abc123456782"), ObjectId("64f323456789abc123456781")],
//     "replies": [
//       {
//         "userId": ObjectId("64f323456789abc123456782"),
//         "replyText": "Thank you!",
//         "likes": [ObjectId("64f223456789abc123456781"), ObjectId("64f323456789abc123456783")],
//         "createdAt": ISODate("2024-08-02T11:00:00.000Z")
//       }
//     ],
//     "createdAt": ISODate("2024-08-01T10:10:00.000Z")
//   },
//   {
//     "_id": ObjectId("64f523456789abc123456781"),
//     "postId": ObjectId("64f623456789abc123456780"),
//     "userId": ObjectId("64f323456789abc123456782"),
//     "commentText": "Love the view!",
//     "likes": [ObjectId("64f223456789abc123456781"), ObjectId("64f323456789abc123456783")],
//     "replies": [
//       {
//         "userId": ObjectId("64f223456789abc123456781"),
//         "replyText": "Me too!",
//         "likes": [ObjectId("64f323456789abc123456784"), ObjectId("64f223456789abc123456782")],
//         "createdAt": ISODate("2024-08-02T11:05:00.000Z")
//       }
//     ],
//     "createdAt": ISODate("2024-08-01T10:15:00.000Z")
//   },
//   {
//     "_id": ObjectId("64f523456789abc123456782"),
//     "postId": ObjectId("64f623456789abc123456780"),
//     "userId": ObjectId("64f223456789abc123456781"),
//     "commentText": "Looks peaceful!",
//     "likes": [ObjectId("64f223456789abc123456783"), ObjectId("64f323456789abc123456782")],
//     "replies": [
//       {
//         "userId": ObjectId("64f223456789abc123456781"),
//         "replyText": "It really is!",
//         "likes": [ObjectId("64f323456789abc123456783"), ObjectId("64f223456789abc123456784")],
//         "createdAt": ISODate("2024-08-02T11:10:00.000Z")
//       }
//     ],
//     "createdAt": ISODate("2024-08-01T10:20:00.000Z")
//   }
// ]


// 2. Second User Data
// User Document
// json
// Copy code
// {
//   "_id": ObjectId("64f223456789abc123456781"),
//   "username": "second_user",
//   "email": "seconduser@example.com",
//   "password": "hashed_password_2",
//   "fullName": "Second User",
//   "bio": "Nature lover and traveler.",
//   "website": "https://secondusertravel.com",
//   "profilePicture": "https://example.com/profile2.jpg",
//   "followers": [ObjectId("64f123456789abc123456780")], 
//   "following": [ObjectId("64f123456789abc123456780")],
//   "posts": [ObjectId("64f623456789abc123456782"), ObjectId("64f623456789abc123456783"), ObjectId("64f623456789abc123456784")],
//   "stories": [ObjectId("64f823456789abc123456781")],
//   "savedPosts": [ObjectId("64f623456789abc123456780"), ObjectId("64f623456789abc123456781"), ObjectId("64f623456789abc123456782")],
//   "savedReels": [ObjectId("64f723456789abc123456780"), ObjectId("64f723456789abc123456781"), ObjectId("64f723456789abc123456782")],
//   "notifications": [ObjectId("64f923456789abc123456781")],
//   "verified": false,
//   "privateAccount": false,
//   "blockedUsers": [],
//   "dateJoined": ISODate("2023-02-10T14:48:00.000Z"),
//   "lastLogin": ISODate("2024-08-27T12:00:00.000Z"),
//   "deviceInfo": [
//     {
//       "deviceType": "Desktop",
//       "deviceID": "device_id_2",
//       "loginTime": ISODate("2024-08-27T11:00:00.000Z")
//     }
//   ],
//   "usageData": {
//     "totalPosts": 3,
//     "totalLikes": 14, 
//     "totalComments": 8, 
//     "totalStories": 1,
//     "totalReels": 2,
//     "totalFollowers": 1,
//     "totalFollowing": 1,
//     "averageTimeSpent": 35 
//   },
//   "settings": {
//     "notifications": {
//       "likes": true,
//       "comments": true,
//       "newFollowers": true,
//       "directMessages": true,
//       "mentions": true
//     },
//     "privacy": {
//       "accountPrivacy": "Public",
//       "activityStatus": true,
//       "storySharing": true,
//       "messageReplies": "Everyone",
//       "tagging": "Everyone"
//     }
//   }
// }
// Post Documents for Second User
// json
// Copy code
// [
//   {
//     "_id": ObjectId("64f623456789abc123456782"),
//     "userId": ObjectId("64f223456789abc123456781"),
//     "caption": "Nature at its best!",
//     "media": [
//       {
//         "type": "image",
//         "url": "https://example.com/nature1.jpg",
//         "dimensions": {
//           "width": 1080,
//           "height": 1080
//         }
//       }
//     ],
//     "likes": [ObjectId("64f123456789abc123456780"), ObjectId("64f323456789abc123456781")],
//     "comments": [ObjectId("64f523456789abc123456788"), ObjectId("64f523456789abc123456789"), ObjectId("64f523456789abc123456790"), ObjectId("64f523456789abc123456791")],
//     "location": "Yosemite National Park",
//     "tags": [],
//     "createdAt": ISODate("2024-08-05T10:00:00.000Z"),
//     "updatedAt": ISODate("2024-08-05T10:00:00.000Z"),
//     "isReel": false,
//     "isShared": false,
//     "originalPostId": null
//   },
//   {
//     "_id": ObjectId("64f623456789abc123456783"),
//     "userId": ObjectId("64f223456789abc123456781"),
//     "caption": "City lights at night!",
//     "media": [
//       {
//         "type": "image",
//         "url": "https://example.com/city.jpg",
//         "dimensions": {
//           "width": 1080,
//           "height": 720
//         }
//       }
//     ],
//     "likes": [ObjectId("64f123456789abc123456780"), ObjectId("64f323456789abc123456782")],
//     "comments": [ObjectId("64f523456789abc123456792"), ObjectId("64f523456789abc123456793"), ObjectId("64f523456789abc123456794"), ObjectId("64f523456789abc123456795")],
//     "location": "New York City",
//     "tags": [],
//     "createdAt": ISODate("2024-08-10T10:00:00.000Z"),
//     "updatedAt": ISODate("2024-08-10T10:00:00.000Z"),
//     "isReel": false,
//     "isShared": false,
//     "originalPostId": null
//   },
//   {
//     "_id": ObjectId("64f623456789abc123456784"),
//     "userId": ObjectId("64f223456789abc123456781"),
//     "caption": "Exploring the forests!",
//     "media": [
//       {
//         "type": "image",
//         "url": "https://example.com/forest.jpg",
//         "dimensions": {
//           "width": 1080,
//           "height": 1080
//         }
//       }
//     ],
//     "likes": [ObjectId("64f123456789abc123456780"), ObjectId("64f323456789abc123456783")],
//     "comments": [ObjectId("64f523456789abc123456796"), ObjectId("64f523456789abc123456797"), ObjectId("64f523456789abc123456798"), ObjectId("64f523456789abc123456799")],
//     "location": "Amazon Rainforest",
//     "tags": [],
//     "createdAt": ISODate("2024-08-15T10:00:00.000Z"),
//     "updatedAt": ISODate("2024-08-15T10:00:00.000Z"),
//     "isReel": false,
//     "isShared": false,
//     "originalPostId": null
//   }
// ]
// Reel Documents for Second User
// json
// Copy code
// [
//   {
//     "_id": ObjectId("64f723456789abc123456783"),
//     "userId": ObjectId("64f223456789abc123456781"),
//     "caption": "Morning hike trail!",
//     "media": [
//       {
//         "url": "https://example.com/reel4.mp4",
//         "duration": 20 
//       }
//     ],
//     "likes": [ObjectId("64f123456789abc123456780"), ObjectId("64f323456789abc123456784")],
//     "comments": [ObjectId("64f823456789abc123456782"), ObjectId("64f823456789abc123456783"), ObjectId("64f823456789abc123456784"), ObjectId("64f823456789abc123456785")],
//     "createdAt": ISODate("2024-08-25T10:00:00.000Z"),
//     "updatedAt": ISODate("2024-08-25T10:00:00.000Z"),
//     "isReel": true,
//     "isShared": false,
//     "originalPostId": null
//   },
//   {
//     "_id": ObjectId("64f723456789abc123456784"),
//     "userId": ObjectId("64f223456789abc123456781"),
//     "caption": "Cooking at camp!",
//     "media": [
//       {
//         "url": "https://example.com/reel5.mp4",
//         "duration": 18 
//       }
//     ],
//     "likes": [ObjectId("64f123456789abc123456780"), ObjectId("64f323456789abc123456781")],
//     "comments": [ObjectId("64f823456789abc123456786"), ObjectId("64f823456789abc123456787"), ObjectId("64f823456789abc123456788"), ObjectId("64f823456789abc123456789")],
//     "createdAt": ISODate("2024-08-26T10:00:00.000Z"),
//     "updatedAt": ISODate("2024-08-26T10:00:00.000Z"),
//     "isReel": true,
//     "isShared": false,
//     "originalPostId": null
//   }
// ]
// Comments and Replies for Posts and Reels (Second User)
// json
// Copy code
// [
//   {
//     "_id": ObjectId("64f523456789abc123456788"),
//     "postId": ObjectId("64f623456789abc123456782"),
//     "userId": ObjectId("64f123456789abc123456780"),
//     "commentText": "Stunning view!",
//     "likes": [ObjectId("64f323456789abc123456784"), ObjectId("64f223456789abc123456781")],
//     "replies": [
//       {
//         "userId": ObjectId("64f223456789abc123456781"),
//         "replyText": "Thank you!",
//         "likes": [ObjectId("64f323456789abc123456783"), ObjectId("64f123456789abc123456780")],
//         "createdAt": ISODate("2024-08-06T11:00:00.000Z")
//       }
//     ],
//     "createdAt": ISODate("2024-08-05T10:15:00.000Z")
//   },
//   {
//     "_id": ObjectId("64f523456789abc123456789"),
//     "postId": ObjectId("64f623456789abc123456782"),
//     "userId": ObjectId("64f323456789abc123456781"),
//     "commentText": "Amazing shot!",
//     "likes": [ObjectId("64f123456789abc123456780"), ObjectId("64f223456789abc123456781")],
//     "replies": [
//       {
//         "userId": ObjectId("64f123456789abc123456780"),
//         "replyText": "Captured beautifully!",
//         "likes": [ObjectId("64f223456789abc123456781"), ObjectId("64f323456789abc123456784")],
//         "createdAt": ISODate("2024-08-06T11:05:00.000Z")
//       }
//     ],
//     "createdAt": ISODate("2024-08-05T10:25:00.000Z")
//   }
// ]