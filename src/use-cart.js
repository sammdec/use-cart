import React, { useReducer, useContext, createContext } from "react"
import { reducer } from "./reducer"
const CartContext = createContext()

export const CartProvider = ({ children, initialCart = [] }) => {
  const [state, dispatch] = useReducer(reducer, { items: initialCart })

  const addItemHandler = (sku, quantity = 1) => {
    dispatch({ type: "ADD_ITEM", payload: { sku, quantity } })
  }

  const removeItemHandler = (sku, quantity = 1) => {
    dispatch({ type: "REMOVE_ITEM", payload: { sku, quantity } })
  }

  const getItemsCount = state.items.reduce(
    (acc, item) => acc + item.quantity,
    0
  )

  const removeLineItemHandler = sku => {
    dispatch({ type: "REMOVE_LINE_ITEM", payload: { sku } })
  }

  const clearCartHandler = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  const isInCartHandler = sku => {
    const item = getItemHandler(sku)
    return item ? true : false
  }

  const getItemHandler = sku => {
    return state.items.find(item => item.sku === sku)
  }

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        lineItemsCount: state.items.length,
        itemsCount: getItemsCount,
        addItem: addItemHandler,
        removeItem: removeItemHandler,
        removeLineItem: removeLineItemHandler,
        clearCart: clearCartHandler,
        isInCart: isInCartHandler,
        getItem: getItemHandler
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
