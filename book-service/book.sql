CREATE TABLE Book (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100),
  author VARCHAR(100),
  publishedDate DATE,
  summary TEXT,
  price DECIMAL(5,2),
  quantity INTEGER
);