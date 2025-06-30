'use strict';
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    }
  }, {
    tableName: 'categories',
    timestamps: true,
  });

  // ✅ Thiết lập quan hệ cha-con
  Category.associate = function (models) {
    // Một danh mục có thể có nhiều danh mục con
    Category.hasMany(models.Category, {
      foreignKey: 'parent_id',
      as: 'children'
    });

    // Một danh mục có thể thuộc về một danh mục cha
    Category.belongsTo(models.Category, {
      foreignKey: 'parent_id',
      as: 'parent'
    });
  };

  return Category;
};
