using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Linq;

namespace CMS.Backend.Controllers
{
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
        // THÊM ĐOẠN NÀY ĐỂ FIX LỖI "THÊM KHÔNG ĐƯỢC"
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(Product product)
        {
            if (ModelState.IsValid)
            {
                _context.Products.Add(product);
                _context.SaveChanges();
                return RedirectToAction(nameof(Index));
            }

            // Nếu lưu thất bại (VD: bỏ trống ô bắt buộc), phải nạp lại danh sách danh mục trước khi trả về View
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
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(Product product)
        {
            if (ModelState.IsValid)
            {
                _context.Products.Update(product);
                _context.SaveChanges();
                return RedirectToAction(nameof(Index));
            }

            // Load lại danh sách danh mục nếu nhập lỗi
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
                _context.Products.Remove(product);
                _context.SaveChanges();
            }
            return RedirectToAction(nameof(Index));
        }
    }
}