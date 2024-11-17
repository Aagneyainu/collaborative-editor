
module.exports = (sequelize, DataTypes) => {
    const DocumentVersion = sequelize.define('DocumentVersion', {
      documentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      version: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });
  
    DocumentVersion.associate = (models) => {
      DocumentVersion.belongsTo(models.Document, { foreignKey: 'documentId' });
    };
  
    return DocumentVersion;
  };
  