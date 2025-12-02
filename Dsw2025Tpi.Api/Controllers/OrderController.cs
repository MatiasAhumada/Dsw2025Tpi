using Dsw2025Tpi.Application.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Dsw2025Tpi.Api.Controllers;

[ApiController]
[Route("api/orders")]
public class OrdersController : ControllerBase
{
    private readonly OrderService _orderService;

    public OrdersController(OrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest.RequestOrder request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var order = await _orderService.CreateOrderAsync(request);

            var response = new CreateOrderRequest.ResponseOrder(
                OrderId: order.GuidCode,
                CustomerId: order.CustomerId.ToString(),
                CustomerName: order.Customer?.Name ?? "Cliente",
                ShippingAddress: order.ShippingAddress,
                BillingAddress: order.BillingAddress,
                CreatedAt: order.Date,
                TotalAmount: order.TotalAmount,
                Status: order.Status.ToString(),
                OrderItems: order.OrderItems.Select(item => new CreateOrderRequest.ResponseOrderItem(
                    ProductId: item.ProductId,
                    Name: item.Product.Name,
                    Description: item.Product.Description,
                    UnitPrice: item.UnitPrice,
                    Quantity: item.Quantity,
                    Subtotal: item.Subtotal
                )).ToList()
            );

            return CreatedAtAction(nameof(GetOrderById), new { id = order.GuidCode }, response);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetOrderById(Guid id)
    {
        var order = await _orderService.GetOrderById(id);

        if (order == null)
            return NotFound(new { error = "Orden no encontrada" });
            
        var orderItems = order.OrderItems.Select(item => new CreateOrderRequest.ResponseOrderItem(
                   ProductId: item.ProductId,
                   Name: item.Product.Name,
                   Description: item.Product.Description,
                   UnitPrice: item.UnitPrice,
                   Quantity: item.Quantity,
                   Subtotal: item.Subtotal
               )).ToList();
               
        var response = new CreateOrderRequest.ResponseOrder(
            OrderId: order.GuidCode,
            CustomerId: order.CustomerId.ToString(),
            CustomerName: order.Customer?.Name ?? "Cliente",
            ShippingAddress: order.ShippingAddress,
            BillingAddress: order.BillingAddress,
            CreatedAt: order.Date,
            TotalAmount: order.TotalAmount,
            Status: order.Status.ToString(),
            orderItems
        );

        return Ok(response);
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllOrders()
    {
        try
        {
            var orders = await _orderService.GetAllOrdersAsync();

            var orderResponses = orders.Select(order => new CreateOrderRequest.ResponseOrder(
                OrderId: order.GuidCode,
                CustomerId: order.CustomerId.ToString(),
                CustomerName: order.Customer?.Name ?? "Cliente",
                ShippingAddress: order.ShippingAddress,
                BillingAddress: order.BillingAddress,
                CreatedAt: order.Date,
                TotalAmount: order.TotalAmount,
                Status: order.Status.ToString(),
                OrderItems: order.OrderItems.Select(item => new CreateOrderRequest.ResponseOrderItem(
                    ProductId: item.ProductId,
                    Name: item.Product.Name,
                    Description: item.Product.Description,
                    UnitPrice: item.UnitPrice,
                    Quantity: item.Quantity,
                    Subtotal: item.Subtotal
                )).ToList()
            ));

            return Ok(orderResponses ?? new List<CreateOrderRequest.ResponseOrder>());
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Ocurrió un error al obtener las órdenes.", detail = ex.Message });
        }
    }

    [HttpPut("{id}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateOrderStatus(Guid id, [FromBody] UpdateOrderStatusRequest request)
    {
        try
        {
            if (!Enum.TryParse<OrderStatus>(request.NewStatus, true, out var parsedStatus))
            {
                return BadRequest(new { error = "Estado de orden inválido." });
            }

            await _orderService.UpdateOrderStatusAsync(id, parsedStatus);

            return Ok(new UpdateOrderStatusResponse
            {
                NewStatus = parsedStatus.ToString()
            });
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { error = "Orden no encontrada." });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception)
        {
            return StatusCode(500, new { error = "Error interno del servidor." });
        }
    }
}