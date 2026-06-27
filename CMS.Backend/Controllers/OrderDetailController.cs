using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // Bắt buộc phải có để dùng Include
using CMS.Data;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class OrderDetailController : Controller
    {
        private readonly ApplicationDbContext _context;

        public OrderDetailController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Action hiển thị danh sách chi tiết đơn hàng
        public IActionResult Index()
        {
            // Dùng Include để kết nối (JOIN) bảng OrderDetail với bảng Product
            var orderDetails = _context.OrderDetails
                                       .Include(od => od.Product) // Lấy thông tin Sản phẩm
                                       .OrderByDescending(od => od.OrderId) // Nhóm các món của cùng 1 đơn ở gần nhau
                                       .ToList();
            return View(orderDetails);
        }

        // GET: Order/Details/5
        public IActionResult Details(int? id)
        {
            if (id == null) return NotFound();

            // 💡 KỸ THUẬT QUAN TRỌNG: 
            // Lấy Đơn hàng -> JOIN sang bảng Customer -> JOIN sang bảng OrderDetails -> JOIN tiếp sang bảng Product
            var order = _context.Orders
                                .Include(o => o.Customer)
                                .Include(o => o.OrderDetails)
                                    .ThenInclude(od => od.Product) // Nạp sâu thông tin sản phẩm của từng dòng chi tiết
                                .FirstOrDefault(o => o.Id == id);

            if (order == null) return NotFound();

            return View(order);
        }
    }
}