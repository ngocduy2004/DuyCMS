using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerAuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        // Khai báo Scheme cứng ở đây để dùng chung
        private const string CustomerScheme = "CustomerScheme";

        public CustomerAuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        private int? CurrentCustomerId =>
            int.TryParse(User.FindFirst("CustomerId")?.Value, out var id) ? id : null;

        [HttpPost("CustomerRegister")]
        public async Task<IActionResult> CustomerRegister([FromBody] Customer model)
        {
            if (string.IsNullOrWhiteSpace(model.FullName) || model.FullName.Trim().Length < 2)
                return BadRequest(new { success = false, message = "Họ và tên không được để trống!" });

            if (await _context.Customers.AnyAsync(c => c.Email == model.Email))
                return BadRequest(new { success = false, message = "Email này đã được đăng ký!" });

            _context.Customers.Add(model);
            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "Đăng ký thành công!" });
        }

        [HttpPost("CustomerLogin")]
        public async Task<IActionResult> CustomerLogin([FromBody] LoginDto login)
        {
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Email == login.Email && c.Password == login.Password);

            if (customer == null)
                return Unauthorized(new { success = false, message = "Email hoặc mật khẩu không đúng!" });

            // Ghi Cookie vào với Scheme: CustomerScheme
            await SignInCustomerAsync(customer);

            return Ok(new
            {
                success = true,
                customerId = customer.Id,
                fullName = customer.FullName,
                message = "Đăng nhập thành công!"
            });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            // Chỉ xóa "vé" của CustomerScheme
            await HttpContext.SignOutAsync(CustomerScheme);
            return Ok(new { success = true, message = "Đăng xuất thành công!" });
        }

        [HttpGet("me")]
        [Authorize(AuthenticationSchemes = CustomerScheme)] // ✅ CHỈ NHẬN VÉ KHÁCH
        public async Task<IActionResult> GetProfile()
        {
            var customerId = CurrentCustomerId;
            if (!customerId.HasValue) return Unauthorized();

            var customer = await _context.Customers.FindAsync(customerId.Value);
            return Ok(new { Id = customer.Id, FullName = customer.FullName, Email = customer.Email, Phone = customer.Phone, Address = customer.Address });
        }

        [HttpPut("me")]
        [Authorize(AuthenticationSchemes = CustomerScheme)] // ✅ CHỈ NHẬN VÉ KHÁCH
        public async Task<IActionResult> UpdateProfile([FromBody] CustomerUpdateRequest request)
        {
            var customerId = CurrentCustomerId;
            if (!customerId.HasValue) return Unauthorized();

            var customer = await _context.Customers.FindAsync(customerId.Value);
            // ... (Phần logic update giữ nguyên) ...
            customer.FullName = request.FullName.Trim();
            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "Cập nhật thành công!" });
        }

        private async Task SignInCustomerAsync(Customer customer)
        {
            var claims = new List<Claim> {
                new Claim(ClaimTypes.Name, customer.Email),
                new Claim("CustomerId", customer.Id.ToString())
            };

            // ✅ ĐĂNG NHẬP VỚI SCHEME RIÊNG
            var identity = new ClaimsIdentity(claims, CustomerScheme);
            await HttpContext.SignInAsync(CustomerScheme, new ClaimsPrincipal(identity));
        }
    }


// Các lớp hỗ trợ (DTOs)
public class LoginDto
    {
        public string Email { get; set; } = "";
        public string Password { get; set; } = "";
    }

    public class CustomerUpdateRequest
    {
        public string FullName { get; set; } = "";
        public string? Phone { get; set; }
        public string? Address { get; set; }
    }
}