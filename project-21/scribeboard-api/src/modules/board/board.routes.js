const express = require("express");
const boardController = require("./board.controller");
const authMiddleware = require("../../middleware/auth.middleware");

const router = express.Router();

router.use(authMiddleware);

router.post("/", boardController.createBoard);
router.get("/", boardController.listBoards);
router.get("/:boardId", boardController.getBoard);
router.patch("/:boardId", boardController.updateBoard);
router.delete("/:boardId", boardController.deleteBoard);

router.get("/:boardId/notes", boardController.listNotes);
router.post("/:boardId/notes", boardController.addNote);
router.get("/:boardId/notes/:noteId", boardController.getNote);
router.patch("/:boardId/notes/:noteId", boardController.updateNote);
router.delete("/:boardId/notes/:noteId", boardController.deleteNote);

module.exports = router;
