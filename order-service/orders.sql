CREATE TABLE Order (
  id SERIAL PRIMARY KEY,
  userId INTEGER, -- foreign key to User._id in MongoDB (User Service)
  orderDate DATE,
  totalAmount DECIMAL(5,2)
);

CREATE TABLE OrderItem (
  id SERIAL PRIMARY KEY,
  orderId INTEGER REFERENCES Order(id),
  bookId INTEGER REFERENCES Book(id),
  quantity INTEGER,
  price DECIMAL(5,2)
);