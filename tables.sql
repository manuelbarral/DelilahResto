CREATE TABLE products (
	id INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY(id_product),
  name VARCHAR(250) NOT NULL,
  price INT NOT NULL
);

CREATE TABLE users (
	id INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY(id_user),
  userName VARCHAR(150) NOT NULL,
  psw VARCHAR(150) NOT NULL,
  name VARCHAR(150) NOT NULL,
  lastname VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  telephone VARCHAR(20) NOT NULL,
  address VARCHAR(150) NOT NULL,
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