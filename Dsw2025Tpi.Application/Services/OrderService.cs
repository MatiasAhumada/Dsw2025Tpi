using Dsw2025Tpi.Domain;
using Dsw2025Tpi.Domain.Entities;
using Dsw2025Tpi.Application.Dtos;
using System.Linq.Expressions;
using Dsw2025Tpi.Data;

public class OrderService
{
    private readonly IRepository _repository;
    private readonly Dsw2025TpiContext _ctx;

    public OrderService(IRepository repository, Dsw2025TpiContext ctx)
    {
        _repository = repository;
        _ctx = ctx;
    }
    public async Task<Order> CreateOrderAsync(CreateOrderRequest.RequestOrder request)
    {
        var customer = await _ctx.Customers.FindAsync(request.CustomerId);
        if (customer == null)
            throw new InvalidOperationException("Cliente no encontrado.");

        var orderItems = new List<OrderItem>();
        foreach (var item in request.OrderItems)
        {
            var product = await _ctx.Products.FindAsync(item.ProductId);
            if (product == null)
                throw new InvalidOperationException($"Producto {item.ProductId} no existe.");
            if (product.StockQuantity < item.Quantity)
                throw new InvalidOperationException($"Stock insuficiente para {product.Name}.");

            product.StockQuantity -= item.Quantity;
            orderItems.Add(new OrderItem(
                productId: product.InternalCode,
                product: product,
                quantity: item.Quantity,
                unitPrice: product.CurrentUnitPrice
            ));
        }

        var order = new Order(
            customerId: request.CustomerId,
            shippingAddress: request.ShippingAddress,
            billingAddress: request.BillingAddress,
            notes: request.Notes
        );
        foreach (var oi in orderItems)
            oi.Order = order;
        order.SetOrderItems(orderItems);

        _ctx.Orders.Add(order);

        await _ctx.SaveChangesAsync();

        return order;
    }

    public async Task<Order?> GetOrderById(Guid id)
    {
        return await _repository.GetById<Order>(
            id,
            nameof(Order.OrderItems),
            $"{nameof(Order.OrderItems)}.{nameof(OrderItem.Product)}"
        );
    }

    public async Task<IEnumerable<Order>> GetAllOrdersAsync(string? status, Guid? customerId, int pageNumber, int pageSize)
    {
        Expression<Func<Order, bool>> filter = o => true;

        if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<OrderStatus>(status, true, out var parsedStatus))
        {
            filter = o => o.Status == parsedStatus;
        }

        if (customerId.HasValue)
        {
            var currentFilter = filter;
            filter = o => currentFilter.Compile()(o) && o.CustomerId == customerId;
        }

        var allOrders = await _repository.GetFiltered<Order>(filter,
            nameof(Order.OrderItems),
            $"{nameof(Order.OrderItems)}.{nameof(OrderItem.Product)}",
            nameof(Order.Customer)
        );

        return allOrders?
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToList()
            ?? new List<Order>();
    }
    public async Task UpdateOrderStatusAsync(Guid orderId, OrderStatus newStatus)
    {
        var order = await _repository.GetById<Order>(orderId);

        if (order == null)
            throw new KeyNotFoundException();

        if (order.Status == newStatus)
            throw new InvalidOperationException("La orden ya tiene el estado solicitado.");
        if (!IsValidTransition(order.Status, newStatus))
            throw new InvalidOperationException($"No se puede pasar de {order.Status} a {newStatus}.");

        order.Status = newStatus;

        await _repository.Update(order);

    }
    private bool IsValidTransition(OrderStatus current, OrderStatus next)
    {
        return (current, next) switch
        {
            (OrderStatus.Pending, OrderStatus.Processing) => true,
            (OrderStatus.Processing, OrderStatus.Shipped) => true,
            (OrderStatus.Shipped, OrderStatus.Delivered) => true,
            (_, OrderStatus.Cancelled) => true,
            _ => false
        };
    }


}