
import fs from "fs/promises";

const filePath = new URL("./db.json", import.meta.url);

export async function readDb() {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
}

export async function writeDb(db) {
    await fs.writeFile(
        filePath,
        JSON.stringify(db, null, 2)
    );
}
