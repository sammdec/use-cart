# `use-cart`

> A tiny react hook for creating a e-commerce cart in your app

<a href="https://travis-ci.org/samjbmason/use-cart"><img alt="Build Status" src="https://img.shields.io/travis/samjbmason/use-cart.svg?style=flat-square"/></a> <a href="https://coveralls.io/github/samjbmason/use-cart?branch=master"><img alt="Coverage Status" src="https://img.shields.io/coveralls/github/samjbmason/use-cart.svg?style=flat-square"/></a> <a href="https://github.com/samjbmason/use-cart"><img alt="dependencies" src="https://img.shields.io/david/samjbmason/use-cart.svg?style=flat-square"/></a> <a href="https://bundlephobia.com/result?p=use-cart"><img alt="package size" src="https://img.shields.io/bundlephobia/min/use-cart.svg?style=flat-square"/></a>

## Installation

> Note: please ensure you install versions >= 16.8.0 for both react and react-dom, as this library depends on the new hooks feature

## NPM

```
npm i use-cart --save
```

## Yarn

```
yarn add use-cart
```

## Quick Start

```js
import { CartProvider, useCart } from "use-cart"

// Wrap your app to expose the store
const App = () => (
  <CartProvider>
    <>
      <Item />
      <Cart />
    </>
  </CartProvider>
)

// Add the hook in any child component to get access to functions
const Item = () => {
  const { addItem } = useCart()
  return (
    <div>
      <p>My item for sale</p>
      <button onClick={() => addItem("TEST_SKU")}>Add to basket</button>
    </div>
  )
}

// You can use the hook in as many components as you want and they all share the same cart state
const Cart = () => {
  const { items, addItem, removeItem, removeLineItem, clearCart } = useCart()

  return (
    <div>
      {items.map(item => (
        <div>
          {item.sku} - {item.quantity}{" "}
          <Button onClick={() => addItem(item.sku)}>Increase Quantity</Button>
          <Button onClick={() => removeItem(item.sku)}>
            Decrease Quantity
          </Button>
          <Button onClick={() => removeLineItem(item.sku)}>
            Remove from cart
          </Button>
        </div>
      ))}
      <Button onClick={clearCart}>Clear Cart</Button>
    </div>
  )
}
```

## Examples

- Basic
- Using local storage to load a saved cart

## API

### `<CartProvider>`

Passes the cart object to the `useCart` hook

#### Props

`initialCart (Array)`: initial state that the cart will contain on initial render, it must be an array of objects

`children (React.ReactNode)`: react component, usually containing the rest of your app

### `useStore()`

The main hook must be wrapped with the `CartProvider` component at some point in the ancestor tree

#### Returns

Object containing:

- `addItem(sku, [quantity=1]): Function` - takes a sku an optional quantity (defaults to 1) to add to the cart
- `removeItem(sku, [quantity=1]): Function` - removes an item from the cart defaults to a quantity of 1.
- `removeLineItem(sku): Function` - removes an entire line item from the cart
- `clearCart(): Function` - removes all items from the cart
- `isInCart(sku): Function` - returns `true` if sku is present in the cart otherwise `false`
- `items: Array` - array of objects containing a minimum of `sku` and `quantity` properties on each object
- `lineItemsCount: Number` - returns number of unique line items n the cart
- `totalItemsCount: Number` - returns number of all quantities of line items combined

## Detailed API from `useCart` object

### `addItem(sku, [quantity=1])`

This method adds an item to the cart identified by its sku, if you would like to add more quantity you can pass an optional quantity value.

#### Arguments

`sku (String)`: The unique item sku that identifies the item in the cart

`[quantity=1] (Number)`: The quantity added to the cart

#### Returns

`(undefined)`

---

### `removeItem(sku, [quantity=1])`

Removes a quantity from an item in the cart if this number drops to 0 the line item is removed from the cart.

#### Arguments

`sku (String)`: The unique item sku that identifies the item in the cart

`[quantity=1] (Number)`: The quantity removed from the cart

#### Returns

`(undefined)`

---

### `removeLineItem(sku)`

A convenience function that removes an entire line item from the cart. This would be the same thing as getting the quantity of a line item then calling `removeItem()` by that quantity.

#### Arguments

`sku (String)`: The unique item sku that identifies the item in the cart

#### Returns

`(undefined)`

---

### `isInCart(sku)`

Allows you to quickly check if a item with the given sku is present in the cart

#### Arguments

`sku (String)`: The unique item sku that identifies the item in the cart

#### Returns

`(boolean)`: Returns `true` if the sku exists in the cart

---

### `items`

`(array)`: An array containing objects with `sku` and `quantity` properties of each item in the cart.

---

### `lineItemsCount`

`(number)`: The number of unique skus in the cart

---

### `totalItemsCount`

`(number)`: The number of all the quantities from all the sku's in the cart
