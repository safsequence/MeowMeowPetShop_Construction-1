import React, { useState } from 'react';
import { ShoppingCart, X, Plus, Minus, Trash2, MessageCircle } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';

export function FloatingCart() {
  const [isOpen, setIsOpen] = useState(false);
  const { state, removeItem, updateQuantity } = useCart();
  const { items, total, itemCount } = state;

  const formatPrice = (price: number) => {
    return `৳${price.toFixed(2)}`;
  };

  return (
    <>
      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-row gap-3">
        {/* Messenger Button */}
        <Link href="/messenger">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
            data-testid="floating-messenger-button"
          >
            <MessageCircle size={24} />
          </button>
        </Link>
        
        {/* Cart Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-[#26732d] hover:bg-[#1e5d26] text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
          data-testid="floating-cart-button"
        >
          <ShoppingCart size={24} />
          {itemCount > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white min-w-[20px] h-5 flex items-center justify-center text-xs">
              {itemCount}
            </Badge>
          )}
        </button>
      </div>

      {/* Cart Sidebar */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-[9998]"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Cart Panel */}
          <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-[9999] transform transition-transform duration-300">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b bg-[#26732d] text-white">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <ShoppingCart size={20} />
                  Shopping Cart
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-[#1e5d26] p-1 rounded"
                  data-testid="close-cart-button"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4">
                {items.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Your cart is empty</p>
                    <Button 
                      onClick={() => setIsOpen(false)}
                      className="mt-4 bg-[#26732d] hover:bg-[#1e5d26]"
                    >
                      Continue Shopping
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="border rounded-lg p-3" data-testid={`cart-item-${item.id}`}>
                        <div className="flex items-start gap-3">
                          <img 
                            src={item.image || '/api/placeholder/60/60'} 
                            alt={item.name}
                            className="w-15 h-15 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                            <p className="text-[#26732d] font-bold">{formatPrice(item.price)}</p>
                            
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2 mt-2">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="bg-gray-100 hover:bg-gray-200 rounded-full p-1"
                                data-testid={`decrease-quantity-${item.id}`}
                              >
                                <Minus size={14} />
                              </button>
                              <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="bg-gray-100 hover:bg-gray-200 rounded-full p-1"
                                data-testid={`increase-quantity-${item.id}`}
                              >
                                <Plus size={14} />
                              </button>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="bg-red-100 hover:bg-red-200 text-red-600 rounded-full p-1 ml-2"
                                data-testid={`remove-item-${item.id}`}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="border-t p-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-bold">Total:</span>
                    <span className="text-xl font-bold text-[#26732d]">{formatPrice(total)}</span>
                  </div>
                  <div className="space-y-2">
                    <Link href="/cart">
                      <Button 
                        className="w-full bg-[#26732d] hover:bg-[#1e5d26]"
                        onClick={() => setIsOpen(false)}
                        data-testid="view-cart-button"
                      >
                        View Cart
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      className="w-full border-[#26732d] text-[#26732d] hover:bg-[#26732d] hover:text-white"
                      data-testid="checkout-button"
                    >
                      Checkout
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}