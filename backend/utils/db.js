// backend/db.js
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';

const file = path.join(process.cwd(), 'backend', 'achievements.json');
const adapter = new JSONFile(file);
const db = new Low(adapter);

// Initialize default structure if empty
await db.read();
db.data ||= { achievements: [], users: [] };
await db.write();

export default db;
