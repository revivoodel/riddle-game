
const URL = "http://localhost:3000/players";

// 1 - Find player by name
export async function findPlayerByName(name) {
    try {
        const response = await fetch(
            `${URL}?name=${encodeURIComponent(name)}`
        );

        if (!response.ok) {
            throw new Error("Failed to find player");
        }

        const players = await response.json();

        return players[0];

    } catch (error) {
        console.log("Error:", error.message);
        throw error;
    }
}

// 2 - Create player
export async function createPlayer(name) {
    try {
        const newPlayer = {
            name: name,
            lowestTime: null
        };

        const response = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newPlayer)
        });

        if (!response.ok) {
            throw new Error("Failed to create player");
        }

        return await response.json();

    } catch (error) {
        console.log("Error:", error.message);
        throw error;
    }
}

// 3 - Update player
export async function updatePlayer(player) {
    try {
        const response = await fetch(
            `${URL}/${player.id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(player)
            }
        );

        if (!response.ok) {
            throw new Error("Failed to update player");
        }

        return await response.json();

    } catch (error) {
        console.log("Error:", error.message);
        throw error;
    }
}

// 4 - Get all players
export async function getAllPlayers() {
    try {
        const response = await fetch(URL);

        if (!response.ok) {
            throw new Error("Failed to get players");
        }

        return await response.json();

    } catch (error) {
        console.log("Error:", error.message);
        throw error;
    }
}
