
// backend/utils/db.js
import { Low, JSONFile } from "lowdb";
import path from "path";

const file = path.join(process.cwd(), "db.json");
const adapter = new JSONFile(file);
const db = new Low(adapter);

// initialize db
await db.read();
db.data ||= { users: [], achievements: [], notifications: [] };
await db.write();

export default db;
