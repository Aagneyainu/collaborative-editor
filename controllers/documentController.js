
const { Document, DocumentVersion } = require('../models');

exports.createDocument = async (req, res) => {
  try {
    const { title, content } = req.body;
    const document = await Document.create({
      title,
      content,
      ownerId: req.user.id,
    });

    // Create initial version
    await DocumentVersion.create({
      documentId: document.id,
      content,
      version: document.version,
      updatedAt: new Date(),
    });

    res.status(201).json(document);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDocuments = async (req, res) => {
  try {
    const documents = await Document.findAll({ where: { ownerId: req.user.id } });
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDocumentById = async (req, res) => {
  try {
    const document = await Document.findByPk(req.params.id);
    if (!document) return res.status(404).json({ message: 'Document not found' });

    // Authorization: Only owner or authorized users can access
    if (document.ownerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    res.status(200).json(document);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateDocument = async (req, res) => {
  try {
    const { content } = req.body;
    const document = await Document.findByPk(req.params.id);
    if (!document) return res.status(404).json({ message: 'Document not found' });

    // Authorization
    if (document.ownerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Update content and version
    document.content = content;
    document.version += 1;
    await document.save();

    // Create new version
    await DocumentVersion.create({
      documentId: document.id,
      content,
      version: document.version,
      updatedAt: new Date(),
    });

    res.status(200).json(document);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const document = await Document.findByPk(req.params.id);
    if (!document) return res.status(404).json({ message: 'Document not found' });

    // Authorization
    if (document.ownerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await document.destroy();
    res.status(200).json({ message: 'Document deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDocumentVersions = async (req, res) => {
  try {
    const versions = await DocumentVersion.findAll({
      where: { documentId: req.params.id },
      order: [['version', 'DESC']],
    });
    res.status(200).json(versions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.revertDocument = async (req, res) => {
  try {
    const { version } = req.body;
    const documentVersion = await DocumentVersion.findOne({
      where: { documentId: req.params.id, version },
    });

    if (!documentVersion) {
      return res.status(404).json({ message: 'Version not found' });
    }

    const document = await Document.findByPk(req.params.id);
    if (!document) return res.status(404).json({ message: 'Document not found' });

    // Authorization
    if (document.ownerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    document.content = documentVersion.content;
    document.version += 1;
    await document.save();

    // Create new version
    await DocumentVersion.create({
      documentId: document.id,
      content: document.content,
      version: document.version,
      updatedAt: new Date(),
    });

    res.status(200).json(document);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
