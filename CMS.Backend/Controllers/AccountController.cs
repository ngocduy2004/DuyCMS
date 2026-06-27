using CMS.Data;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
        // 1. Kiểm tra tài khoản trong Database
        var user = _context.Users.FirstOrDefault(u => u.Username == username && u.PasswordHash == password);

        if (user != null)
        {
            // 2. Thiết lập danh tính (Claims)
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role ?? "User"),
                new Claim("FullName", user.FullName ?? username)
            };

            // ✅ Sửa: Dùng "AdminScheme" thay vì CookieAuthenticationDefaults.AuthenticationScheme
            var claimsIdentity = new ClaimsIdentity(claims, AdminScheme);

            // 3. Đăng nhập với AdminScheme
            await HttpContext.SignInAsync(AdminScheme, new ClaimsPrincipal(claimsIdentity));

            // 4. Điều hướng
            if (user.Role == "Admin" || user.Role == "Editor")
            {
                return RedirectToAction("Index", "Product");
            }
            else
            {
                return RedirectToAction("Index", "Home");
            }
        }

        ViewBag.Error = "Tên đăng nhập hoặc mật khẩu không đúng!";
        return View();
    }

    // Hàm đăng xuất
    public async Task<IActionResult> Logout()
    {
        // ✅ Sửa: Logout đúng AdminScheme
        await HttpContext.SignOutAsync(AdminScheme);
        return RedirectToAction("Login");
    }

    [HttpGet]
    public IActionResult AccessDenied()
    {
        return View();
    }
}