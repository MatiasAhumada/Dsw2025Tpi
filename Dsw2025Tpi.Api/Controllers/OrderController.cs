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

        // Mapear la entidad Order a OrderRecord.ResponseOrder
        var response = new CreateOrderRequest.ResponseOrder(
            OrderId: order.InternalCode,
            CustomerId: order._customerId,
            ShippingAddress: order._shippingAddress,
            BillingAddress: order._billingAddress,
            CreatedAt: order._date,
            TotalAmount: order._totalAmount,
            OrderItems: order._orderItems.Select(item => new CreateOrderRequest.ResponseOrderItem(
                ProductId: item._productId,
                Name: item._product.Name,
                Description: item._product.Description,
                UnitPrice: item._unitPrice,
                Quantity: item._quantity,
                Subtotal: item._subtotal
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
        return Ok();
    }
}
    