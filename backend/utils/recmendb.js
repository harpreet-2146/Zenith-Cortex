// utils/recmendb.js
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

// Path for recruiters & mentors DB
const adapter = new FileSync("recmendb.json");
const recmenDB = low(adapter);

// Initialize default structure if empty
recmenDB.defaults({ recruiters: [], mentors: [] }).write();

module.exports = recmenDB;
