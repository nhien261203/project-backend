require('dotenv').config();

module.exports = {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'shop_db',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: process.env.DB_DIALECT || 'mysql', // ✅ RẤT QUAN TRỌNG!
    logging: false,
    define: {
        timestamps: true,
        freezeTableName: true
    }
};
