const boardService = require("./board.service");

function createBoard(req, res, next) {
  try {
    const board = boardService.createBoard(req.user.userId, req.body);
    res.status(201).json({ success: true, data: board });
  } catch (error) {
    next(error);
  }
}

function listBoards(req, res, next) {
  try {
    const boards = boardService.listBoards(req.user.userId);
    res.status(200).json({ success: true, count: boards.length, data: boards });
  } catch (error) {
    next(error);
  }
}

function getBoard(req, res, next) {
  try {
    const board = boardService.getBoard(req.user.userId, req.params.boardId);
    res.status(200).json({ success: true, data: board });
  } catch (error) {
    next(error);
  }
}

function updateBoard(req, res, next) {
  try {
    const board = boardService.updateBoard(req.user.userId, req.params.boardId, req.body);
    res.status(200).json({ success: true, data: board });
  } catch (error) {
    next(error);
  }
}

function deleteBoard(req, res, next) {
  try {
    boardService.deleteBoard(req.user.userId, req.params.boardId);
    res.status(200).json({ success: true, message: "Board deleted" });
  } catch (error) {
    next(error);
  }
}

function listNotes(req, res, next) {
  try {
    const notes = boardService.listNotes(req.user.userId, req.params.boardId);
    res.status(200).json({ success: true, count: notes.length, data: notes });
  } catch (error) {
    next(error);
  }
}

function addNote(req, res, next) {
  try {
    const note = boardService.addNote(req.user.userId, req.params.boardId, req.body);
    res.status(201).json({ success: true, data: note });
  } catch (error) {
    next(error);
  }
}

function getNote(req, res, next) {
  try {
    const note = boardService.getNote(req.user.userId, req.params.boardId, req.params.noteId);
    res.status(200).json({ success: true, data: note });
  } catch (error) {
    next(error);
  }
}

function updateNote(req, res, next) {
  try {
    const note = boardService.updateNote(
      req.user.userId,
      req.params.boardId,
      req.params.noteId,
      req.body
    );
    res.status(200).json({ success: true, data: note });
  } catch (error) {
    next(error);
  }
}

function deleteNote(req, res, next) {
  try {
    boardService.deleteNote(req.user.userId, req.params.boardId, req.params.noteId);
    res.status(200).json({ success: true, message: "Note deleted" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createBoard,
  listBoards,
  getBoard,
  updateBoard,
  deleteBoard,
  listNotes,
  addNote,
  getNote,
  updateNote,
  deleteNote
};
