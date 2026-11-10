
import express from "express";
import { readDb, writeDb } from "../db/dbHelpers.js";

const router = express.Router();

// 1 - GET all players / find player by name
router.get("/", async (req, res) => {
    try {
        const db = await readDb();

        if (req.query.name !== undefined) {
            const players = db.players.filter(player => {
                return player.name === req.query.name;
            });

            return res.json(players);
        }

        res.json(db.players);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server error" });
    }
});

// 2 - POST create player
router.post("/", async (req, res) => {
    try {
        const db = await readDb();

        const newId = db.players.length === 0
            ? 1
            : Math.max(...db.players.map(p => Number(p.id))) + 1;

        const newPlayer = {
            id: newId,
            name: req.body.name,
            lowestTime: null
        };

        db.players.push(newPlayer);

        await writeDb(db);

        res.status(201).json(newPlayer);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server error" });
    }
});

// 3 - PUT update player's best time
router.put("/:id", async (req, res) => {
    try {
        const db = await readDb();
        const id = Number(req.params.id);

        const index = db.players.findIndex(player => {
            return Number(player.id) === id;
        });

        if (index === -1) {
            return res.status(404).json({
                error: "Player not found"
            });
        }

        db.players[index].lowestTime = req.body.lowestTime;

        await writeDb(db);

        res.json(db.players[index]);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server error" });
    }
});

export default router;
