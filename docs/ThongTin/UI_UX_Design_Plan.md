# KẾ HOẠCH THIẾT KẾ GIAO DIỆN (UI/UX) - WEB DƯỢC MỸ PHẨM

Website thương mại điện tử chuyên phân phối dược phẩm, mỹ phẩm da liễu với định hướng chuyên nghiệp, sạch sẽ, đáng tin cậy. Giao diện được lấy cảm hứng từ các hệ thống nhà thuốc lớn như Long Châu, Pharmacity, An Khang.

## 1. Phong cách thiết kế (Design Guidelines)

### 1.1. Bảng màu (Color Palette)
- **Màu chủ đạo (Primary):** Xanh lam y tế (`#005B96` hoặc `#1A73E8`) 
  *Ứng dụng: Header, các nút hành động chính (Primary CTA), tiêu đề phần tử quan trọng.*
- **Màu phụ đạo (Secondary / Warning):** Cam sáng (`#FF7A00`) hoặc Đỏ (`#E53935`)
  *Ứng dụng: Giá khuyến mãi, Nhãn "Sắp hết hạn" (Alert kho), Các nút "Mua ngay".*
- **Màu nền (Background):** 
  - Nền trang chính: Xám rất nhạt (`#F5F7FA`) để làm nổi bật các Card sản phẩm màu trắng.
  - Nền Container/Card: Trắng tinh (`#FFFFFF`).
- **Màu Text:**
  - Tiêu đề & Text chính: Xám đen (`#333333` hoặc `#1F2937`).
  - Text phụ/Mô tả: Xám nhạt hơn (`#6B7280`).
  - Đường viền (Border): Xám bạc (`#E5E7EB`).

### 1.2. Typography
- **Font chữ:** `Inter` hoặc `Roboto`. Đây là các font chữ không chân, cực kì dễ đọc ở kích thước nhỏ gọn và mang lại cảm giác công nghệ, sạch sẽ.
- **Kích thước:**
  - H1/H2 (Tiêu đề Section): `24px - 28px`, Font-weight: `700`.
  - Body Text: `14px - 16px`, Font-weight: `400`.
  - Giá sản phẩm: `18px`, Font-weight: `700`, Màu Primary hoặc Red.

### 1.3. Tiêu chuẩn Kỹ thuật (Technical Aesthetic)
- **Yêu cầu Icon:** **KHÔNG SỬ DỤNG** thư viện Icon font (như FontAwesome, Boxicons...). Bắt buộc sử dụng **Inline SVG** hoặc **SVG File** để:
  1. Tối ưu Header request (performance).
  2. Canvas rendering sắc nét trên mọi thiết bị.
  3. Dễ dàng đổi màu hover qua CSS fill/stroke.
- **Bo góc (Border Radius):** 
  - Nút bấm (Button): `8px`.
  - Card Sản phẩm: `12px`.
  - Banner: `16px` đến `24px`.
- **Đổ bóng (Shadow):**
  - Mặc định cho Card: Mờ nhẹ và tinh tế `box-shadow: 0 1px 3px rgba(0,0,0,0.05);`.
  - Khi Hover (tương tác): Sâu hơn một chút để nổi bật `box-shadow: 0 4px 12px rgba(0,0,0,0.1);`.

---

## 2. Cấu trúc Layout các trang cốt lõi

### 2.1. Trang chủ (Trang khách hàng - Storefront)
- **Header:**
  - *Top bar:* Thông báo khuyến mãi hoặc Hotline.
  - *Main header:* Logo bên trái, Thanh tìm kiếm cực lớn (Mega Search Bar) ở giữa, Module Cá nhân (SVG icon user) và Giỏ hàng (SVG Cart có Badge số lượng) bên phải.
  - *Bottom header:* Menu danh mục ngang (Thực phẩm chức năng, Dược mỹ phẩm, Chăm sóc cá nhân...).
- **Hero Banner:** Carousel trượt các khuyến mãi chính.
- **Flash Sale (Nếu có):** Khung đếm ngược, hiển thị danh sách sản phẩm trượt ngang (Horizontal Scroll).
- **Danh mục nổi bật:** Các box tròn hoặc vuông chứa SVG minh hoạ cho các nhóm bệnh/mục đích chăm sóc (VD: Trị mụn, Trị nám, Chống lão hoá...).
- **Danh sách Sản phẩm (Sản phẩm mới / Dược mỹ phẩm HOT):**
  - Grid 4-5 cột trên Desktop, 2 cột trên Mobile.
- **Footer:** Chứa thông tin liên hệ, chính sách bảo mật, chứng nhận đại lý, phương thức thanh toán.

### 2.2. Product Card (Thẻ sản phẩm)
Thành phần quan trọng bậc nhất, cần tối ưu:
- Hình ảnh vuông, nền trắng, có đệm `padding`.
- Nhãn (Badge): Gắn nhãn giảm giá `-20%`, hoặc nhãn thương hiệu uy tín.
- Tên Brand (Nhỏ, xám).
- Tên sản phẩm (Giới hạn hiển thị 2 dòng - `line-clamp: 2`).
- Giá hiển thị, Giá gốc (strikethrough).
- Nút bấm thêm vào giỏ hàng: Nút hình vuông chứa **SVG giỏ hàng** hoặc nút dài "Chọn mua", hiện rõ lên khi hover.

### 2.3. Trang Chi Tiết Sản Phẩm (Product Detail)
- **Cột trái:** Hình ảnh sản phẩm (có slider cho nhiều hình).
- **Cột phải:** 
  - Tên, SKU, Thương hiệu.
  - Giá và các chương trình khuyến mãi.
  - Chọn số lượng (Input +/-).
  - Nút Hành động khối lượng lớn: "Thêm vào giỏ" và "Mua ngay".
- **Phân dưới:** Tabs nội dung gồm: Mô tả chi tiết, Thành phần, Hướng dẫn sử dụng.

### 2.4. Khung Giỏ Làng (Cart Drawer / Cart Page)
- Ứng dụng Hybrid Cart: Dùng Slide-out Drawer (Giỏ hàng trượt ra từ bên cạnh) để người dùng xem nhanh mà không cần rời trang chủ. Nếu muốn tính tiền (Checkout) thì chuyển hướng sang '/checkout'.
- Hiển thị danh sách item: Hình nhỏ, tên, giá, nút tăng giảm.

### 2.5. Trang Admin / Quản lý kho (Dashboard)
- Giao diện dạng **Sidebar Layout**.
- Sidebar bên trái chứa các menu: Tổng quan, Sản phẩm, Lô hàng (Batches), Đơn hàng, Quản lý tài khoản.
- Header: Menu User & Thông báo (Alert cảnh báo cạn kho, cảnh báo lô sắp hết hạn dùng tới màu cam/đỏ).
- Bảng dữ liệu (Data Table): Trình bày dữ liệu cực kỳ sạch sẽ, có phân trang, bộ lọc (filter theo tên, khoảng giới hạn date cho Date picker của expiry_date).

---

## 3. Chiến lược triển khai Code UX/UI (Vue.js + Tailwind / Vanilla CSS)
- Cấu trúc Component: Xây dựng sẵn các shared components: `<Button>`, `<BaseInput>`, `<ProductCard>`, `<Modal>`.
- **Quản lý SVG:** Khuyến nghị tạo một component chuyên wrapper SVG như `<SvgIcon name="cart" />` (Bên trong switch-case trả ra thẻ `<svg>` code nguyên bản của icon đó để dễ sử dụng lại ở mọi nơi). Không cần load bất kỳ font file nào.

---
*Lưu ý: Thiết kế này được tối ưu sẵn nhằm giúp dễ dàng tích hợp được logic FEFO phía sau (như việc trên Admin sẽ có màu đỏ nổi bật cho các lô dược mỹ phẩm sắp hết hạn để ưu tiên bán).*
