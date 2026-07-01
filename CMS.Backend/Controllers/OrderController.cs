using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // Thêm thư viện này để dùng Include
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Authorize(AuthenticationSchemes = "AdminScheme")]
    public class OrderController : Controller
    {
        private readonly ApplicationDbContext _context;

        public OrderController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. Action hiển thị danh sách đơn hàng
        public IActionResult Index()
        {
            // Thêm .Include(o => o.Customer) để lấy thông tin khách hàng nếu cần hiển thị tên
            var orders = _context.Orders
                                 .Include(o => o.Customer)
                                 .Include(o => o.OrderDetails)
                                 .OrderByDescending(o => o.OrderDate)
                                 .ToList();
            return View(orders);
        }

        // 2. Action XÁC NHẬN ĐƠN HÀNG (Đổi Status từ 0 -> 1)
        public IActionResult Confirm(int id)
        {
            var order = _context.Orders.Find(id);
            if (order != null && order.Status == 0) // Chỉ xác nhận đơn đang "Chờ xác nhận"
            {
                order.Status = 1; // Chuyển sang "Đang xử lý"
                _context.SaveChanges();
                TempData["Success"] = $"Đã xác nhận đơn hàng #{order.Id} thành công!";
            }
            return RedirectToAction("Index");
        }

        // 3. Action SỬA ĐƠN HÀNG (Dùng để Admin cập nhật trạng thái Giao hàng hoặc Ghi chú)
        [HttpGet]
        public IActionResult Edit(int? id)
        {
            if (id == null) return NotFound();

            var order = _context.Orders.Find(id);
            if (order == null) return NotFound();

            return View(order);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(int id, [Bind("Id,Status,Notes")] Order order)
        {
            var orderInDb = _context.Orders.Find(id);
            if (orderInDb == null) return NotFound();

            // Chỉ cho phép admin cập nhật Trạng thái và Ghi chú
            orderInDb.Status = order.Status;
            orderInDb.Notes = order.Notes;

            _context.SaveChanges();
            TempData["Success"] = $"Cập nhật đơn hàng #{id} thành công!";
            return RedirectToAction(nameof(Index));
        }

        // 4. Action XÓA ĐƠN HÀNG
        public IActionResult Delete(int id)
        {
            var order = _context.Orders.Find(id);
            if (order != null)
            {
                _context.Orders.Remove(order);
                _context.SaveChanges();
                TempData["Success"] = $"Đã xóa đơn hàng #{id}!";
            }
            return RedirectToAction("Index");
        }
    }
}