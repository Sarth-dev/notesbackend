const Note = require('../models/Note');
const { verifyToken } = require('../utils/jwt');

exports.getNotes = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  try {
    const user = verifyToken(token);
    const notes = await Note.find({ user: user.id });
    res.json(notes);
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

exports.createNote = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  try {
    const user = verifyToken(token);
    const note = new Note({ text: req.body.text, user: user.id });
    await note.save();
    res.json(note);
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

exports.deleteNote = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  try {
    const user = verifyToken(token);
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: user.id });
    res.json({ deleted: !!note });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
