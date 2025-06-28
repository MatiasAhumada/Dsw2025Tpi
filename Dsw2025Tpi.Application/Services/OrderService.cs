using Dsw2025Tpi.Domain;
using Dsw2025Tpi.Domain.Entities;
using Dsw2025Tpi.Application.Dtos;

public class OrderService
{
    private readonly IRepository _repository;

    public OrderService(IRepository repository)
    {
        _repository = repository;
    }

    public async Task<Order> CreateOrderAsync(CreateOrderRequest.RequestOrder request)
{
    var orderItems = new List<OrderItem>();

    foreach (var item in request.OrderItems)
    {
        var product = await _repository.First<Product>(p => p.InternalCode == item.ProductId);

        if (product == null)
            throw new InvalidOperationException($"Producto con ID {item.ProductId} no encontrado.");

        if (product.StockQuantity < item.Quantity)
            throw new InvalidOperationException($"Stock insuficiente para el producto {product.Name}.");

        // Decrementar stock
        product.StockQuantity -= item.Quantity;

        // Crear item de la orden
        orderItems.Add(new OrderItem(
            orderId: Guid.Empty,
            order: null!,
            productId: product.InternalCode,
            product: product,
            quantity: item.Quantity,
            unitPrice: item.CurrentUnitPrice
        ));
    }

    var order = new Order(
        request.CustomerId,
        request.ShippingAddress,
        request.BillingAddress,
        notes: ""
    );

    order.setOrderItems(orderItems);

    await _repository.Add(order);

    foreach (var item in orderItems)
    {
        item._orderId = order.InternalCode;
        item._order = order;
        await _repository.Add(item);
    }

    // Actualizar el stock de los productos
    foreach (var item in orderItems)
    {
        var product = await _repository.GetById<Product>(item._productId);
        if (product != null)
        {
            product.StockQuantity -= item._quantity;
            await _repository.Update(product);
        }
    }

    return order;
}
}