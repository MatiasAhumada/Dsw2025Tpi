namespace Dsw2025Tpi.Application.Dtos
{
    public record CreateOrderRequest
    {
         public record RequestOrder(
        string CustomerId,
        string ShippingAddress,
        string BillingAddress,
        List<RequestOrderItem> OrderItems
    );

    public record RequestOrderItem(
        Guid ProductId,
        int Quantity,
        string Name,
        string Description,
        decimal CurrentUnitPrice
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
}
