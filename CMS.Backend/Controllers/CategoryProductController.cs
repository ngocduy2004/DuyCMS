using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
// using CMS.Data; // Thay bằng namespace chứa ApplicationDbContext của bạn

namespace CMS.Controllers
{
    public class CategoryProductController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CategoryProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: CategoriesProducts
        public async Task<IActionResult> Index()
        {
            // Lấy danh sách danh mục và Include cả danh sách Products liên quan
            var categories = await _context.CategoryProducts
                                           .Include(c => c.Products)
                                           .ToListAsync();
            return View(categories);
        }

        // GET: CategoriesProducts/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var categoryProduct = await _context.CategoryProducts
                                                .Include(c => c.Products)
                                                .FirstOrDefaultAsync(m => m.Id == id);

            if (categoryProduct == null)
            {
                return NotFound();
            }

            return View(categoryProduct);
        }

        // GET: CategoriesProducts/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: CategoriesProducts/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,Name,Description")] CategoryProduct categoryProduct)
        {
            // ModelState.IsValid sẽ tự động kiểm tra [Required] và [StringLength] từ Model
            if (ModelState.IsValid)
            {
                _context.Add(categoryProduct);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(categoryProduct);
        }
    }
}