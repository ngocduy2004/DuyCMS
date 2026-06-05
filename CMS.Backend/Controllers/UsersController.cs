using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context) => _context = context;

        [HttpGet]
        public IActionResult GetAll()
        {
            var users = _context.Users
                .Select(u => new {
                    u.Id,
                    // Liệt kê các trường User của bạn (VD: Username, Email, Role...)
                    // Tránh Select Password
                })
                .ToList();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public IActionResult GetDetail(int id)
        {
            var user = _context.Users.FirstOrDefault(u => u.Id == id);
            if (user == null) return NotFound(new { message = "Không tìm thấy người dùng" });

            return Ok(user);
        }
    }
}