const express = require('express');
const router = express.Router();
const notes = require('../controllers/notes');

router.get('/', notes.getNotes);
router.post('/', notes.createNote);
router.delete('/:id', notes.deleteNote);

module.exports = router;
