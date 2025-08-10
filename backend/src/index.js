import dbConnect from "./db/db.js";
import { config } from "./config/config.js";
import { server, app } from "./app.js";

dbConnect()
    .then(() => {
        app.on("error", (error) => {
            console.log("Error on App ", error);
            throw error;
        });

        server.listen(config.port || 8000, () => {
            console.log(`⚙ Server is running at port ${config.port}`);
        });
    })
    .catch((error) => console.log("DB Connection Error!!! ", error));