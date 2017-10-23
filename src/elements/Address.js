class Address {
  constructor({
    street_1, city, postal_code, state, country, street_2 = '',
  }) {
    this.street_1 = street_1;
    this.city = city;
    this.postal_code = postal_code;
    this.state = state;
    this.country = country;
    this.street_2 = street_2;

    return {
      street_1: this.street_1,
      street_2: this.street_2,
      city: this.city,
      postal_code: this.postal_code,
      state: this.state,
      country: this.country,
    };
  }
}

export default Address;
