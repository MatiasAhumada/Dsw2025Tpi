using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dsw2025Tpi.Application.Dtos
{
    public record ModeloProductoAct
    {
        public record Request(string Sku, string Name, string Description, decimal CurrentUnitPrice, int StockQuantity);
        public record Response(string Sku, string Name, string Description, decimal CurrentUnitPrice, int StockQuantity);
    }
}
