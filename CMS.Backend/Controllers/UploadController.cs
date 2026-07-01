using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System.IO;
using System;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;

        public UploadController(IWebHostEnvironment env)
        {
            _env = env;
        }

        [HttpPost("image")]
        public async Task<IActionResult> UploadImage(IFormFile upload) // "upload" là tên field CKEditor gửi lên
        {
            if (upload == null || upload.Length == 0)
                return BadRequest("Không có file nào được tải lên.");

            // 1. Tạo thư mục wwwroot/uploads nếu chưa có
            var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            // 2. Tạo tên file ngẫu nhiên để không bị trùng (vd: 123-abc.jpg)
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(upload.FileName);
            var filePath = Path.Combine(uploadsFolder, fileName);

            // 3. Lưu file vào server
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await upload.CopyToAsync(stream);
            }

            // 4. Trả về đường dẫn ảnh cho CKEditor chèn vào bài viết
            // Lưu ý: Đảm bảo app.UseStaticFiles() đã được bật trong Program.cs
            var url = $"{Request.Scheme}://{Request.Host}/uploads/{fileName}";

            return Ok(new { url = url });
        }
    }
}