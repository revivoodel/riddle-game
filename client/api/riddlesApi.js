
// api/riddlesApi.js


const URL = "http://localhost:3000/riddles";


export async function getAllRiddles() {
    try {
        const res = await fetch(URL);

        if (!res.ok) {
            throw new Error("Failed to get riddles");
        }

        const riddles = await res.json();
        return riddles;

    } catch (error) {
        console.log("Error:", error.message);
        throw error;
    }
}

export async function createRiddle(riddle) {
    try {
        const res = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(riddle)
        });

        if (!res.ok) {
            throw new Error("Failed to create riddle");
        }

        return await res.json();

    } catch (error) {
        console.log("Error:", error.message);
        throw error;
    }
}


export async function updateRiddle(id, riddle) {
    try {
        const res = await fetch(`${URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(riddle)
        });

        if (!res.ok) {
            throw new Error("Failed to update riddle");
        }

        return await res.json();

    } catch (error) {
        console.log("Error:", error.message);
        throw error;
    }
}

export async function deleteRiddle(id) {
    try {
        const res = await fetch(`${URL}/${id}`, {
            method: "DELETE"
        });

        if (!res.ok) {
            throw new Error("Failed to delete riddle");
        }

        return true;

    } catch (error) {
        console.log("Error:", error.message);
        throw error;
    }
}
