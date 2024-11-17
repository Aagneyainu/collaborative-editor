
module.exports = (sequelize, DataTypes) => {
    const Document = sequelize.define('Document', {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      version: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    });
  
    Document.associate = (models) => {
      Document.belongsTo(models.User, { foreignKey: 'ownerId' });
    };
  
    return Document;
  };
  