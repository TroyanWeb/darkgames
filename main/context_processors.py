def cart_context(request):
    cart = request.session.get('cart', {})
    total_price = sum(item['price'] for item in cart.values())
    item_count = len(cart)
    return {
        'cart': cart,
        'total_price': total_price,
        'item_count': item_count
    }

