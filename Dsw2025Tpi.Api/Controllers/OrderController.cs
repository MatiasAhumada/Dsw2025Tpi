using Dsw2025Tpi.Application.Dtos;
using Dsw2025Tpi.Application.Exceptions;
using Dsw2025Tpi.Application.Services;
using Dsw2025Tpi.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

using Microsoft.EntityFrameworkCore;
using System.Linq;


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
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest.RequestOrder request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var order = await _orderService.CreateOrderAsync(request);

            var response = new CreateOrderRequest.ResponseOrder(
                OrderId: order.InternalCode,
                CustomerId: order.CustomerId.ToString(),  // sin _
                ShippingAddress: order.ShippingAddress,
                BillingAddress: order.BillingAddress,
                CreatedAt: order.Date,
                TotalAmount: order.TotalAmount,
                OrderItems: order.OrderItems.Select(item => new CreateOrderRequest.ResponseOrderItem(
                    ProductId: item.ProductId,
                    Name: item.Product.Name,
                    Description: item.Product.Description,
                    UnitPrice: item.UnitPrice,
                    Quantity: item.Quantity,
                    Subtotal: item.Subtotal
                )).ToList()
            );

            return CreatedAtAction(nameof(GetOrderById), new { id = order.InternalCode }, response);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
    [HttpGet("{id}")]
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
       OrderId: order.InternalCode,
       CustomerId: order.CustomerId.ToString(),
       ShippingAddress: order.ShippingAddress,
       BillingAddress: order.BillingAddress,
       CreatedAt: order.Date,
       TotalAmount: order.TotalAmount,
       orderItems
   );

        return Ok(response);
    }
    [HttpGet]
    public async Task<IActionResult> GetAllOrders(
    [FromQuery] string? status,
    [FromQuery] Guid? customerId,
    [FromQuery] int pageNumber = 1,
    [FromQuery] int pageSize = 10)
    {
        try
        {
            var orders = await _orderService.GetAllOrdersAsync(status, customerId, pageNumber, pageSize);

            var response = orders.Select(order => new CreateOrderRequest.ResponseOrder(
                OrderId: order.InternalCode,
                CustomerId: order.CustomerId.ToString(),
                ShippingAddress: order.ShippingAddress,
                BillingAddress: order.BillingAddress,
                CreatedAt: order.Date,
                TotalAmount: order.TotalAmount,
                OrderItems: order.OrderItems.Select(item => new CreateOrderRequest.ResponseOrderItem(
                    ProductId: item.ProductId,
                    Name: item.Product.Name,
                    Description: item.Product.Description,
                    UnitPrice: item.UnitPrice,
                    Quantity: item.Quantity,
                    Subtotal: item.Subtotal
                )).ToList()
            ));

            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Ocurrió un error al obtener las órdenes.", detail = ex.Message });
        }
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateOrderStatus(Guid id, [FromBody] UpdateOrderStatusRequest request)
    {
        if (!Enum.TryParse<OrderStatus>(request.NewStatus, ignoreCase: true, out var newStatus))
            return BadRequest(new { error = "Estado inválido." });

        try
        {
            await _orderService.UpdateOrderStatusAsync(id, newStatus);
            return NoContent(); 
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { error = "Orden no encontrada." });
        }
    }

}
