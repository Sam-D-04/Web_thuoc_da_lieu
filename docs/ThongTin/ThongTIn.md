TÀI LIỆU ĐẶC TẢ HỆ THỐNG: 
WEB E-COMMERCE DƯỢC MỸ PHẨM 
1. TỔNG QUAN DỰ ÁN
Mục tiêu: Xây dựng website thương mại điện tử chuyên phân phối dược mỹ phẩm da liễu, có hệ thống quản lý kho chuyên sâu theo lô và hạn sử dụng (Tương tự mô hình nhà thuốc Long Châu).
Quy mô Team: 5 thành viên (1 Leader/Fullstack, 2 Backend, 2 Frontend).
Thời gian dự kiến: 8 Tuần (2 tháng).
Tech Stack:
Backend: Laravel (Cung cấp RESTful API).
Frontend: Vue.js (Kết hợp Vuex/Pinia để quản lý State).
Database: MySQL.
2. QUY TẮC NGHIỆP VỤ CỐT LÕI (CORE BUSINESS LOGIC)
Yêu cầu tất cả thành viên (đặc biệt là Backend) nắm rõ phần này.
2.1. Quản lý Sản phẩm & Giá bán
Giá niêm yết cố định: Giá bán (selling_price) được lưu cố định tại bảng products. Website hiển thị giá này cho khách hàng.
Đơn vị & Thành phần: Lưu dưới dạng text đơn giản (VD: Chai, Tuýp, Hộp).
Không bắt buộc kê đơn: Khách hàng mua sắm tự do.
2.2. Quản lý Tồn kho & Thuật toán FEFO
Quản lý theo lô (Batches): Tồn kho không nằm chung ở sản phẩm, mà được quản lý chi tiết qua từng lần nhập hàng (Bảng product_batches). Mỗi lô có Số lô, Ngày SX, Hạn SD và Số lượng tồn riêng.
Thuật toán xuất kho FEFO (First Expire, First Out): * Khi khách đặt hàng, Backend bắt buộc phải chạy thuật toán quét các lô hàng của sản phẩm đó.
Lô nào có expiry_date gần nhất sẽ bị trừ số lượng trước. Nếu lô đó không đủ số lượng khách mua, tiếp tục trừ sang lô có hạn sử dụng gần thứ 2.
Ví dụ: Khách mua 5 chai. Kho có Lô A (còn 2 chai, hạn T6/2026) và Lô B (còn 10 chai, hạn T12/2026). Backend tự động xuất 2 chai lô A và 3 chai lô B.
2.3. Luồng Giỏ hàng (Hybrid Cart)
Áp dụng cơ chế lai để tối ưu hiệu suất Database:
Khách vãng lai (Chưa đăng nhập): Frontend (Vue) lưu giỏ hàng hoàn toàn dưới Local Storage hoặc State. Không gọi API xuống Backend khi khách thêm/sửa/xóa sản phẩm trong giỏ.
Bắt buộc Đăng nhập: Khách phải Login mới được Checkout.
Đồng bộ (Sync): Ngay khi Login thành công, Frontend lấy giỏ hàng dưới Local Storage bắn 1 API (POST /api/carts/sync) lên Backend để lưu vào Database. Sau đó Frontend xóa giỏ hàng ở Local Storage.
Sau khi Đăng nhập: Mọi thao tác thêm/sửa/xóa giỏ hàng đều gọi API lưu trực tiếp vào Database.
2.4. Luồng Đặt hàng (Checkout)
Khi đơn hàng tạo thành công (status: pending), hệ thống phải copy cứng selling_price từ bảng products vào unit_price của bảng order_details. Việc này đảm bảo nếu sau này Admin đổi giá sản phẩm, tổng tiền của các hóa đơn cũ không bị thay đổi.
Lưu vết xuất kho vào bảng order_batch_allocations để Thủ kho biết chính xác cần nhặt hàng từ lô nào.
3. THIẾT KẾ CƠ SỞ DỮ LIỆU (SCHEMA 3NF)
3.1. Nhóm Dữ liệu Nền tảng (Master Data)
users: id, name, email, password, phone, address (1 địa chỉ duy nhất), role (admin, warehouse, customer).
categories: id, name, slug, image_url.
products: id, category_id, name, slug, unit, manufacturer, active_ingredients, description, image_url, selling_price (Giá niêm yết).
3.2. Nhóm Quản lý Kho (Inventory)
product_batches: id, product_id, batch_number, manufacturing_date, expiry_date (Dùng cho FEFO), import_price, stock (Tồn kho của lô này).
3.3. Nhóm Giỏ hàng (Cart - Dành cho User đã login)
carts: id, user_id, created_at.
cart_items: id, cart_id, product_id, quantity.
3.4. Nhóm Đơn hàng (Orders)
orders: id, user_id, order_code, total_amount, status (pending, confirmed, shipping, completed, cancelled), created_at.
order_details: id, order_id, product_id, quantity, unit_price (Copy từ products), subtotal.
order_batch_allocations: id, order_detail_id, product_batch_id, allocated_quantity (Bảng này cực kỳ quan trọng, ghi nhận kết quả của thuật toán FEFO).
4. PHÂN CHIA NHIỆM VỤ CHI TIẾT (TASKS)
💻 TEAM BACKEND (Laravel)
Thiết lập Base: Viết Migration, Models, Relationships (Eloquent) cho toàn bộ schema.
Auth & Phân quyền: Viết API Login/Register (dùng Laravel Sanctum/Passport), middleware check Role (admin, warehouse, customer).
API Storefront (Public): * GET danh sách sản phẩm, chi tiết sản phẩm, danh mục (có phân trang, filter theo tên/danh mục).
API Cart (Yêu cầu Login):
POST /api/carts/sync (Nhận mảng giỏ hàng từ Frontend và lưu DB).
GET, POST, PUT, DELETE item trong DB.
API Đơn hàng & Thuật toán:
Viết Service xử lý thuật toán FEFO trừ kho khi nhận Request tạo Order.
Rollback lại kho nếu đơn hàng bị Cancelled.
API Admin/Warehouse: CRUD sản phẩm, nhập lô hàng mới, đổi trạng thái đơn hàng.
🎨 TEAM FRONTEND (Vue.js)
Thiết lập Base: Khởi tạo project, cấu hình Router, Axios, Pinia/Vuex. Set up layout tĩnh.
Quản lý State Giỏ hàng:
Viết logic xử lý giỏ hàng Guest lưu ở Local Storage.
Viết logic đồng bộ (Sync) giỏ hàng gọi API ngay sau khi Login thành công.
Giao diện Storefront (Khách hàng): * Trang chủ (Danh sách SP), Trang chi tiết SP, Trang Giỏ hàng.
Form Đăng nhập/Đăng ký.
Trang Checkout và Trang lịch sử đơn hàng.
Giao diện Admin / Warehouse:
Màn hình thêm/sửa sản phẩm.
Màn hình nhập hàng (Tạo Lô mới).
Màn hình xem danh sách Đơn hàng, xem chi tiết để Thủ kho đi nhặt hàng (hiển thị rõ xuất từ lô nào).
5. THỎA THUẬN KỸ THUẬT (TECHNICAL AGREEMENTS)
Response Format: Thống nhất format JSON trả về từ Backend. Ví dụ:
{
    "success": true,
    "message": "Lấy dữ liệu thành công",
    "data": { ... }
}


Git Workflow: * Bắt buộc rẽ nhánh (branch) khi code tính năng mới (VD: feature/cart, feature/fefo-algorithm).
Tạo Pull Request và phải có 1 người review trước khi merge vào nhánh main hoặc develop.
Môi trường (Environment): Thống nhất file .env mẫu để cả team cấu hình DB giống nhau ở local.

