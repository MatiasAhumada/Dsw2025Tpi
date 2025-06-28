using Dsw2025Tpi.Domain;
using Dsw2025Tpi.Domain.Entities;

public class OrderService
{
    private readonly IRepository _repository;

    public OrderService(IRepository repository)
    {
        _repository = repository;
    }

    // public async Task<Order> CreateOrderAsync(CreateOrderRequest request)
    // {
    //     var orderItems = new List<OrderItem>();

    //     foreach (var item in request.orderItems)
    //     {
    //         var product = await _repository.First<Product>(p => p.InternalCode == item.productId);

    //         if (product == null)
    //             throw new InvalidOperationException($"Producto con ID {item.productId} no encontrado.");

    //         if (product.StockQuantity < item.quantity)
    //             throw new InvalidOperationException($"Stock insuficiente para el producto {product.Name}.");

    //         // Decrementar stock
    //         product.StockQuantity -= item.quantity;

    //         // Crear el item de la orden
    //         orderItems.Add(new OrderItem(
    //             orderId: Guid.Empty, // Se actualiza después al guardar la orden
    //             order: null!,        // Se setea por EF
    //             productId: product.Id,
    //             product: product,
    //             quantity: item.quantity,
    //             unitPrice: item.currentUnitPrice
    //         ));
    //     }

    //     var order = new Order(
    //         request.customerId,
    //         request.shippingAddress,
    //         request.billingAddress,
    //         notes: ""
    //     );

    //     order.setOrderItems(orderItems);

    //     await _repository.Add(order);
    //     //await _repository.SaveChangesAsync();

    //     return order;
    // }
}