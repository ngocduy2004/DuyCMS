using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class OrderController : Controller
    {
        private readonly ApplicationDbContext _context;

        public OrderController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Action hiển thị danh sách đơn hàng
        public IActionResult Index()
        {
            var orders = _context.Orders.ToList();
            return View(orders);
        }
    }
}