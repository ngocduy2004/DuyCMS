using CMS.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace CMS.Backend.Controllers
{
  
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CategoriesController(ApplicationDbContext context) => _context = context;

        [HttpGet]
        public IActionResult GetAll()
        {
            var categories = _context.Categories
                .Select(c => new {
                    c.Id,
                    c.Name,
                    TotalPosts = c.Posts.Count() // Đếm số lượng bài viết
                })
                .ToList();
            return Ok(categories);
        }

        [HttpGet("{id}")]
        public IActionResult GetDetail(int id)
        {
            var category = _context.Categories.FirstOrDefault(c => c.Id == id);
            if (category == null) return NotFound(new { message = "Không tìm thấy danh mục bài viết" });

            return Ok(category);
        }
    }
}