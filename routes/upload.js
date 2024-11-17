
const express = require('express');
const multer = require('multer');
const path = require('path');
const { convertDocument } = require('../utils/documentConverter');
const { Document } = require('../models');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const convertedContent = await convertDocument(filePath, req.file.mimetype);

    const document = await Document.create({
      title: req.file.originalname,
      content: convertedContent,
      ownerId: req.user.id, // assuming authentication middleware
    });

    res.status(201).json(document);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
