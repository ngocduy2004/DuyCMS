// src/Controllers/OrdersController.cs
using CMS.Data;
using CMS.Data.Entities;
using CMS.Backend.Services; // 🚨 ĐÃ BỔ SUNG: Để gọi được lớp EmailService
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly EmailService _emailService; // 🚨 ĐÃ BỔ SUNG: Khai báo Service gửi Email chung
        private const string CustomerScheme = "CustomerScheme";

        // Khởi tạo constructor đồng bộ giống như bên Admin OrderController của bạn
        public OrdersController(ApplicationDbContext context)
        {
            _context = context;
            _emailService = new EmailService(); // Khởi tạo instance cho EmailService
        }

        [HttpGet]
        [Authorize(AuthenticationSchemes = "AdminScheme")]
        public async Task<IActionResult> GetAll()
        {
            var orders = await _context.Orders
                .Include(o => o.Customer)
                .OrderByDescending(o => o.Id)
                .Select(o => new {
                    o.Id,
                    CustomerName = o.Customer != null ? o.Customer.FullName : "Khách vô danh",
                    o.OrderDate,
                    o.Status
                }).ToListAsync();
            return Ok(orders);
        }

        [HttpGet("my-orders")]
        [Authorize(AuthenticationSchemes = CustomerScheme)]
        public async Task<IActionResult> GetMyOrders()
        {
            var customerIdClaim = User.FindFirst("CustomerId")?.Value;
            int customerId = int.Parse(customerIdClaim);

            var orders = await _context.Orders
                .Where(o => o.CustomerId == customerId)
                .OrderByDescending(o => o.OrderDate)
                .Select(o => new {
                    o.Id,
                    o.OrderDate,
                    o.Status,
                    o.Notes,
                    OrderDetails = o.OrderDetails.Select(d => new {
                        d.Quantity,
                        d.UnitPrice,
                        ProductName = d.Product != null ? d.Product.Name : "Sản phẩm đã xóa",
                        ImageUrl = d.Product != null ? d.Product.ImageUrl : ""
                    })
                }).ToListAsync();

            return Ok(orders);
        }

        [HttpPost("checkout")]
        [Authorize(AuthenticationSchemes = CustomerScheme)]
        public async Task<IActionResult> Checkout([FromBody] CheckoutRequest request)
        {
            var customerIdClaim = User.FindFirst("CustomerId")?.Value;
            int currentCustomerId = int.Parse(customerIdClaim);

            if (request.CartItems == null || request.CartItems.Count == 0)
                return BadRequest(new { message = "Giỏ hàng đang trống!" });

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var newOrder = new Order
                {
                    CustomerId = currentCustomerId,
                    OrderDate = DateTime.Now,
                    Status = 0,
                    Notes = request.Notes
                };

                _context.Orders.Add(newOrder);
                await _context.SaveChangesAsync();

                decimal totalAmount = 0; // Tính tổng tiền đơn hàng

                foreach (var item in request.CartItems)
                {
                    var product = await _context.Products.FindAsync(item.ProductId);
                    if (product == null) return BadRequest(new { message = $"Sản phẩm {item.ProductId} không tồn tại." });

                    if (product.StockQuantity < item.Quantity)
                        return BadRequest(new { message = $"Sản phẩm '{product.Name}' không đủ hàng." });

                    var detail = new OrderDetail
                    {
                        OrderId = newOrder.Id,
                        ProductId = item.ProductId,
                        Quantity = item.Quantity,
                        UnitPrice = product.Price
                    };
                    _context.OrderDetails.Add(detail);

                    product.StockQuantity -= item.Quantity;
                    totalAmount += (item.Quantity * product.Price);
                    _context.Products.Update(product);
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                // ====================================================================
                // 📧 ĐÃ SỬA ĐỔI: GỬI EMAIL THÔNG QUA EMAILSERVICE (CHẠY ĐỒNG BỘ THREAD NGẦM)
                // ====================================================================
                var customer = await _context.Customers.FindAsync(currentCustomerId);
                if (customer != null && !string.IsNullOrEmpty(customer.Email))
                {
                    // Chạy thread ngầm để trả phản hồi 201 ngay lập tức lên màn hình ReactJS, không bắt khách hàng chờ đợi
                    _ = Task.Run(() => BuildAndSendCheckoutEmail(customer, newOrder, request, totalAmount));
                }

                return StatusCode(201, new { message = "Đặt hàng thành công! Đã gửi email xác nhận.", orderId = newOrder.Id });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "Lỗi hệ thống", error = ex.Message });
            }
        }

        // ====================================================================
        // 🛠️ HÀM HỖ TRỢ XÂY DỰNG GIAO DIỆN VÀ ĐẨY QUA EMAILSERVICE GỬI ĐI
        // ====================================================================
        private async Task BuildAndSendCheckoutEmail(Customer customer, Order order, CheckoutRequest request, decimal totalAmount)
        {
            try
            {
                // 🚨 Thuật toán phòng vệ chặn lỗi cắt chuỗi (Split) khi test Postman dữ liệu tùy ý
                string deliveryNote = "Không có ghi chú đặc biệt";
                string phoneReceive = "Chưa cung cấp";

                if (!string.IsNullOrEmpty(request.Notes) && request.Notes.Contains("|"))
                {
                    var parts = request.Notes.Split('|');
                    if (parts.Length > 0) deliveryNote = parts[0].Replace("Ghi chú: ", "").Trim();
                    if (parts.Length > 2) phoneReceive = parts[2].Replace("SĐT: ", "").Trim();
                }
                else if (!string.IsNullOrEmpty(request.Notes))
                {
                    deliveryNote = request.Notes;
                }

                string subject = $"[Solis Eyewear] Xác nhận đơn hàng thành công - #{order.Id}";

                // Thiết kế khung HTML nội dung bài viết gửi cho khách hàng
                string htmlContent = $@"
                    <div style='font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #eee; border-radius: 10px;'>
                        <h2 style='color: #D9643A; border-bottom: 1px solid #eee; padding-bottom: 10px;'>Solis Eyewear - Đặt hàng thành công</h2>
                        <p>Xin chào <strong>{customer.FullName}</strong>,</p>
                        <p>Cảm ơn bạn đã đặt hàng tại Solis Eyewear. Đơn hàng của bạn đã được tiếp nhận thành công trên hệ thống ngầm.</p>
                        
                        <div style='background: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 15px; margin-bottom: 15px;'>
                            <p style='margin: 5px 0;'><strong>Mã đơn hàng:</strong> #{order.Id}</p>
                            <p style='margin: 5px 0;'><strong>Ngày đặt:</strong> {order.OrderDate.ToString("dd/MM/yyyy HH:mm")}</p>
                            <p style='margin: 5px 0;'><strong>Số điện thoại nhận hàng:</strong> {phoneReceive}</p>
                            <p style='margin: 5px 0;'><strong>Ghi chú giao nhận:</strong> {deliveryNote}</p>
                        </div>

                        <h3 style='background: #FFF5F1; color: #D9643A; padding: 12px; border-radius: 6px; margin-top: 20px;'>
                            Tổng tiền cần thanh toán: {totalAmount.ToString("N0")} đ
                        </h3>
                        
                        <p style='font-size: 0.9rem; color: #666; margin-top: 20px;'>Chúng tôi sẽ sớm gọi điện xác nhận lộ trình giao hàng cho bạn. Vui lòng để ý điện thoại nhé!</p>
                        <hr style='border: none; border-top: 1px solid #eee; margin: 20px 0;' />
                        <p style='font-size: 0.85rem; color: #999;'>Trân trọng,<br><strong>Đội ngũ Solis Eyewear System</strong></p>
                    </div>";

                // 🚨 ĐIỂM CHỐT: Gọi hàm của EmailService (Sử dụng cấu hình MailKit có sẵn của bạn)
                await _emailService.SendOrderConfirmationAsync(customer.Email, subject, htmlContent);
            }
            catch (Exception ex)
            {
                // In ra màn hình chẩn đoán lỗi trong Visual Studio nếu tiến trình ngầm có trục trặc
                System.Diagnostics.Debug.WriteLine($"[Lỗi đóng gói Email Checkout]: {ex.Message}");
            }
        }
    }

    public class CheckoutRequest
    {
        public string? Notes { get; set; }
        public System.Collections.Generic.List<CartItemRequest> CartItems { get; set; } = new System.Collections.Generic.List<CartItemRequest>();
    }

    public class CartItemRequest
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }
}