using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrdersController(ApplicationDbContext context) => _context = context;

        [HttpGet]
        public IActionResult GetAll()
        {
            var orders = _context.Orders
                .OrderByDescending(o => o.Id)
                .Select(o => new {
                    o.Id,
                    CustomerName = o.Customer.FullName, // Lấy tên người đặt
                    // o.OrderDate,
                    // o.TotalAmount,
                    // o.Status
                })
                .ToList();
            return Ok(orders);
        }

        // Lấy danh sách đơn hàng theo ID khách hàng
        [HttpGet("customer/{customerId}")]
        public IActionResult GetByCustomer(int customerId)
        {
            var orders = _context.Orders
                .Where(o => o.CustomerId == customerId)
                .OrderByDescending(o => o.Id)
                .ToList();
            return Ok(orders);
        }

        [HttpGet("{id}")]
        public IActionResult GetDetail(int id)
        {
            var order = _context.Orders.FirstOrDefault(o => o.Id == id);
            if (order == null) return NotFound(new { message = "Không tìm thấy đơn hàng" });

            return Ok(order);
        }
    }
}