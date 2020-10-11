CREATE TABLE products (
  id INT PRIMARY KEY NOT NULL AUTO_INCREMENT ,
  name VARCHAR(150) NOT NULL UNIQUE,
  price INT NOT NULL
);

CREATE TABLE users (
  id INT PRIMARY KEY NOT NULL AUTO_INCREMENT ,
  userName VARCHAR(150) NOT NULL UNIQUE,
  psw VARCHAR(15) NOT NULL,
  name VARCHAR(150) NOT NULL,
  lastname VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  telephone INT(15) NOT NULL,
  address VARCHAR(200) NOT NULL,
  admin VARCHAR(5) NOT NULL
);

CREATE TABLE orders(
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    id_user INT NOT NULL,
    FOREIGN KEY FK_idUser (id_user) REFERENCES users(id),
    description VARCHAR (150) NOT NULL,
    dateOrder DATE NOT NULL,
    paymentMethod VARCHAR(60) NOT NULL,
    price INT NOT NULL,
    state VARCHAR(60) NOT NULL
);
CREATE TABLE infoorders (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    id_order INT NOT NULL,
    id_product INT NOT NULL,
    FOREIGN KEY FK_orders (id_order) REFERENCES orders(id),
    FOREIGN KEY FK_products (id_product) REFERENCES products(id)
)