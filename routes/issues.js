const express = require("express");
const router = express.Router();
const { jsonCache } = require("../redis");
const BASE_URL = "https://api.github.com/repos/rails/rails/issues";

router.get("/issues/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const issue = await jsonCache.get(id);
    if (!issue) {
      res.status(404).send("Issue not found");
    }
    res.json(issue);
  } catch (err) {
    res.status(500);
  }
});

router.post("/issues", async (req, res) => {
  const { title, user, description } = req.body;

  const lastId = await jsonCache.get("lastId");
  const id = lastId["id"] + 1;
  const lastIssue = await jsonCache.get("issueNumber");
  const number = lastIssue["number"] + 1;
  const issue = {
    id,
    url: `${BASE_URL}/${lastIssue}`,
    number,
    title,
    user,
    labels: [],
    commentsCount: 0,
    description,
  };
  await jsonCache.set("lastId", { id });
  await jsonCache.set("issueNumber", { number });
  res.status(202).json(issue);
});

router.delete("/issues/:id", async (req, res) => {
  const { id } = req.params;

  await jsonCache.del(id);
  res.status(204);
});

router.patch("/issues/:id", async (req, res) => {
  const { id } = req.params;
  await jsonCache.set(id, req.body);
  const updatedIssue = await jsonCache.get(id);
  res.status(200).json(updatedIssue);
});

module.exports = router;
