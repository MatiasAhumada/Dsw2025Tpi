
using Dsw2025Tpi.Domain.Entities;public class OrderItem : EntityBase
{
    public Guid _orderId { get; set; }
    public Order _order { get; set; } 

    public Guid _productId { get; set; }
    public Product _product { get; set; } 

    public int _quantity { get; set; }
    public decimal _unitPrice { get; set; }

    public decimal _subtotal => _quantity * _unitPrice; 

    
    public OrderItem() { }

    public OrderItem(Guid orderId, Order order, Guid productId, Product product, int quantity, decimal unitPrice)
    {
        _orderId = orderId;
        _order = order;
        _productId = productId;
        _product = product;
        _quantity = quantity;
        _unitPrice = unitPrice;
    }
}