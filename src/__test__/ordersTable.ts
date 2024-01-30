export default {
  1: {
    orderId: 1,
    customerId: 101,
    items: [
      {itemId: 101, itemName: 'Cheeseburger', quantity: 2, price: 9.99},
      {itemId: 102, itemName: 'French Fries', quantity: 1, price: 3.49},
      {itemId: 103, itemName: 'Soda', quantity: 2, price: 1.99},
    ],
    totalPrice: 25.46,
    taxFree: false,
    status: 'open',
    timestamp: '2023-09-20T12:30:45Z',
  },
  2: {
    orderId: 2,
    customerId: 102,
    items: [
      {itemId: 104, itemName: 'Pizza', quantity: 1, price: 12.99},
      {itemId: 105, itemName: 'Garlic Bread', quantity: 1, price: 4.99},
      {itemId: 106, itemName: 'Salad', quantity: 1, price: 6.49},
    ],
    totalPrice: 24.47,
    taxFree: true,
    status: 'open',
    timestamp: '2023-09-20T13:15:20Z',
  },
  3: {
    orderId: 3,
    customerId: 103,
    items: [
      {itemId: 107, itemName: 'Chicken Sandwich', quantity: 2, price: 8.99},
      {itemId: 108, itemName: 'Onion Rings', quantity: 1, price: 4.49},
    ],
    totalPrice: 22.47,
    taxFree: false,
    status: 'open',
    timestamp: '2023-09-20T14:45:10Z',
  },
  4: {
    orderId: 4,
    customerId: 104,
    items: [
      {itemId: 109, itemName: 'Spaghetti', quantity: 1, price: 11.99},
      {itemId: 110, itemName: 'Caesar Salad', quantity: 1, price: 7.99},
      {itemId: 111, itemName: 'Iced Tea', quantity: 2, price: 2.49},
    ],
    totalPrice: 29.46,
    taxFree: true,
    status: 'open',
    timestamp: '2023-09-20T15:20:55Z',
  },
};
