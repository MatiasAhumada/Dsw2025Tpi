using Dsw2025Tpi.Domain;
using Dsw2025Tpi.Domain.Entities;
using Dsw2025Tpi.Application.Dtos;
using System.Linq.Expressions;

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


            product.StockQuantity -= item.Quantity;

            orderItems.Add(new OrderItem(
                orderId: Guid.Empty,
                order: null!,
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

        order.SetOrderItems(orderItems);

        await _repository.Add(order);

        foreach (var item in orderItems)
        {
            item.OrderId = order.InternalCode;
            item.Order = order;
            await _repository.Add(item);
        }

        // Actualiza el stock de los productos
        foreach (var item in orderItems)
        {
            var product = await _repository.GetById<Product>(item.ProductId);
            if (product != null)
            {
                product.StockQuantity -= item.Quantity;
                await _repository.Update(product);
            }
        }

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
        // Filtro base
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

        order.Status = newStatus;

        await _repository.Update(order);
    }


}