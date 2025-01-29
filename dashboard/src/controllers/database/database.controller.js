const Database = require("../../models/database.model");
const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");
const asyncHandler = require("../../utils/asyncHandler");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");
const { validate, collectionDeleteSchema } = require("./databaseValidation");

const getDatabases = asyncHandler(async (req, res) => {
  const loggedIn = req.user;

  if (!loggedIn) {
    throw new ApiError(401, "Unauthorized access");
  }

  const client = new MongoClient(`${process.env.MONGODB_URI}`);

  await client.connect();

  const databases = await client.db().admin().listDatabases();
  let collectionCount = 0,
    dbCount = databases.databases.length || 0;

  for (const dbInfo of databases.databases) {
    const dbName = dbInfo.name;
    const db = client.db(dbName);

    // Get the collections of the current database
    const collections = await db.listCollections().toArray();
    collectionCount += collections.length;
  }

  await client.close();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        database: databases,
        count: { dbCount, collectionCount },
      },
      "Database Fetched Successfully"
    )
  );
});

const getCollections = asyncHandler(async (req, res) => {
  const loggedIn = req.user;

  if (!loggedIn) {
    throw new ApiError(401, "Unauthorized access");
  }

  const client = new MongoClient(`${process.env.MONGODB_URI}`);

  await client.connect();

  const databases = (await client.db().admin().listDatabases()).databases;

  let result = [];
  let totalDocuments = 0;
  let totalCollection = 0;

  for (const dbInfo of databases) {
    const dbName = dbInfo.name;
    const db = client.db(dbName);

    const collections = await db.listCollections().toArray();

    for (const collection of collections) {
      // Use aggregation to get collection stats
      const statsPipeline = [{ $collStats: { storageStats: {} } }];
      const stats = await db
        .collection(collection.name)
        .aggregate(statsPipeline)
        .toArray();

      // Calculate the total documents
      const documentCount = await db
        .collection(collection.name)
        .countDocuments();

      // Add to totalDocuments
      totalDocuments += documentCount;
      totalCollection = totalCollection + 1;

      // Push collection details to the result array
      result.push({
        database: dbName,
        collection: collection.name,
        documentCount: documentCount,
        storageSize: stats[0]?.storageStats?.storageSize || 0,
        avgDocumentSize: stats[0]?.storageStats?.avgObjSize || 0,
        indexSize: stats[0]?.storageStats?.totalIndexSize || 0,
      });
    }
  }

  await client.close();

  if (!result) {
    throw new ApiError("Collections not found.");
  }
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        collections: result,
        count: { totalCollection, totalDocuments },
      },
      "Collections found successfully"
    )
  );
});

// Login to MongoDB and fetch all databases, collections, and documents
const getAllData = async (req, res) => {
  //   const { uri } = req.body; // MongoDB URI sent in the request body

  //   if (!uri) return res.status(400).json({ message: 'MongoDB URI is required.' });

  try {
    const client = new MongoClient(`${process.env.MONGODB_URI}`, {
      useUnifiedTopology: true,
    });
    await client.connect();

    const admin = client.db().admin();

    // Fetch all databases
    const databases = await admin.listDatabases();
    const dbList = databases.databases;

    // Prepare counts
    const result = {
      databaseCount: dbList.length,
      databases: [],
    };

    for (const dbInfo of dbList) {
      const dbName = dbInfo.name;
      const db = client.db(dbName);

      // Fetch collections for each database
      const collections = await db.listCollections().toArray();

      const dbData = {
        databaseName: dbName,
        collectionCount: collections.length,
        collections: [],
      };

      for (const collectionInfo of collections) {
        const collectionName = collectionInfo.name;
        const collection = db.collection(collectionName);

        // Fetch documents for each collection
        const documents = await collection.find({}).toArray();

        dbData.collections.push({
          collectionName,
          documentCount: documents.length,
          documents,
        });
      }

      result.databases.push(dbData);
    }

    client.close();
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching data", error: error.message });
  }
};

// Monitor changes using Change Streams
const monitorChanges = async (uri) => {
  try {
    const client = new MongoClient(`${process.env.MONGODB_URI}`);
    await client.connect();

    console.log("Connected to MongoDB for monitoring changes...");

    const db = client.db(); // Default database
    const changeStream = db.watch(); // Monitor all changes in the database

    // Watch for change events
    changeStream.on("change", async (change) => {
      const activity = {
        operationType: change.operationType, // insert, update, delete, etc.
        ns: change.ns, // namespace (database and collection name)
        documentKey: change.documentKey, // The affected document's _id
        fullDocument: change.fullDocument || null, // Document after change
        updateDescription: change.updateDescription || null, // Updated fields (for updates only)
        timestamp: new Date(),
      };

      console.log("Change detected:", activity);

      // Save the activity to a dedicated collection
      const logsDb = client.db("logs"); // Use a dedicated database for logs
      const activityLogsCollection = logsDb.collection("activityLogs");

      await activityLogsCollection.insertOne(activity);
      console.log("Activity logged:", activity);
    });
  } catch (error) {
    console.error("Error monitoring changes:", error.message);
  }
};

const createCollection = asyncHandler(async (req, res) => {
  const loggedIn = req.user;

  if (!loggedIn) {
    throw new ApiError(401, "Unauthorized access");
  }

  validate(collectionDeleteSchema, req.body);
  const { database, collection } = req.body;

  const client = new MongoClient(`${process.env.MONGODB_URI}`);

  await client.connect();

  const db = await client.db(database);

  const collections = await db.listCollections().toArray();

  const isExistCollection = collections.some((cl) => cl.name === collection);

  if (isExistCollection) {
    throw new ApiError(400, "Collection name already exist");
  }

  await db.createCollection(collection);

  await client.close();

  return res
    .status(200)
    .json(new ApiResponse(200, collection, "Collection Created Successfully."));
});

const deleteCollection = asyncHandler(async (req, res) => {
  const loggedIn = req.user;

  if (!loggedIn) {
    throw new ApiError(401, "Unauthorized access");
  }

  console.log(req.body);
  validate(collectionDeleteSchema, req.body);
  const { database, collection } = req.body;

  const client = new MongoClient(`${process.env.MONGODB_URI}`);

  await client.connect();

  const db = await client.db(database);

  const result = await db.collection(collection).drop();
  await client.close();

  if (result) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {},
          `Collection ${collection} dropped successfully.`
        )
      );
  } else {
    return res
      .status(200)
      .json(
        new ApiResponse(200, {}, `Collection ${collection} does not exist.`)
      );
  }
});

const renameCollection = asyncHandler(async (req, res) => {
  const loggedIn = req.user;

  if (!loggedIn) {
    throw new ApiError(401, "Unauthorized access");
  }

  validate(collectionRename, req.body);
  const { database, oldCollection, newCollection } = req.body;

  const client = new MongoClient(`${process.env.MONGODB_URI}`);

  await client.connect();

  const db = await client.db(database);

  const collections = await db.listCollections().toArray();

  const isExistCollection = collections.some((cl) => cl.name === oldCollection);

  if (!isExistCollection) {
    throw new ApiError(400, `Collection ${oldCollection} does not exist`);
  }

  await db.collection(oldCollection).rename(newCollection);

  await client.close();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        `Collection renamed from ${oldCollection} to ${newCollection}`
      )
    );
});
module.exports = { getDatabases, getCollections,deleteCollection,renameCollection,createCollection };
