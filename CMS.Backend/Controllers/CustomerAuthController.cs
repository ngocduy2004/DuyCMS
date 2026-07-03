using CMS.Backend.Services;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory; // 🚨 Thêm thư viện này
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
        private readonly EmailService _emailService;
        private readonly IMemoryCache _cache; // 🚨 Khai báo biến Cache để lưu OTP
        private const string CustomerScheme = "CustomerScheme";

        // 🚨 Tiêm IMemoryCache vào constructor
        public CustomerAuthController(ApplicationDbContext context, IMemoryCache cache)
        {
            _context = context;
            _cache = cache;
            _emailService = new EmailService();
        }

        private int? CurrentCustomerId =>
            int.TryParse(User.FindFirst("CustomerId")?.Value, out var id) ? id : null;

        [HttpPost("CustomerRegister")]
        public async Task<IActionResult> CustomerRegister([FromBody] Customer model)
        {
            model.Email = model.Email.ToLower().Trim();

            if (string.IsNullOrWhiteSpace(model.FullName) || model.FullName.Trim().Length < 2)
                return BadRequest(new { success = false, message = "Họ và tên không được để trống!" });

            if (await _context.Customers.AnyAsync(c => c.Email == model.Email))
                return BadRequest(new { success = false, message = "Email này đã được đăng ký!" });

            if (string.IsNullOrWhiteSpace(model.Phone) || !Regex.IsMatch(model.Phone, @"^0\d{9}$"))
                return BadRequest(new { success = false, message = "Số điện thoại không hợp lệ (Phải bắt đầu bằng 0 và gồm 10 chữ số)!" });

            if (await _context.Customers.AnyAsync(c => c.Phone == model.Phone))
                return BadRequest(new { success = false, message = "Số điện thoại này đã được sử dụng!" });

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
        // 🚨 CHỨC NĂNG QUÊN MẬT KHẨU (BƯỚC 1: GỬI OTP)
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

            // 1. Tạo mã OTP (6 số ngẫu nhiên)
            string otpCode = new Random().Next(100000, 999999).ToString();

            // 2. Lưu OTP vào Bộ nhớ tạm (Cache) với thời hạn 5 phút. Key là email của khách
            _cache.Set($"OTP_{email}", otpCode, TimeSpan.FromMinutes(5));

            // 3. Gửi email chứa OTP
            string subject = "[Solis Eyewear] Mã OTP khôi phục mật khẩu";
            string emailContent = $@"
                <div style='font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px; max-width: 500px;'>
                    <h2 style='color: #D9643A; border-bottom: 1px solid #eee; padding-bottom: 10px;'>Mã xác nhận (OTP)</h2>
                    <p>Chào <strong>{customer.FullName}</strong>,</p>
                    <p>Bạn vừa yêu cầu khôi phục mật khẩu. Mã xác nhận của bạn là:</p>
                    <h1 style='color: #D9643A; background: #f9f9f9; padding: 15px; text-align: center; letter-spacing: 5px; border-radius: 8px;'>
                        {otpCode}
                    </h1>
                    <p style='color: #666; font-size: 0.9rem; margin-top: 20px;'>
                        * Mã này sẽ hết hạn sau <strong>5 phút</strong>. Vui lòng không chia sẻ mã này cho bất kỳ ai.
                    </p>
                </div>";

            try
            {
                _ = Task.Run(() => _emailService.SendOrderConfirmationAsync(customer.Email, subject, emailContent));
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Lỗi gửi mail OTP: {ex.Message}");
                return StatusCode(500, new { message = "Lỗi server khi gửi email." });
            }

            return Ok(new { success = true, message = "Mã OTP đã được gửi vào email của bạn!" });
        }

        // ==========================================
        // 🚨 CHỨC NĂNG QUÊN MẬT KHẨU (BƯỚC 2: KIỂM TRA OTP)
        // ==========================================
        [HttpPost("verify-otp")]
        public IActionResult VerifyOtp([FromBody] VerifyOtpRequest request)
        {
            var email = request.Email.Trim().ToLower();

            // Lấy OTP từ cache ra kiểm tra
            if (_cache.TryGetValue($"OTP_{email}", out string? savedOtp))
            {
                if (savedOtp == request.Otp)
                {
                    return Ok(new { success = true, message = "Mã OTP hợp lệ!" });
                }
            }

            return BadRequest(new { success = false, message = "Mã OTP không chính xác hoặc đã hết hạn!" });
        }

        // ==========================================
        // 🚨 CHỨC NĂNG QUÊN MẬT KHẨU (BƯỚC 3: ĐỔI MẬT KHẨU MỚI)
        // ==========================================
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            var email = request.Email.Trim().ToLower();

            // Kiểm tra lại OTP một lần nữa để bảo mật tuyệt đối
            if (!_cache.TryGetValue($"OTP_{email}", out string? savedOtp) || savedOtp != request.Otp)
            {
                return BadRequest(new { success = false, message = "Mã OTP không hợp lệ hoặc đã hết hạn!" });
            }

            if (request.NewPassword != request.ConfirmNewPassword)
                return BadRequest(new { success = false, message = "Mật khẩu xác nhận không khớp!" });

            if (request.NewPassword.Length < 6)
                return BadRequest(new { success = false, message = "Mật khẩu phải có ít nhất 6 ký tự!" });

            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Email == email);
            if (customer == null) return NotFound(new { success = false, message = "Không tìm thấy tài khoản!" });

            // Băm mật khẩu mới và lưu vào DB
            customer.Password = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            await _context.SaveChangesAsync();

            // 🚨 Đổi mật khẩu xong thì xóa luôn OTP trong Cache để không dùng lại được nữa
            _cache.Remove($"OTP_{email}");

            return Ok(new { success = true, message = "Đổi mật khẩu thành công! Vui lòng đăng nhập lại." });
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

        [HttpPut("change-password")]
        [Authorize(AuthenticationSchemes = CustomerScheme)]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            var customerId = CurrentCustomerId;
            if (!customerId.HasValue) return Unauthorized();

            var customer = await _context.Customers.FindAsync(customerId.Value);
            if (customer == null) return NotFound(new { message = "Không tìm thấy tài khoản!" });

            if (!BCrypt.Net.BCrypt.Verify(request.OldPassword, customer.Password))
            {
                return BadRequest(new { success = false, message = "Mật khẩu cũ không chính xác!" });
            }

            if (string.IsNullOrWhiteSpace(request.NewPassword) || request.NewPassword.Length < 6)
            {
                return BadRequest(new { success = false, message = "Mật khẩu mới phải có ít nhất 6 ký tự!" });
            }

            if (request.NewPassword != request.ConfirmNewPassword)
            {
                return BadRequest(new { success = false, message = "Mật khẩu mới không khớp!" });
            }

            customer.Password = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Đổi mật khẩu thành công!" });
        }
    }

    // ==========================================
    // CÁC LỚP DTO
    // ==========================================
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

    // 🚨 THÊM MỚI DTO CHO OTP
    public class VerifyOtpRequest
    {
        public string Email { get; set; } = "";
        public string Otp { get; set; } = "";
    }

    // 🚨 THÊM MỚI DTO CHO RESET PASSWORD
    public class ResetPasswordRequest
    {
        public string Email { get; set; } = "";
        public string Otp { get; set; } = "";
        public string NewPassword { get; set; } = "";
        public string ConfirmNewPassword { get; set; } = "";
    }
}