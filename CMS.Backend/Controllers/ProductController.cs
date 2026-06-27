using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authorization; // Cần thêm namespace này
using Microsoft.AspNetCore.Http; // Thêm thư viện để dùng IFormFile
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using System;
using System.IO; // Thêm thư viện xử lý file/thư mục
using System.Linq;
using System.Threading.Tasks; // Thêm thư viện để dùng async/await


namespace CMS.Backend.Controllers
{
    [Authorize(AuthenticationSchemes = "AdminScheme")]
    public class ProductController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ProductController(ApplicationDbContext context) => _context = context;

        // --- DANH SÁCH ---
        public IActionResult Index() => View(_context.Products.ToList());

        // ==========================================
        // THÊM MỚI (CREATE)
        // ==========================================

        // GET: Hiển thị form thêm mới
        public IActionResult Create()
        {
            // Lấy danh sách Category truyền sang View để làm thẻ <select>
            ViewBag.CategoryList = new SelectList(_context.CategoryProducts, "Id", "Name");
            return View();
        }

        // POST: Nhận dữ liệu từ form và lưu vào SQL
        // ĐÃ CẬP NHẬT: Thêm IFormFile ImageFile và async/await để xử lý upload ảnh
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Product product, IFormFile ImageFile)
        {
            if (ModelState.IsValid)
            {
                // KIỂM TRA VÀ LƯU FILE ẢNH
                if (ImageFile != null && ImageFile.Length > 0)
                {
                    // 1. Chỉ định đường dẫn lưu file trong wwwroot
                    var uploadDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "products");

                    // Tạo thư mục nếu chưa tồn tại
                    if (!Directory.Exists(uploadDir))
                    {
                        Directory.CreateDirectory(uploadDir);
                    }

                    // 2. Tạo tên file ngẫu nhiên (tránh trùng tên)
                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(ImageFile.FileName);
                    var filePath = Path.Combine(uploadDir, fileName);

                    // 3. Copy file từ request vào server
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await ImageFile.CopyToAsync(stream);
                    }

                    // 4. Gán đường dẫn vào model để lưu xuống Database
                    product.ImageUrl = "/images/products/" + fileName;
                }

                _context.Products.Add(product);
                await _context.SaveChangesAsync(); // Dùng SaveChangesAsync
                return RedirectToAction(nameof(Index));
            }

            // Nếu lưu thất bại, nạp lại danh sách danh mục trước khi trả về View
            ViewBag.CategoryList = new SelectList(_context.CategoryProducts, "Id", "Name", product.CategoryProductId);
            return View(product);
        }

        // ==========================================
        // SỬA (EDIT)
        // ==========================================

        // GET: Hiển thị form sửa kèm dữ liệu cũ
        public IActionResult Edit(int id)
        {
            var product = _context.Products.Find(id);
            if (product == null) return NotFound();

            // Phải có ViewBag này thì dropdown mới hiện ra danh mục đang được chọn
            ViewBag.CategoryList = new SelectList(_context.CategoryProducts, "Id", "Name", product.CategoryProductId);
            return View(product);
        }

        // POST: Nhận dữ liệu mới và cập nhật
        // POST: Nhận dữ liệu mới và cập nhật
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(Product product, IFormFile ImageFile)
        {
            // 🚨 THÊM CÁC DÒNG NÀY ĐỂ BỎ QUA KIỂM TRA LỖI CÁC BẢNG LIÊN KẾT
            ModelState.Remove("ProductCategory"); // Tên biến liên kết đến bảng Category trong class Product
            ModelState.Remove("OrderDetails");    // Tên biến liên kết đến bảng OrderDetail (nếu có)
            ModelState.Remove("ImageFile");       // Bỏ qua lỗi bắt buộc phải có file ảnh

            // Nếu bạn có thuộc tính tên khác, cứ thêm ModelState.Remove("TênThuộcTính"); vào đây

            if (ModelState.IsValid)
            {
                // 1. Kiểm tra xem người dùng có tải ảnh mới lên không
                if (ImageFile != null && ImageFile.Length > 0)
                {
                    var uploadDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "products");

                    if (!Directory.Exists(uploadDir))
                    {
                        Directory.CreateDirectory(uploadDir);
                    }

                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(ImageFile.FileName);
                    var filePath = Path.Combine(uploadDir, fileName);

                    // Lưu file mới vào server
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await ImageFile.CopyToAsync(stream);
                    }

                    // Cập nhật lại đường dẫn ảnh mới cho Product
                    product.ImageUrl = "/images/products/" + fileName;
                }

                // Cập nhật vào DB
                _context.Products.Update(product);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }

            // Load lại danh mục nếu Form có lỗi khác
            ViewBag.CategoryList = new SelectList(_context.CategoryProducts, "Id", "Name", product.CategoryProductId);
            return View(product);
        }

        // ==========================================
        // XÓA (DELETE)
        // ==========================================
        public IActionResult Delete(int id)
        {
            var product = _context.Products.Find(id);
            if (product != null)
            {
                // Tuỳ chọn: Bạn có thể thêm code xóa file ảnh vật lý trong thư mục wwwroot ở đây nếu muốn dọn rác
                _context.Products.Remove(product);
                _context.SaveChanges();
            }
            return RedirectToAction(nameof(Index));
        }

        [AllowAnonymous]
        public IActionResult Details(int id)
        {
            // Tìm sản phẩm theo Id, kèm theo thông tin Danh mục
            var product = _context.Products
                                  .Include(p => p.ProductCategory)
                                  .FirstOrDefault(p => p.Id == id);

            // Nếu người dùng gõ sai Id hoặc sản phẩm đã bị xóa
            if (product == null)
            {
                return RedirectToAction("Index", "Home");
            }

            // Trả về View cùng với dữ liệu sản phẩm tìm được
            return View(product);
        }
    }
}