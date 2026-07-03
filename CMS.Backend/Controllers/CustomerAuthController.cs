using CMS.Backend.Services; // 🚨 Đã thêm để gọi EmailService
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerAuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly EmailService _emailService; // 🚨 Khai báo EmailService
        private const string CustomerScheme = "CustomerScheme";

        public CustomerAuthController(ApplicationDbContext context)
        {
            _context = context;
            _emailService = new EmailService(); // 🚨 Khởi tạo EmailService
        }

        private int? CurrentCustomerId =>
            int.TryParse(User.FindFirst("CustomerId")?.Value, out var id) ? id : null;

        [HttpPost("CustomerRegister")]
        public async Task<IActionResult> CustomerRegister([FromBody] Customer model)
        {
            model.Email = model.Email.ToLower().Trim();

            // 1. Kiểm tra để trống
            if (string.IsNullOrWhiteSpace(model.FullName) || model.FullName.Trim().Length < 2)
                return BadRequest(new { success = false, message = "Họ và tên không được để trống!" });

            // 2. Kiểm tra Email tồn tại
            if (await _context.Customers.AnyAsync(c => c.Email == model.Email))
                return BadRequest(new { success = false, message = "Email này đã được đăng ký!" });

            // 3. Kiểm tra Số điện thoại (Định dạng & Duy nhất)
            if (string.IsNullOrWhiteSpace(model.Phone) || !Regex.IsMatch(model.Phone, @"^0\d{9}$"))
                return BadRequest(new { success = false, message = "Số điện thoại không hợp lệ (Phải bắt đầu bằng 0 và gồm 10 chữ số)!" });

            if (await _context.Customers.AnyAsync(c => c.Phone == model.Phone))
                return BadRequest(new { success = false, message = "Số điện thoại này đã được sử dụng!" });

            // 4. Kiểm tra độ dài mật khẩu (Ví dụ tối thiểu 6 ký tự)
            if (string.IsNullOrWhiteSpace(model.Password) || model.Password.Length < 6)
                return BadRequest(new { success = false, message = "Mật khẩu phải có ít nhất 6 ký tự!" });

            model.Password = BCrypt.Net.BCrypt.HashPassword(model.Password);

            _context.Customers.Add(model);
            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "Đăng ký thành công!" });
        }

        [HttpPost("CustomerLogin")]
        public async Task<IActionResult> CustomerLogin([FromBody] LoginDto login)
        {
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Email == login.Email);

            if (customer == null || !BCrypt.Net.BCrypt.Verify(login.Password, customer.Password))
            {
                return Unauthorized(new { success = false, message = "Email hoặc mật khẩu không đúng!" });
            }

            await SignInCustomerAsync(customer);

            return Ok(new
            {
                success = true,
                customerId = customer.Id,
                fullName = customer.FullName,
                message = "Đăng nhập thành công!"
            });
        }

        // ==========================================
        // 🚨 CHỨC NĂNG QUÊN MẬT KHẨU
        // ==========================================
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email))
                return BadRequest(new { message = "Vui lòng nhập email!" });

            var email = request.Email.Trim().ToLower();
            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Email == email);

            if (customer == null)
                return NotFound(new { message = "Email này chưa được đăng ký trong hệ thống!" });

            // 1. Tạo mật khẩu mới ngẫu nhiên (8 ký tự)
            string newRandomPassword = GenerateRandomPassword(8);

            // 2. Băm mật khẩu mới bằng BCrypt và lưu vào DB
            customer.Password = BCrypt.Net.BCrypt.HashPassword(newRandomPassword);
            await _context.SaveChangesAsync();

            // 3. Chuẩn bị nội dung gửi Email (Tái sử dụng SendOrderConfirmationAsync của bạn)
            string subject = "[Solis Eyewear] Khôi phục mật khẩu tài khoản";
            string emailContent = $@"
                <div style='font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px; max-width: 500px;'>
                    <h2 style='color: #D9643A; border-bottom: 1px solid #eee; padding-bottom: 10px;'>Cấp lại mật khẩu</h2>
                    <p>Chào <strong>{customer.FullName}</strong>,</p>
                    <p>Hệ thống vừa nhận được yêu cầu khôi phục mật khẩu cho tài khoản của bạn.</p>
                    <p>Mật khẩu mới của bạn là: 
                        <strong style='font-size: 18px; color: #D9643A; background: #f9f9f9; padding: 6px 12px; border-radius: 4px; display: inline-block; margin-top: 5px;'>
                            {newRandomPassword}
                        </strong>
                    </p>
                    <p style='color: #666; font-size: 0.9rem; margin-top: 20px;'>
                        * Vui lòng đăng nhập bằng mật khẩu trên và nhanh chóng đổi lại mật khẩu mới để đảm bảo an toàn.
                    </p>
                    <p style='margin-top: 20px;'>Trân trọng,<br><strong>Đội ngũ Solis Eyewear</strong></p>
                </div>";

            // 4. Gửi email
            try
            {
                // Đảm bảo truyền đúng email người gửi (giống email đăng nhập)
                _ = Task.Run(() => _emailService.SendOrderConfirmationAsync(customer.Email, subject, emailContent));
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Lỗi gửi mail quên mật khẩu: {ex.Message}");
                return StatusCode(500, new { message = "Lỗi server khi gửi email." });
            }

            return Ok(new { success = true, message = "Mật khẩu mới đã được gửi vào email của bạn!" });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CustomerScheme);
            return Ok(new { success = true, message = "Đăng xuất thành công!" });
        }

        [HttpGet("me")]
        [Authorize(AuthenticationSchemes = CustomerScheme)]
        public async Task<IActionResult> GetProfile()
        {
            var customerId = CurrentCustomerId;
            if (!customerId.HasValue) return Unauthorized();

            var customer = await _context.Customers.FindAsync(customerId.Value);
            return Ok(new { Id = customer.Id, FullName = customer.FullName, Email = customer.Email, Phone = customer.Phone, Address = customer.Address });
        }

        [HttpPut("me")]
        [Authorize(AuthenticationSchemes = CustomerScheme)]
        public async Task<IActionResult> UpdateProfile([FromBody] CustomerUpdateRequest request)
        {
            var customerId = CurrentCustomerId;
            if (!customerId.HasValue) return Unauthorized();

            var customer = await _context.Customers.FindAsync(customerId.Value);
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

            var identity = new ClaimsIdentity(claims, CustomerScheme);
            await HttpContext.SignInAsync(CustomerScheme, new ClaimsPrincipal(identity));
        }

        // ==========================================
        // 🛠️ HÀM HỖ TRỢ TẠO MẬT KHẨU NGẪU NHIÊN
        // ==========================================
        private string GenerateRandomPassword(int length)
        {
            const string chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789"; // Loại bỏ các ký tự dễ nhầm lẫn như O, 0, I, l, 1
            var random = new Random();
            return new string(Enumerable.Repeat(chars, length)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        [HttpPut("change-password")]
        [Authorize(AuthenticationSchemes = CustomerScheme)]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            var customerId = CurrentCustomerId;
            if (!customerId.HasValue) return Unauthorized();

            var customer = await _context.Customers.FindAsync(customerId.Value);
            if (customer == null) return NotFound(new { message = "Không tìm thấy tài khoản!" });

            // Kiểm tra mật khẩu cũ
            if (!BCrypt.Net.BCrypt.Verify(request.OldPassword, customer.Password))
            {
                return BadRequest(new { success = false, message = "Mật khẩu cũ không chính xác!" });
            }

            // Kiểm tra độ dài mật khẩu mới
            if (string.IsNullOrWhiteSpace(request.NewPassword) || request.NewPassword.Length < 6)
            {
                return BadRequest(new { success = false, message = "Mật khẩu mới phải có ít nhất 6 ký tự!" });
            }

            // Kiểm tra khớp mật khẩu
            if (request.NewPassword != request.ConfirmNewPassword)
            {
                return BadRequest(new { success = false, message = "Mật khẩu mới không khớp!" });
            }

            customer.Password = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Đổi mật khẩu thành công!" });
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

    // 🚨 DTO Cho chức năng quên mật khẩu
    public class ForgotPasswordRequest
    {
        public string Email { get; set; } = "";
    }


    public class ChangePasswordRequest
    {
        public string OldPassword { get; set; } = "";
        public string NewPassword { get; set; } = "";
        public string ConfirmNewPassword { get; set; } = "";
    }
}