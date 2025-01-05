import dbConnect from "./db/db.js";
import { app } from "./app.js";
import { config } from "./config/config.js";

dbConnect()
    .then(() => {
        app.on("error", (error) => {
            console.log("Error on App ", error);
            throw error;
        });

        app.listen(config.port || 8000, () => {
            console.log(`⚙ Server is running at port ${config.port}`);
        });
    })
    .catch((error) => console.log("DB Connection Error!!! ", error));