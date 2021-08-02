const axios = require("axios");
const Redis = require("ioredis");
const JSONCache = require("redis-json");
require("dotenv").config();
const redis = new Redis();
const jsonCache = new JSONCache(redis, { prefix: "cache" });

const initializeRedis = async () => {
  const populated = await jsonCache.get("populated");
  if (populated["val"] === true) {
    return;
  }
  try {
    const res = await axios.get(
      "https://api.github.com/repos/rails/rails/issues",
      {
        headers: {
          Authorization: process.env.TOKEN,
        },
      }
    );
    const issues = await res.data;
    for (let i = 0; i < issues.length; i++) {
      let issue = issues[i];
      const {
        id,
        url,
        title,
        number,
        body: description,
        labels,
        user,
        comments: commentCount,
      } = issue;
      const filteredIssue = {
        url,
        title,
        description,
        labels,
        user,
        commentCount,
      };
      const val = jsonCache.get(id);
      if (i === 0 && !val) {
        await jsonCache.set("lastId", { id });
        await jsonCache.set("issueNumber", { number });
      }
      if (i === issues.length - 1 && !val) {
        await jsonCache.set(id, filteredIssue);
        await jsonCache.set("populated", { val: true });
      }
      await jsonCache.set(id, filteredIssue);
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  initializeRedis,
  jsonCache,
};
