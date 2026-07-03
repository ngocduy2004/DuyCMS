using MailKit.Net.Smtp;
using MimeKit;
//using System.Net.Mail;
using System.Threading.Tasks;

namespace CMS.Backend.Services
{
    public class EmailService
    {
        public async Task SendOrderConfirmationAsync(string customerEmail, string subject, string content)
        {
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse("ngocduy6379@gmail.com"));
            email.To.Add(MailboxAddress.Parse(customerEmail));
            email.Subject = subject;

            // Nội dung email dạng HTML
            var builder = new BodyBuilder { HtmlBody = content };
            email.Body = builder.ToMessageBody();

            using var smtp = new SmtpClient();
            try
            {
                // Kết nối tới server Gmail
                await smtp.ConnectAsync("smtp.gmail.com", 587, MailKit.Security.SecureSocketOptions.StartTls);

                // Đăng nhập với email và mật khẩu ứng dụng (đã bỏ dấu cách)
                await smtp.AuthenticateAsync("ngocduy6379@gmail.com", "pxwagjqkyyivwdfm");

                await smtp.SendAsync(email);
            }
            catch (Exception ex)
            {
                // Log lỗi ra cửa sổ Output của Visual Studio để bạn dễ kiểm tra nếu gửi thất bại
                System.Diagnostics.Debug.WriteLine($"Lỗi gửi email: {ex.Message}");
            }
            finally
            {
                await smtp.DisconnectAsync(true);
            }
        }
    }
}