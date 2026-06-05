using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CategoryProductsController(ApplicationDbContext context) => _context = context;

        [HttpGet]
        public IActionResult GetAll()
        {
            var categories = _context.CategoryProducts
                .Select(c => new {
                    c.Id,
                    c.Name,
                    c.Description,
                    TotalProducts = c.Products.Count() // Đếm số lượng sản phẩm trong danh mục
                })
                .ToList();
            return Ok(categories);
        }

        [HttpGet("{id}")]
        public IActionResult GetDetail(int id)
        {
            var category = _context.CategoryProducts.FirstOrDefault(c => c.Id == id);
            if (category == null) return NotFound(new { message = "Không tìm thấy danh mục sản phẩm" });

            return Ok(category);
        }
    }
}