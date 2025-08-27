const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const path = require('path');

const file = path.join(__dirname, '..', 'db.json');
const adapter = new JSONFile(file);

// Pass default data here ⬇️
const db = new Low(adapter, { users: [], achievements: [] });

async function initDB() {
  await db.read();
  await db.write(); // ensure file exists with default data
}

initDB();

module.exports = db;
