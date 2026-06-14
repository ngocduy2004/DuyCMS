using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;
using CMS.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class AccountController : Controller
{
    private readonly ApplicationDbContext _context;

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
                new Claim(ClaimTypes.Role, user.Role ?? "User"), // Lưu vai trò: Admin/Editor/User (Mặc định là User nếu null)
                new Claim("FullName", user.FullName ?? username)
            };

            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

            // 3. Đăng nhập và lưu Cookie vào trình duyệt
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(claimsIdentity));

            // ====================================================
            // 4. KIỂM TRA VAI TRÒ VÀ ĐIỀU HƯỚNG (PHÂN QUYỀN)
            // ====================================================
            if (user.Role == "Admin" || user.Role == "Editor")
            {
                // Nếu là Quản trị viên, đá thẳng vào trang Quản lý Sản phẩm (hoặc Dashboard)
                return RedirectToAction("Index", "Product");
            }
            else
            {
                // Nếu là Khách hàng bình thường, cho ra trang chủ Home
                return RedirectToAction("Index", "Home");
            }
        }

        ViewBag.Error = "Tên đăng nhập hoặc mật khẩu không đúng!";
        return View();
    }

    // Hàm đăng xuất
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        // Sau khi đăng xuất thành công thì quay lại trang Login
        return RedirectToAction("Login");
    }

    [HttpGet]
    public IActionResult AccessDenied()
    {
        return View();
    }
}