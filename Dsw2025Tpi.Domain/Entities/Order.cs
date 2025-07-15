
using Dsw2025Tpi.Domain.Entities;

public class Order : EntityBase
{
    public Guid CustomerId { get; set; }
    public Customer Customer { get; set; }

    public DateTime Date { get; private set; }
    public string ShippingAddress { get; set; }
    public string BillingAddress { get; set; }
    public string Notes { get; set; }
    public decimal TotalAmount { get; set; }
    public OrderStatus Status { get; set; }

    public List<OrderItem> OrderItems { get; set; } = new();

    public Order()
    {
        Date = DateTime.UtcNow;
        Status = OrderStatus.Pending;
    }

    public Order(Guid customerId, string shippingAddress, string billingAddress, string notes) : this()
    {
        CustomerId = customerId;
        ShippingAddress = shippingAddress;
        BillingAddress = billingAddress;
        Notes = notes;
    }

    public void SetOrderItems(List<OrderItem> items)
    {
        OrderItems = items;
        TotalAmount = items.Sum(i => i.Subtotal);
    }

}
