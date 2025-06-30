const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./models'); // Sequelize models
const adminRoutes = require('./routes/AdminRoutes'); // Import route tổng admin

dotenv.config();

const app = express();

// ✅ Cấu hình CORS: Cho phép gọi từ React (port 5173 của Vite hoặc 3000 nếu dùng CRA)
app.use(cors({
    origin: 'http://localhost:5173', // Đổi nếu frontend ở port khác
    credentials: true                // Cho phép cookie, nếu dùng auth
}));

// ✅ Middleware để parse JSON và form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Phục vụ ảnh tĩnh (logo, ảnh sản phẩm,...)
app.use('/uploads', express.static('uploads'));

// ✅ Route mặc định (Test)
app.get('/', (req, res) => {
    res.send('✅ API is running...');
});

// ✅ Gắn các route admin
app.use('/api/admin', adminRoutes);

// ✅ Kết nối DB & khởi chạy server
const PORT = process.env.PORT || 3000;

db.sequelize.authenticate()
    .then(() => {
        console.log('✅ Kết nối database thành công');
        app.listen(PORT, () => {
            console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ Lỗi kết nối database:', err);
    });
