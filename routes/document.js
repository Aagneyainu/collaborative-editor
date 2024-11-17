
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const documentController = require('../controllers/documentController');

// All routes require authentication
router.use(auth);

router.post('/', documentController.createDocument);
router.get('/', documentController.getDocuments);
router.get('/:id', documentController.getDocumentById);
router.put('/:id', documentController.updateDocument);
router.delete('/:id', documentController.deleteDocument);

// Versioning
router.get('/:id/versions', documentController.getDocumentVersions);
router.post('/:id/revert', documentController.revertDocument);

module.exports = router;
