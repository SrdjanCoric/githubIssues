const express = require("express");
const port = process.env.PORT || 3000;
// require("dotenv").config();
const issuesRoutes = require("./routes/issues");
const { initializeRedis } = require("./redis");

async function main() {
  const createApp = async () => {
    return new Promise(async (resolve, reject) => {
      await initializeRedis();
      resolve(express());
    });
  };

  const app = await createApp();

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use("/api", issuesRoutes);

  app.listen(port);

  console.log(`Server listening at http://localhost:${port}`);
}
main();
