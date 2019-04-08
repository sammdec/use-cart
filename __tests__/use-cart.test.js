import { renderHook, act, cleanup } from "react-hooks-testing-library"

import { CartProvider, useCart } from "../src/use-cart"

afterEach(cleanup)

describe("useCart()", () => {
  describe("items", () => {
    test("default cart is an empty array", () => {
      const { result } = renderHook(() => useCart(), { wrapper: CartProvider })
      expect(result.current.items).toBeInstanceOf(Array)
      expect(result.current.items).toHaveLength(0)
    })
  })

  describe("addItem", () => {
    test("adds SKU to cart object", () => {
      const { result } = renderHook(() => useCart(), { wrapper: CartProvider })
      act(result.current.addItem("TEST_SKU"))
      expect(result.current.items).toContainEqual(
        expect.objectContaining({ sku: "TEST_SKU" })
      )
      expect(result.current.items).toContainEqual(
        expect.objectContaining({ quantity: 1 })
      )
    })

    test("adding SKU to cart increments quantity to 1 by default", () => {
      const { result } = renderHook(() => useCart(), { wrapper: CartProvider })
      act(result.current.addItem("TEST_SKU"))

      expect(result.current.items).toContainEqual(
        expect.objectContaining({ quantity: 1 })
      )
    })

    test("adding a custom quantity will set that to the amount in the line item", () => {
      const { result } = renderHook(() => useCart(), { wrapper: CartProvider })
      act(result.current.addItem("TEST_SKU", 20))

      expect(result.current.items).toContainEqual(
        expect.objectContaining({ quantity: 20 })
      )
    })

    test("adding the same SKU a second time will increment the quantity and not add a new line item", () => {
      const { result } = renderHook(() => useCart(), { wrapper: CartProvider })
      act(result.current.addItem("TEST_SKU"))
      act(result.current.addItem("TEST_SKU"))

      expect(result.current.items).toHaveLength(1)
      expect(result.current.items).toContainEqual(
        expect.objectContaining({ quantity: 2 })
      )
    })

    test("adding a new SKU will create a new line item in the cart object", () => {
      const { result } = renderHook(() => useCart(), { wrapper: CartProvider })
      act(result.current.addItem("TEST_SKU"))
      act(result.current.addItem("TEST_SKU_2"))

      expect(result.current.items).toHaveLength(2)
      expect(result.current.items).toContainEqual(
        expect.objectContaining({ sku: "TEST_SKU", quantity: 1 })
      )
      expect(result.current.items).toContainEqual(
        expect.objectContaining({ sku: "TEST_SKU_2", quantity: 1 })
      )
    })
  })

  describe("removeItem", () => {
    test("will remove 1 quantity by default", () => {
      const { result } = renderHook(() => useCart(), { wrapper: CartProvider })
      act(result.current.addItem("TEST_SKU", 2))
      act(result.current.removeItem("TEST_SKU"))

      expect(result.current.items).toHaveLength(1)
      expect(result.current.items).toContainEqual(
        expect.objectContaining({ quantity: 1 })
      )
    })

    test("will maintain position in array when item is removed", () => {
      const { result } = renderHook(() => useCart(), { wrapper: CartProvider })
      act(result.current.addItem("TEST_SKU_0", 2))
      act(result.current.addItem("TEST_SKU_1", 2))
      act(result.current.addItem("TEST_SKU_2", 2))
      act(result.current.removeItem("TEST_SKU_1"))

      expect(result.current.items).toHaveLength(3)
      expect(result.current.items[1]).toEqual({
        quantity: 1,
        sku: "TEST_SKU_1"
      })
    })

    test("will remove line item when quantity removed is greater than quantity in cart object", () => {
      const { result } = renderHook(() => useCart(), { wrapper: CartProvider })
      act(result.current.addItem("TEST_SKU_0", 2))
      act(result.current.addItem("TEST_SKU_1", 2))
      act(result.current.addItem("TEST_SKU_2", 2))
      act(result.current.removeItem("TEST_SKU_1", 2))

      expect(result.current.items).toHaveLength(2)
    })

    test("won't change anything when a non existent SKU is attempted to be removed", () => {
      const { result } = renderHook(() => useCart(), { wrapper: CartProvider })
      act(result.current.addItem("TEST_SKU_0", 2))
      act(result.current.addItem("TEST_SKU_2", 2))
      act(result.current.removeItem("TEST_SKU_1", 2))

      expect(result.current.items).toHaveLength(2)
    })
  })

  describe("lineItemsCount", () => {
    test("default is 0 with empty cart", () => {
      const { result } = renderHook(() => useCart(), { wrapper: CartProvider })

      expect(result.current.lineItemsCount).toBe(0)
    })

    test("is 1 after item is added", () => {
      const { result } = renderHook(() => useCart(), { wrapper: CartProvider })
      act(result.current.addItem("TEST_SKU_0", 2))

      expect(result.current.lineItemsCount).toBe(1)
    })
  })

  describe("itemsCount", () => {
    test("default is 0 with empty cart", () => {
      const { result } = renderHook(() => useCart(), { wrapper: CartProvider })

      expect(result.current.itemsCount).toBe(0)
    })

    test("is 2 after item is added with quantity of 2 is added", () => {
      const { result } = renderHook(() => useCart(), { wrapper: CartProvider })
      act(result.current.addItem("TEST_SKU_0", 2))

      expect(result.current.itemsCount).toBe(2)
    })

    test("is 0 after items are added and then removed", () => {
      const { result } = renderHook(() => useCart(), { wrapper: CartProvider })
      act(result.current.addItem("TEST_SKU_0", 2))
      expect(result.current.itemsCount).toBe(2)

      act(result.current.removeItem("TEST_SKU_0", 2))
      expect(result.current.itemsCount).toBe(0)
    })
  })

  describe("removeLineItem", () => {
    test("removes entire line item", () => {
      const { result } = renderHook(() => useCart(), { wrapper: CartProvider })

      act(result.current.addItem("TEST_SKU_0", 2))
      act(result.current.removeLineItem("TEST_SKU_0"))

      expect(result.current.lineItemsCount).toBe(0)

      act(result.current.addItem("TEST_SKU_0", 2))
      act(result.current.addItem("TEST_SKU_1", 2))

      act(result.current.removeLineItem("TEST_SKU_0"))

      expect(result.current.lineItemsCount).toBe(1)
    })
  })

  describe("clearCart", () => {
    test("clears cart to empty array", () => {
      const { result } = renderHook(() => useCart(), { wrapper: CartProvider })

      act(result.current.addItem("TEST_SKU_0", 2))
      act(result.current.addItem("TEST_SKU_1", 2))

      expect(result.current.lineItemsCount).toBe(2)

      act(result.current.clearCart())

      expect(result.current.lineItemsCount).toBe(0)
    })
  })

  describe("isInCart", () => {
    test("returns true if sku is found in cart object", () => {
      const { result } = renderHook(() => useCart(), { wrapper: CartProvider })

      act(result.current.addItem("TEST_SKU_0", 1))

      expect(result.current.isInCart("TEST_SKU_0")).toBe(true)
    })
  })
})
