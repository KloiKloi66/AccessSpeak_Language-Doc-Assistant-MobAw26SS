from pymongo import MongoClient

mongoClient = MongoClient("mongodb://mongodb:27017")
database = mongoClient["documents_db"]
documents = database["entries"]