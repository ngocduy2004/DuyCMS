using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CustomersController(ApplicationDbContext context) => _context = context;

        [HttpGet]
        public IActionResult GetAll()
        {
            var customers = _context.Customers
                .OrderByDescending(c => c.Id)
                .Select(c => new {
                    c.Id,
                    c.FullName,
                    c.Email,
                    c.Phone,
                    c.Address
                })
                .ToList();
            return Ok(customers);
        }

        [HttpGet("{id}")]
        public IActionResult GetDetail(int id)
        {
            var customer = _context.Customers.FirstOrDefault(c => c.Id == id);
            if (customer == null) return NotFound(new { message = "Không tìm thấy khách hàng" });

            // Chú ý: Không trả về Password ra ngoài API để bảo mật
            return Ok(new
            {
                customer.Id,
                customer.FullName,
                customer.Email,
                customer.Phone,
                customer.Address
            });
        }


    }
}