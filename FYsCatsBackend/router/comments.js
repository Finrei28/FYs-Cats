const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../Middleware/auth");
const { getComments, postComment } = require("../controller/comments");

router.route("/:id").get(getComments);
router.route("/").post(postComment);

module.exports = router;
