using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Controllers
{
    [Authorize(AuthenticationSchemes = "AdminScheme")]
    public class CategoryProductController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CategoryProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. DANH SÁCH (READ)
        public async Task<IActionResult> Index()
        {
            var categories = await _context.CategoryProducts
                                           .Include(c => c.Products)
                                           .ToListAsync();
            return View(categories);
        }

        // 2. CHI TIẾT (DETAILS)
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null) return NotFound();

            var categoryProduct = await _context.CategoryProducts
                                                .Include(c => c.Products)
                                                .FirstOrDefaultAsync(m => m.Id == id);

            if (categoryProduct == null) return NotFound();

            return View(categoryProduct);
        }

        // 3. THÊM MỚI (CREATE)
        public IActionResult Create() => View();

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,Name,Description")] CategoryProduct categoryProduct)
        {
            if (ModelState.IsValid)
            {
                _context.Add(categoryProduct);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(categoryProduct);
        }

        // 4. SỬA (EDIT)
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null) return NotFound();
            var category = await _context.CategoryProducts.FindAsync(id);
            if (category == null) return NotFound();
            return View(category);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,Name,Description")] CategoryProduct categoryProduct)
        {
            if (id != categoryProduct.Id) return NotFound();

            if (ModelState.IsValid)
            {
                _context.Update(categoryProduct);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(categoryProduct);
        }

        // 5. XÓA TRỰC TIẾP (DELETE - KHÔNG CẦN FORM XÁC NHẬN)
        public async Task<IActionResult> Delete(int id)
        {
            var categoryProduct = await _context.CategoryProducts.FindAsync(id);
            if (categoryProduct != null)
            {
                _context.CategoryProducts.Remove(categoryProduct);
                await _context.SaveChangesAsync();
            }
            return RedirectToAction(nameof(Index));
        }
    }
}