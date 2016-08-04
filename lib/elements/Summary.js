class Summary {
  constructor({ total_cost, subtotal='', shipping_cost='', total_tax='' }) {
    this.total_cost = total_cost;
    this.subtotal = subtotal;
    this.shipping_cost = shipping_cost;
    this.total_tax = total_tax;

    return {
      total_cost: this.total_cost,
      subtotal: this.subtotal,
      shipping_cost: this.shipping_cost,
      total_tax: this.total_tax
    };

  }
}

export default Summary;
