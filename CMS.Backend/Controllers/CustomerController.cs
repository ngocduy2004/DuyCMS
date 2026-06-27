using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    public class CustomerController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CustomerController(ApplicationDbContext context)
        {
            _context = context;
        }

        // --- 1. HIỂN THỊ DANH SÁCH ---
        // Đã nâng cấp lên async/await để tối ưu hiệu suất
        public async Task<IActionResult> Index()
        {
            var customers = await _context.Customers.ToListAsync();
            return View(customers);
        }

        // --- 2. THÊM MỚI (CREATE) ---
        // GET: Mở form thêm mới
        public IActionResult Create()
        {
            return View();
        }

        // POST: Xử lý dữ liệu khi bấm nút Lưu
        [HttpPost]
        [ValidateAntiForgeryToken] // Chống hack CSRF
        public async Task<IActionResult> Create([Bind("FullName,Email,Phone,Address,Password")] Customer customer)
        {
            if (ModelState.IsValid)
            {
                // Kiểm tra trùng Email trong Admin
                if (await _context.Customers.AnyAsync(c => c.Email == customer.Email))
                {
                    ModelState.AddModelError("Email", "Email này đã được sử dụng!");
                    return View(customer);
                }

                // Kiểm tra trùng Số điện thoại
                if (!string.IsNullOrWhiteSpace(customer.Phone) &&
                    await _context.Customers.AnyAsync(c => c.Phone == customer.Phone))
                {
                    ModelState.AddModelError("Phone", "Số điện thoại này đã tồn tại!");
                    return View(customer);
                }

                _context.Add(customer);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index)); // Thêm xong quay về danh sách
            }
            return View(customer);
        }

        // --- 3. SỬA THÔNG TIN (EDIT) ---
        // GET: Mở form sửa, tải sẵn dữ liệu cũ lên
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null) return NotFound();

            var customer = await _context.Customers.FindAsync(id);
            if (customer == null) return NotFound();

            return View(customer);
        }

        // POST: Xử lý lưu dữ liệu mới
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,FullName,Email,Phone,Address,Password")] Customer customer)
        {
            if (id != customer.Id) return NotFound();

            if (ModelState.IsValid)
            {
                try
                {
                    // Kiểm tra trùng Email (loại trừ chính khách hàng này)
                    if (await _context.Customers.AnyAsync(c => c.Email == customer.Email && c.Id != customer.Id))
                    {
                        ModelState.AddModelError("Email", "Email này đã được sử dụng bởi người khác!");
                        return View(customer);
                    }

                    // Kiểm tra trùng SĐT (loại trừ chính khách hàng này)
                    if (!string.IsNullOrWhiteSpace(customer.Phone) &&
                        await _context.Customers.AnyAsync(c => c.Phone == customer.Phone && c.Id != customer.Id))
                    {
                        ModelState.AddModelError("Phone", "Số điện thoại này đã được sử dụng!");
                        return View(customer);
                    }

                    _context.Update(customer);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!CustomerExists(customer.Id)) return NotFound();
                    else throw;
                }
                return RedirectToAction(nameof(Index));
            }
            return View(customer);
        }

        // --- 4. XÓA (DELETE) ---
        // GET: Hiện trang xác nhận có chắc chắn muốn xóa không
        // --- SỬA LẠI HÀM XÓA KHÁCH HÀNG (XÓA TRỰC TIẾP KHÔNG QUA TRANG XÁC NHẬN) ---
        // GET hoặc POST: Customer/Delete/5
        public IActionResult Delete(int id)
        {
            // 1. Tìm khách hàng theo Id
            var customer = _context.Customers.Find(id);

            if (customer != null)
            {
                // 2. Xóa khỏi bộ nhớ tạm
                _context.Customers.Remove(customer);

                // 3. Cập nhật xuống SQL Server
                _context.SaveChanges();
            }

            // 4. Quay về trang danh sách khách hàng
            return RedirectToAction("Index");
        }

        // POST: Thực thi lệnh xóa khỏi Database
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer != null)
            {
                _context.Customers.Remove(customer);
                await _context.SaveChangesAsync();
            }
            return RedirectToAction(nameof(Index));
        }

        // Hàm kiểm tra khách hàng có tồn tại không
        private bool CustomerExists(int id)
        {
            return _context.Customers.Any(e => e.Id == id);
        }
    }
}