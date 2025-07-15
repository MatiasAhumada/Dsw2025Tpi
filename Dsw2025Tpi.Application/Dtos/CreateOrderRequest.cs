namespace Dsw2025Tpi.Application.Dtos
{
    public record CreateOrderRequest
    {
        public record RequestOrder(
       Guid CustomerId,
       string ShippingAddress,
       string BillingAddress,
       string Notes,
       List<RequestOrderItem> OrderItems
   );

        public record RequestOrderItem(
            Guid ProductId,
            int Quantity
        );

        public record ResponseOrder(
            Guid OrderId,
            string CustomerId,
            string ShippingAddress,
            string BillingAddress,
            DateTime CreatedAt,
            decimal TotalAmount,
            List<ResponseOrderItem> OrderItems
        );

        public record ResponseOrderItem(
            Guid ProductId,
            string Name,
            string Description,
            decimal UnitPrice,
            int Quantity,
            decimal Subtotal
        );
    }
    public record UpdateOrderStatusRequest(string NewStatus);

}
