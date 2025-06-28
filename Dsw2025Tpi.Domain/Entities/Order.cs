
using Dsw2025Tpi.Domain.Entities;

public class Order: EntityBase
 {

     public Guid _customerId { get; set; }

     public DateTime _date { get; }

     public string _shippingAddress { get; set; }
     public string _billingAddress { get; set; }
     public string _notes { get; set; }

     public decimal _totalAmount { get;set; }
     public OrderStatus _status { get; set; }

     public List<OrderItem> _orderItems { get; set; }

     public Order(Guid customerId, string shippingAddress, string billingAddress, string notes)
     {
         _customerId = customerId;
         _date = DateTime.UtcNow;
         _shippingAddress = shippingAddress;
         _billingAddress = billingAddress;
         _notes = notes;
         _status = OrderStatus.Pending;
     }

     public void setOrderItems(List<OrderItem> list) {
         _orderItems = list;
         _totalAmount = list.Sum(p=>p._subtotal);

     }
 }
public class OrderItem:EntityBase
{
    public Guid _orderId { get; set; }
    public Guid _productId { get; set; }
    public int _quantity { get; set; }
    public decimal _unitPrice { get; set; }

    public decimal _subtotal { get; set; }

    public OrderItem(Guid orderId, Order order, Guid productId, Product product, int quantity, decimal unitPrice)
    {
        _orderId = orderId;
        _productId = productId;
        _quantity = quantity;
        _unitPrice = unitPrice;
        _subtotal = _quantity * _unitPrice;
    }
}
