"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (item: CartItem) => void
  removeCartItem: (id: string) => void
  updateCartItem: (id: string, quantity: number) => void
  clearCart: () => void
  subtotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  // Load cart from localStorage on initial mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart))
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error)
        localStorage.removeItem("cart")
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (itemToAdd: CartItem) => {
    setCartItems((prevItems: CartItem[]) => {
      const existingItem = prevItems.find((item: CartItem) => item.id === itemToAdd.id)
      
      if (existingItem) {
        // Update quantity if item already exists
        return prevItems.map((item: CartItem) => 
          item.id === itemToAdd.id 
            ? { ...item, quantity: item.quantity + itemToAdd.quantity } 
            : item
        )
      } else {
        // Add new item
        return [...prevItems, itemToAdd]
      }
    })
  }

  const removeCartItem = (id: string) => {
    setCartItems((prevItems: CartItem[]) => prevItems.filter((item: CartItem) => item.id !== id))
  }

  const updateCartItem = (id: string, quantity: number) => {
    setCartItems((prevItems: CartItem[]) => 
      prevItems.map((item: CartItem) => 
        item.id === id ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  const subtotal = cartItems.reduce(
    (total: number, item: CartItem) => total + item.price * item.quantity, 
    0
  )

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeCartItem, 
      updateCartItem, 
      clearCart, 
      subtotal 
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
