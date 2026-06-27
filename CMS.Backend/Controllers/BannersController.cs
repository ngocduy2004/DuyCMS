using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Controllers // Hoặc CMS.Controllers.Api tùy cấu trúc thư mục của bạn
{
    [Route("api/[controller]")]
    [ApiController]
    public class BannersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BannersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Banners
        // Hàm này sẽ trả về danh sách Banner cho React (HeroBanner.jsx)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Banner>>> GetActiveBanners()
        {
            // Chỉ lấy những banner có IsActive == true và sắp xếp theo SortOrder
            var banners = await _context.Banners
                                        .Where(b => b.IsActive == true)
                                        .OrderBy(b => b.SortOrder)
                                        .ToListAsync();

            if (banners == null || banners.Count == 0)
            {
                return NotFound("Không có banner nào đang hoạt động.");
            }

            return Ok(banners);
        }

        // GET: api/Banners/5
        // (Tùy chọn) Hàm này để lấy chi tiết 1 banner nếu sau này cần
        [HttpGet("{id}")]
        public async Task<ActionResult<Banner>> GetBanner(int id)
        {
            var banner = await _context.Banners.FindAsync(id);

            if (banner == null)
            {
                return NotFound();
            }

            return Ok(banner);
        }
    }
}