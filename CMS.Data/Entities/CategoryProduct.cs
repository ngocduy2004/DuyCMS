using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Data.Entities
{
    [Table("CategoriesProducts")]
    public class CategoryProduct
    {
        [Key]
        public int Id { get; set; }
        [Required(ErrorMessage = "Ten danh mục không được để trống" )]
        [StringLength(100)]
        public string Name { get; set; }
        public string? Description { get; set; }
        public virtual ICollection<Product>? Products { get; set; }

    }
}
