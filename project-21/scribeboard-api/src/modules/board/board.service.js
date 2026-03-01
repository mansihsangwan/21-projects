const boards = [];
let boardCounter = 1;
let noteCounter = 1;

function sanitizeNote(note) {
  return {
    id: note.id,
    content: note.content,
    color: note.color,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt
  };
}

function sanitizeBoard(board, includeNotes = false) {
  return {
    id: board.id,
    title: board.title,
    description: board.description,
    ownerId: board.ownerId,
    createdAt: board.createdAt,
    updatedAt: board.updatedAt,
    noteCount: board.notes.length,
    ...(includeNotes && { notes: board.notes.map(sanitizeNote) })
  };
}

function getOwnedBoard(userId, boardId) {
  const board = boards.find(
    (entry) => entry.id === String(boardId) && entry.ownerId === String(userId)
  );

  if (!board) {
    const error = new Error("Board not found");
    error.statusCode = 404;
    throw error;
  }

  return board;
}

function getOwnedNote(board, noteId) {
  const note = board.notes.find((entry) => entry.id === String(noteId));

  if (!note) {
    const error = new Error("Note not found");
    error.statusCode = 404;
    throw error;
  }

  return note;
}

function createBoard(userId, payload) {
  const title = payload?.title ? String(payload.title).trim() : "";
  const description = payload?.description ? String(payload.description).trim() : "";

  if (!title) {
    const error = new Error("title is required");
    error.statusCode = 400;
    throw error;
  }

  const now = new Date().toISOString();

  const board = {
    id: String(boardCounter++),
    title,
    description,
    ownerId: String(userId),
    createdAt: now,
    updatedAt: now,
    notes: []
  };

  boards.push(board);

  return sanitizeBoard(board, true);
}

function listBoards(userId) {
  return boards
    .filter((entry) => entry.ownerId === String(userId))
    .map((entry) => sanitizeBoard(entry));
}

function getBoard(userId, boardId) {
  const board = getOwnedBoard(userId, boardId);
  return sanitizeBoard(board, true);
}

function updateBoard(userId, boardId, payload) {
  const board = getOwnedBoard(userId, boardId);

  const hasTitle = Object.prototype.hasOwnProperty.call(payload || {}, "title");
  const hasDescription = Object.prototype.hasOwnProperty.call(payload || {}, "description");

  if (!hasTitle && !hasDescription) {
    const error = new Error("Provide title or description to update");
    error.statusCode = 400;
    throw error;
  }

  if (hasTitle) {
    const title = String(payload.title || "").trim();
    if (!title) {
      const error = new Error("title cannot be empty");
      error.statusCode = 400;
      throw error;
    }
    board.title = title;
  }

  if (hasDescription) {
    board.description = String(payload.description || "").trim();
  }

  board.updatedAt = new Date().toISOString();

  return sanitizeBoard(board, true);
}

function deleteBoard(userId, boardId) {
  const index = boards.findIndex(
    (entry) => entry.id === String(boardId) && entry.ownerId === String(userId)
  );

  if (index === -1) {
    const error = new Error("Board not found");
    error.statusCode = 404;
    throw error;
  }

  boards.splice(index, 1);
}

function listNotes(userId, boardId) {
  const board = getOwnedBoard(userId, boardId);
  return board.notes.map(sanitizeNote);
}

function addNote(userId, boardId, payload) {
  const board = getOwnedBoard(userId, boardId);
  const content = payload?.content ? String(payload.content).trim() : "";
  const color = payload?.color ? String(payload.color).trim() : "yellow";

  if (!content) {
    const error = new Error("content is required");
    error.statusCode = 400;
    throw error;
  }

  const now = new Date().toISOString();

  const note = {
    id: String(noteCounter++),
    content,
    color,
    createdAt: now,
    updatedAt: now
  };

  board.notes.push(note);
  board.updatedAt = now;

  return sanitizeNote(note);
}

function getNote(userId, boardId, noteId) {
  const board = getOwnedBoard(userId, boardId);
  const note = getOwnedNote(board, noteId);
  return sanitizeNote(note);
}

function updateNote(userId, boardId, noteId, payload) {
  const board = getOwnedBoard(userId, boardId);
  const note = getOwnedNote(board, noteId);

  const hasContent = Object.prototype.hasOwnProperty.call(payload || {}, "content");
  const hasColor = Object.prototype.hasOwnProperty.call(payload || {}, "color");

  if (!hasContent && !hasColor) {
    const error = new Error("Provide content or color to update");
    error.statusCode = 400;
    throw error;
  }

  if (hasContent) {
    const content = String(payload.content || "").trim();
    if (!content) {
      const error = new Error("content cannot be empty");
      error.statusCode = 400;
      throw error;
    }
    note.content = content;
  }

  if (hasColor) {
    note.color = String(payload.color || "").trim() || "yellow";
  }

  const now = new Date().toISOString();
  note.updatedAt = now;
  board.updatedAt = now;

  return sanitizeNote(note);
}

function deleteNote(userId, boardId, noteId) {
  const board = getOwnedBoard(userId, boardId);
  const index = board.notes.findIndex((entry) => entry.id === String(noteId));

  if (index === -1) {
    const error = new Error("Note not found");
    error.statusCode = 404;
    throw error;
  }

  board.notes.splice(index, 1);
  board.updatedAt = new Date().toISOString();
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
