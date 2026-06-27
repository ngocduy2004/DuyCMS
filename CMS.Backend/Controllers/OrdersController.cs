using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private const string CustomerScheme = "CustomerScheme";

        public OrdersController(ApplicationDbContext context) => _context = context;

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

                decimal totalAmount = 0; // Biến tính tổng tiền gửi Email

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

                // ==========================================
                // 📧 BẮT ĐẦU GỬI EMAIL SAU KHI LƯU DB THÀNH CÔNG
                // ==========================================
                var customer = await _context.Customers.FindAsync(currentCustomerId);
                if (customer != null && !string.IsNullOrEmpty(customer.Email))
                {
                    // Chạy ngầm việc gửi email để không làm chậm màn hình React của khách hàng
                    _ = Task.Run(() => SendOrderConfirmationEmail(customer, newOrder, request, totalAmount));
                }

                return StatusCode(201, new { message = "Đặt hàng thành công! Đã gửi email xác nhận.", orderId = newOrder.Id });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "Lỗi hệ thống", error = ex.Message });
            }
        }

        // ==========================================
        // 🛠️ HÀM HỖ TRỢ GỬI EMAIL
        // ==========================================
        private async Task SendOrderConfirmationEmail(Customer customer, Order order, CheckoutRequest request, decimal totalAmount)
        {
            try
            {
                // 🚨 BẠN HÃY THAY ĐỔI THÔNG TIN CỦA BẠN VÀO ĐÂY 🚨
                string fromEmail = "ngocduy6379@gmail.com";
                string appPassword = "pxwa gjqk yyiv wdfm";

                var smtpClient = new SmtpClient("smtp.gmail.com")
                {
                    Port = 587,
                    Credentials = new NetworkCredential(fromEmail, appPassword),
                    EnableSsl = true,
                };

                // Thiết kế nội dung Email (Dùng HTML cho đẹp)
                string body = $@"
                    <div style='font-family: Arial, sans-serif; padding: 20px; color: #333;'>
                        <h2 style='color: #D9643A;'>Solis Eyewear - Xác nhận đơn hàng #{order.Id}</h2>
                        <p>Xin chào <strong>{customer.FullName}</strong>,</p>
                        <p>Cảm ơn bạn đã đặt hàng tại Solis Eyewear. Dưới đây là thông tin đơn hàng của bạn:</p>
                        
                        <div style='background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;'>
                            <p><strong>Ngày đặt:</strong> {order.OrderDate.ToString("dd/MM/yyyy HH:mm")}</p>
                            <p><strong>Số điện thoại nhận:</strong> {request.Notes.Split('|')[2].Replace("SĐT: ", "").Trim()}</p>
                            <p><strong>Ghi chú giao hàng:</strong> {request.Notes.Split('|')[0].Replace("Ghi chú: ", "").Trim()}</p>
                        </div>

                        <h3 style='border-bottom: 2px solid #D9643A; padding-bottom: 5px;'>Tổng tiền thanh toán: <span style='color: #D9643A;'>{totalAmount.ToString("N0")} đ</span></h3>
                        
                        <p>Chúng tôi sẽ sớm liên hệ với bạn để xác nhận giao hàng. Vui lòng giữ điện thoại!</p>
                        <p>Trân trọng,<br><strong>Đội ngũ Solis Eyewear</strong></p>
                    </div>";

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(fromEmail, "Solis Eyewear"),
                    Subject = $"[Solis Eyewear] Xác nhận đơn hàng thành công - #{order.Id}",
                    Body = body,
                    IsBodyHtml = true
                };
                mailMessage.To.Add(customer.Email);

                await smtpClient.SendMailAsync(mailMessage);
            }
            catch (Exception ex)
            {
                // Nếu gửi lỗi, in ra Console để debug, không ảnh hưởng đến đơn hàng của khách
                System.Diagnostics.Debug.WriteLine($"[Lỗi Email]: {ex.Message}");
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