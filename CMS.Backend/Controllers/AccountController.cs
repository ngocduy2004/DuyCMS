using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
// Nhớ đảm bảo đã cài BCrypt.Net-Next
//[Route("[controller]")]
public class AccountController : Controller
{
    private readonly ApplicationDbContext _context;
    // Khai báo tên scheme trùng khớp với Program.cs
    private const string AdminScheme = "AdminScheme";

    public AccountController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult Login()
    {
        return View();
    }

    [HttpPost]
    public async Task<IActionResult> Login(string username, string password)
    {
        var user = _context.Users.FirstOrDefault(u => u.Username == username);

        if (user == null)
        {
            ViewBag.Error = "Tài khoản không tồn tại!";
            return View();
        }

        // 🚨 BƯỚC SỬA LỖI ĐỘT PHÁ:
        // Kiểm tra xem mật khẩu trong DB có phải là hash BCrypt không? 
        // BCrypt luôn bắt đầu bằng "$2a$" hoặc "$2b$"
        if (!user.PasswordHash.StartsWith("$2a$") && !user.PasswordHash.StartsWith("$2b$"))
        {
            // Nếu không phải là hash, có nghĩa là đang lưu dạng thô (ví dụ: "123456")
            // Chúng ta sẽ BĂM nó ngay tại đây và lưu lại vào DB
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.PasswordHash);
            _context.SaveChanges(); // Lưu vào DB ngay lập tức
        }

        // Sau khi đã chắc chắn user.PasswordHash là hash chuẩn, thì mới Verify
        if (BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
        {
            // 2. Thiết lập danh tính (Claims)
            var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.Role ?? "User"),
            new Claim("FullName", user.FullName ?? username)
        };

            var claimsIdentity = new ClaimsIdentity(claims, "AdminScheme");
            await HttpContext.SignInAsync("AdminScheme", new ClaimsPrincipal(claimsIdentity));

            return RedirectToAction("Index", "Product");
        }

        ViewBag.Error = "Mật khẩu không đúng!";
        return View();
    }



    // Hàm đăng xuất
    public async Task<IActionResult> Logout()
    {
        // Logout đúng AdminScheme
        await HttpContext.SignOutAsync("AdminScheme");
        return RedirectToAction("Login");
    }

    //[HttpGet("seed-admin")]
    //public IActionResult SeedAdmin()
    //{
    //    // Kiểm tra xem đã có user nào chưa, nếu có rồi thì thôi
    //    if (_context.Users.Any(u => u.Username == "ngocduy"))
    //    {
    //        return Ok("Tài khoản admin đã tồn tại!");
    //    }

    //    var admin = new User
    //    {
    //        Username = "ngocduy",
    //        PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
    //        Role = "Admin",
    //        FullName = "Quản trị viên"
    //    };

    //    _context.Users.Add(admin);
    //    _context.SaveChanges();
    //    return Ok("Đã tạo tài khoản admin thành công!");
    //}

    [HttpGet]
    public IActionResult AccessDenied()
    {
        return View();
    }
}