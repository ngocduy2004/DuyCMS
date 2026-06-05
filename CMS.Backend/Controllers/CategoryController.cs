using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using Microsoft.AspNetCore.Authorization; // Cần thêm namespace này

namespace CMS.Backend.Controllers
{
    

    [Authorize] // Bắt buộc phải đăng nhập mới được vào các hàm bên dưới
    public class CategoryController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Tiêm DbContext vào Constructor để kết nối Database máy nhà
        public CategoryController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Action hiển thị danh sách bài tập 3
        public IActionResult Index()
        {
            // Thay .Categories bằng tên thuộc tính DbSet tương ứng trong DbContext của bạn (ví dụ: CategoriesProducts)
            var categories = _context.Categories.ToList();
            return View(categories);
        }

        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        // 2. Hàm POST: Dùng để đón dữ liệu từ Form gửi lên và lưu vào SQL
        [HttpPost]
        public IActionResult Create(Category model)
        {
            // BƯỚC 1: Thêm dữ liệu vào bộ nhớ tạm của Entity Framework
            _context.Categories.Add(model);

            // BƯỚC 2: Ra lệnh cho hệ thống ghi dữ liệu thật sự vào SQL Server
            _context.SaveChanges();

            // Sau khi lưu thành công, tự động quay về trang danh sách
            return RedirectToAction("Index");
        }

        // ==========================================
        // 2. CHỨC NĂNG XÓA (DELETE)
        // ==========================================

        // Hàm xóa trực tiếp dựa theo đúng logic bạn cung cấp
        public IActionResult Delete(int id)
        {
            // Bước 1: Tìm đối tượng trong Database bằng Id
            var product = _context.Products.Find(id);

            // Kiểm tra nếu tìm thấy thì mới xóa
            if (product != null)
            {
                // Bước 2: Xóa khỏi bộ nhớ tạm
                _context.Products.Remove(product);

                // Bước 3: Chốt phiên làm việc, xóa thực sự trong SQL Server
                _context.SaveChanges();
            }

            // Sau khi xóa xong, quay lại trang danh sách
            return RedirectToAction("Index");
        }

        [HttpGet]
        public IActionResult Edit(int id)
        {
            // Tìm danh mục trong Database theo Id [cite: 348, 350]
            var category = _context.Categories.Find(id);

            if (category == null) return NotFound();

            return View(category); // Gửi đối tượng tìm được sang giao diện Edit
        }

        [HttpPost]
        public IActionResult Edit(Category model)
        {
            // Lệnh cập nhật đối tượng vào bộ nhớ tạm
            _context.Categories.Update(model);

            // Lưu thay đổi thực sự xuống SQL Server [cite: 504, 509]
            _context.SaveChanges();

            // Quay lại trang danh sách để xem kết quả
            return RedirectToAction("Index");
        }
    }
}