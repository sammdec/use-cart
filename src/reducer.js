const addItemReducer = (state, action) => {
  const existingItemIndex = state.items.findIndex(
    item => item.sku === action.payload.sku
  )

  if (existingItemIndex > -1) {
    const newState = [...state.items]
    newState[existingItemIndex].quantity += action.payload.quantity
    return newState
  }
  return [...state.items, action.payload]
}

const removeItemReducer = (state, action) => {
  return state.items.reduce((acc, item) => {
    if (item.sku === action.payload.sku) {
      const newQuantity = item.quantity - action.payload.quantity

      return newQuantity > 0
        ? [...acc, { ...item, quantity: newQuantity }]
        : [...acc]
    }
    return [...acc, item]
  }, [])
}

const removeLineItemReducer = (state, action) => {
  return state.items.filter(item => item.sku !== action.payload.sku)
}

export const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM":
      return { items: addItemReducer(state, action) }
    case "REMOVE_ITEM":
      return { items: removeItemReducer(state, action) }
    case "REMOVE_LINE_ITEM":
      return { items: removeLineItemReducer(state, action) }
    case "CLEAR_CART":
      return { items: [] }
  }
}
