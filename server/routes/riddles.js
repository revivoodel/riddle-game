
import express from "express";
import { readDb, writeDb } from "../db/dbHelpers.js";

const router = express.Router();

// // 1 - GET all riddles
// router.get("/", async (req, res) => {
//     try {
//         const db = await readDb();

//         res.json(db.riddles);
//     } catch (error) {
//         res.status(500).json({ error: "Server error" });
//     }
// });

router.get("/", async (req, res) => {
    try {
        console.log("GET /api/riddles received");

        const db = await readDb();

        console.log("Database:", db);
        console.log("Riddles:", db.riddles);

        res.json(db.riddles);
    } catch (error) {
        console.log("ERROR:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// 2 - GET riddle by ID
router.get("/:id", async (req, res) => {
    try {
        const db = await readDb();
        const id = Number(req.params.id);

        const riddle = db.riddles.find(r => r.id === id);

        if (!riddle) {
            return res.status(404).json({
                error: "Riddle not found"
            });
        }

        res.json(riddle);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// 3 - POST create riddle
router.post("/", async (req, res) => {
    try {
        const db = await readDb();

        const newId = db.riddles.length === 0
            ? 1
            : Math.max(...db.riddles.map(r => Number(r.id))) + 1;

        const newRiddle = {
            ...req.body,
            id: newId
        };

        db.riddles.push(newRiddle);

        await writeDb(db);

        res.status(201).json(newRiddle);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// 4 - PUT update riddle
router.put("/:id", async (req, res) => {
    try {
        const db = await readDb();
        const id = Number(req.params.id);

        const index = db.riddles.findIndex(r => r.id === id);

        if (index === -1) {
            return res.status(404).json({
                error: "Riddle not found"
            });
        }

        const updatedRiddle = {
            ...req.body,
            id: id
        };

        db.riddles[index] = updatedRiddle;

        await writeDb(db);

        res.json(updatedRiddle);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// 5 - DELETE riddle
router.delete("/:id", async (req, res) => {
    try {
        const db = await readDb();
        const id = Number(req.params.id);

        const index = db.riddles.findIndex(r => r.id === id);

        if (index === -1) {
            return res.status(404).json({
                error: "Riddle not found"
            });
        }

        db.riddles.splice(index, 1);

        await writeDb(db);

        res.json({ message: "Riddle deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

export default router;
