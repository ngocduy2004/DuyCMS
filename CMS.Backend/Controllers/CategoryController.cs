using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using System.Linq;

namespace CMS.Backend.Controllers
{
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
    }
}