using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace Dsw2025Tpi.Application.Dtos
{
    public record ModeloProducto
    {
        public record Request(string Sku, string Name, string Description, decimal CurrentUnitPrice, int StockQuantity);
        public record Response(Guid InternalCode, string Sku, string Name, string Description, decimal CurrentUnitPrice, int StockQuantity);
    }
}
