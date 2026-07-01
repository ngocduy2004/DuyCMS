using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/products
        [HttpGet]
        public IActionResult GetAll()
        {
            var products = _context.Products
                .OrderByDescending(p => p.Id)
                .Select(p => new {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.ImageUrl,
                    p.StockQuantity,
                    CategoryName = p.ProductCategory.Name // Lấy tên danh mục
                })
                .ToList();
            return Ok(products);
        }

        // GET: api/products/latest
        [HttpGet("latest")]
        public IActionResult GetLatest()
        {
            var latestProducts = _context.Products
                .OrderByDescending(p => p.Id) // Sắp xếp ID giảm dần (mới nhất lên đầu)
                .Select(p => new {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.ImageUrl,
                    p.StockQuantity,
                    CategoryName = p.ProductCategory.Name
                })
                .Take(3) // CHỈ LẤY ĐÚNG 3 SẢN PHẨM để tối ưu tốc độ
                .ToList();

            return Ok(latestProducts);
        }

        // GET: api/products/bestsellers
        [HttpGet("bestsellers")]
        public IActionResult GetBestSellers()
        {
            // MẸO: Lấy 3 sản phẩm có số lượng tồn kho ÍT NHẤT làm "Sản phẩm bán chạy"
            // Nếu Database của bạn có cột Lượt xem (ViewCount) hoặc Đã bán (Sold), hãy đổi 'p.StockQuantity' thành cột đó.
            var bestSellers = _context.Products
                .OrderBy(p => p.StockQuantity) // Sắp xếp TĂNG DẦN (Tồn kho ít nhất lên đầu)
                .Select(p => new {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.ImageUrl,
                    p.StockQuantity,
                    CategoryName = p.ProductCategory.Name
                })
                .Take(3) // Lấy đúng 3 sản phẩm để tối ưu băng thông
                .ToList();

            return Ok(bestSellers);
        }

        // GET: api/products/category/5
        [HttpGet("category/{categoryId}")]
        public IActionResult GetByCategory(int categoryId)
        {
            var products = _context.Products
                .Where(p => p.CategoryProductId == categoryId)
                .Select(p => new {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.ImageUrl,
                    p.StockQuantity
                })
                .ToList();
            return Ok(products);
        }

        // GET: api/products/5
        [HttpGet("{id}")]
        public IActionResult GetDetail(int id)
        {
            var product = _context.Products
                .Include(p => p.ProductCategory) // Nạp thông tin danh mục
                .FirstOrDefault(p => p.Id == id);

            if (product == null) return NotFound();

            return Ok(new
            {
                product.Id,
                product.Name,
                product.Price,
                product.Description,
                product.ImageUrl,
                product.StockQuantity,
                CategoryName = product.ProductCategory?.Name
            });
        }

        // GET: api/products/search
        [HttpGet("search")]
        public IActionResult SearchProducts([FromQuery] int? categoryId, [FromQuery] string? keyword, [FromQuery] decimal? minPrice, [FromQuery] decimal? maxPrice)
        {
            // 1. Tạo query gốc
            var query = _context.Products.AsQueryable();

            // 2. Lọc theo danh mục (Nếu có)
            if (categoryId.HasValue)
            {
                query = query.Where(p => p.CategoryProductId == categoryId.Value);
            }

            // 3. Lọc theo từ khóa tìm kiếm (Nếu có)
            if (!string.IsNullOrEmpty(keyword))
            {
                query = query.Where(p => p.Name.Contains(keyword));
            }

            // 4. Lọc theo Giá Tối Thiểu (Min)
            if (minPrice.HasValue)
            {
                query = query.Where(p => p.Price >= minPrice.Value);
            }

            // 5. Lọc theo Giá Tối Đa (Max)
            if (maxPrice.HasValue)
            {
                query = query.Where(p => p.Price <= maxPrice.Value);
            }

            // 6. Thực thi truy vấn và trả về kết quả
            var products = query
                .OrderByDescending(p => p.Id)
                .Select(p => new {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.ImageUrl,
                    p.StockQuantity,
                    CategoryName = p.ProductCategory.Name // Lấy tên danh mục
                })
                .ToList();

            return Ok(products);
        }
    }
}