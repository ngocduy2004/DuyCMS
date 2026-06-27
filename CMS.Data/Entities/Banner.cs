using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CMS.Data.Entities
{
    [Table("Banners")]
    public class Banner
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Tiêu đề không được để trống")]
        [StringLength(200)]
        public string Title { get; set; }

        public string? ImageUrl { get; set; }

        [StringLength(500)]
        public string? TargetUrl { get; set; } // Link khi click vào Banner (nếu có)

        public int SortOrder { get; set; } = 0; // Để sắp xếp thứ tự hiển thị banner

        public bool IsActive { get; set; } = true; // Cho phép bật/tắt banner tạm thời
    }
}