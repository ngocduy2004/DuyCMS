using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Controllers
{
    [Authorize(AuthenticationSchemes = "AdminScheme")]// Bảo mật: Chỉ admin mới được quản lý Banner
    public class BannerController : Controller
    {
        private readonly ApplicationDbContext _context;

        public BannerController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. DANH SÁCH BANNER
        public async Task<IActionResult> Index()
        {
            // Sắp xếp theo SortOrder để dễ quản lý
            var banners = await _context.Banners.OrderBy(b => b.SortOrder).ToListAsync();
            return View(banners);
        }

        // 2. THÊM MỚI (GET)
        public IActionResult Create() => View();

        // THÊM MỚI (POST)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Banner banner, IFormFile ImageFile)
        {
            if (ModelState.IsValid)
            {
                if (ImageFile != null && ImageFile.Length > 0)
                {
                    var uploadDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "banners");
                    if (!Directory.Exists(uploadDir)) Directory.CreateDirectory(uploadDir);

                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(ImageFile.FileName);
                    var filePath = Path.Combine(uploadDir, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await ImageFile.CopyToAsync(stream);
                    }
                    banner.ImageUrl = "/images/banners/" + fileName;
                }

                _context.Banners.Add(banner);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(banner);
        }

        // 3. SỬA (GET)
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null) return NotFound();
            var banner = await _context.Banners.FindAsync(id);
            if (banner == null) return NotFound();
            return View(banner);
        }

        // SỬA (POST)
        // SỬA (POST)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, Banner banner, IFormFile ImageFile)
        {
            // 1. Kiểm tra ID trên URL và ID trong form có khớp nhau không
            if (id != banner.Id) return NotFound();

            // 2. Ép hệ thống bỏ qua việc bắt lỗi "bắt buộc nhập" đối với ImageFile
            ModelState.Remove("ImageFile");

            if (ModelState.IsValid)
            {
                try
                {
                    // 2. LẤY BANNER CŨ TỪ DATABASE LÊN
                    var existingBanner = await _context.Banners.FindAsync(id);
                    if (existingBanner == null) return NotFound();

                    // 3. CHỈ CẬP NHẬT CÁC THÔNG TIN TEXT
                    existingBanner.Title = banner.Title;
                    existingBanner.TargetUrl = banner.TargetUrl;
                    existingBanner.SortOrder = banner.SortOrder;
                    existingBanner.IsActive = banner.IsActive;

                    // 4. KIỂM TRA NẾU NGƯỜI DÙNG UP ẢNH MỚI THÌ MỚI XỬ LÝ ẢNH
                    if (ImageFile != null && ImageFile.Length > 0)
                    {
                        var uploadDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "banners");
                        if (!Directory.Exists(uploadDir)) Directory.CreateDirectory(uploadDir);

                        var fileName = Guid.NewGuid().ToString() + Path.GetExtension(ImageFile.FileName);
                        var filePath = Path.Combine(uploadDir, fileName);

                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await ImageFile.CopyToAsync(stream);
                        }

                        // Xóa file ảnh cũ cho nhẹ Server
                        if (!string.IsNullOrEmpty(existingBanner.ImageUrl))
                        {
                            var oldImagePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", existingBanner.ImageUrl.TrimStart('/'));
                            if (System.IO.File.Exists(oldImagePath)) System.IO.File.Delete(oldImagePath);
                        }

                        // Cập nhật link ảnh mới
                        existingBanner.ImageUrl = "/images/banners/" + fileName;
                    }

                    // 5. LƯU VÀO DATABASE
                    _context.Update(existingBanner);
                    await _context.SaveChangesAsync();

                    return RedirectToAction(nameof(Index));
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!_context.Banners.Any(e => e.Id == banner.Id)) return NotFound();
                    else throw;
                }
            }

            // NẾU CODE CHẠY XUỐNG ĐÂY (Tức là ModelState.IsValid == false)
            // In ra lỗi cụ thể để bạn biết nó đang bị kẹt ở trường nào
            var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage);
            foreach (var error in errors)
            {
                ModelState.AddModelError("", "Lỗi nhập liệu: " + error);
            }

            return View(banner);
        }

        // 4. XÓA NHANH (DELETE TRỰC TIẾP TỪ NÚT XÓA Ở INDEX)
        public async Task<IActionResult> Delete(int id)
        {
            var banner = await _context.Banners.FindAsync(id);
            if (banner != null)
            {
                // Xóa file ảnh vật lý để tránh đầy bộ nhớ Server
                if (!string.IsNullOrEmpty(banner.ImageUrl))
                {
                    var oldImagePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", banner.ImageUrl.TrimStart('/'));
                    if (System.IO.File.Exists(oldImagePath))
                    {
                        System.IO.File.Delete(oldImagePath);
                    }
                }

                _context.Banners.Remove(banner);
                await _context.SaveChangesAsync();
            }
            return RedirectToAction(nameof(Index));
        }
    }
}