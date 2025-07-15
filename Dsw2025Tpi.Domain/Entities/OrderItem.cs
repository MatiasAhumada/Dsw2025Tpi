using Dsw2025Tpi.Domain.Entities;
using System;

public class OrderItem : EntityBase
{
    public Guid OrderId { get; set; }
    public Order Order { get; set; }

    public Guid ProductId { get; set; }
    public Product Product { get; set; }

    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }

    public decimal Subtotal { get; set; }

 

    public OrderItem(Guid orderId, Order order, Guid productId, Product product, int quantity, decimal unitPrice)
    {
        OrderId = orderId;
        Order = order;
        ProductId = productId;
        Product = product;
        Quantity = quantity;
        UnitPrice = unitPrice;
        Subtotal = quantity * unitPrice;
    }
    public OrderItem(Guid productId, Product product, int quantity, decimal unitPrice)
    {
        ProductId = productId;
        Product = product;
        Quantity = quantity;
        UnitPrice = unitPrice;
        Subtotal = quantity * unitPrice;
    }
   public OrderItem() { }
}
