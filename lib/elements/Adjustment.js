class Adjustment {
  constructor({name='', amount=''}) {
    this.name = name;
    this.amount = amount;

    return {
      'name': this.name,
      'amount': this.amount,
    };

  }
}

export default Adjustment;
