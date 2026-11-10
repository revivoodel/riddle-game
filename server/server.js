
import express from "express";

import riddlesRouter from "./routes/riddles.js";
import playersRouter from "./routes/players.js";

const app = express();
const PORT = 3000;

app.use(express.json());


app.use("/riddles", riddlesRouter);
app.use("/players", playersRouter);


app.listen(PORT, () => {
    console.log(
        `Server is running on http://localhost:${PORT}`
    );
});
