using CMS.Data;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

// --- THÊM 2 DÒNG NÀY ĐỂ HỖ TRỢ SWAGGER ---
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
// ------------------------------------------

// Đăng ký DbContext vào hệ thống kết nối SQL Server
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

//// 1. Khai báo dịch vụ xác thực Cookie
//builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
//    .AddCookie(options =>
//    {
//        options.LoginPath = "/Account/Login"; // Đường dẫn nếu chưa đăng nhập
//        options.AccessDeniedPath = "/Account/AccessDenied"; // Đường dẫn nếu vào trang không được phép
//    });


// 1. Khai báo dịch vụ xác thực Cookie (Cấu hình thông minh cho cả React và Trình duyệt)
// --- CẤU HÌNH XÁC THỰC TÁCH BIỆT ---
builder.Services.AddAuthentication()
    .AddCookie("CustomerScheme", options =>
    {
        options.Cookie.Name = "CustomerAuthCookie"; // Tên cookie riêng cho khách
        options.Cookie.SameSite = SameSiteMode.None;
        options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        options.Cookie.HttpOnly = true;
        options.LoginPath = "/Account/Login";

        options.Events.OnRedirectToLogin = context => {
            if (context.Request.Path.StartsWithSegments("/api")) context.Response.StatusCode = 401;
            else context.Response.Redirect(context.RedirectUri);
            return Task.CompletedTask;
        };
    })
    .AddCookie("AdminScheme", options =>
    {
        options.Cookie.Name = "AdminAuthCookie"; // Tên cookie riêng cho admin
        options.Cookie.HttpOnly = true;
        options.LoginPath = "/Admin/Login";
    });

// 1. Khai báo chính sách CORS
builder.Services.AddCors(options => {
    options.AddPolicy("AllowAll", policy => {
        // Cho phép mọi nguồn (Origin), mọi phương thức (GET, POST...), mọi tiêu đề (Header)
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// ---- CẤU HÌNH CORS (THÊM VÀO TRƯỚC builder.Build()) ----
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Cho phép ReactJS ở port 3000 gọi tới
              .AllowAnyHeader()                     // Cho phép mọi loại Header (Content-Type, Authorization...)
              .AllowAnyMethod()                     // Cho phép mọi phương thức HTTP (GET, POST, PUT, DELETE)
              .AllowCredentials();                  // Hỗ trợ truyền Cookie/Session nếu cần sau này
    });
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}
else
{
    // --- THÊM 2 DÒNG NÀY ĐỂ HIỂN THỊ GIAO DIỆN SWAGGER ---
    app.UseSwagger();
    app.UseSwaggerUI();
    // ----------------------------------------------------
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

// Kích hoạt CORS đúng vị trí này
app.UseCors("AllowReactApp");



// 2. Kích hoạt chính sách CORS đã khai báo ở trên
//app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();