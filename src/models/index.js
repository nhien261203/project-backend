const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const config = require('../config/config.js')

const basename = path.basename(__filename)
const db = {}

// Khởi tạo Sequelize
const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
)

// Tự động load tất cả model trong thư mục này (trừ index.js)
fs.readdirSync(__dirname)
    .filter(file => {
        return (
            file.indexOf('.') !== 0 &&
            file !== basename &&
            file.slice(-3) === '.js'
        )
    })
    .forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
        db[model.name] = model
    })

// Gọi associate nếu model có
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db)
    }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
