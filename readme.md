# Delilah Resto API

API para un restaurant de pedidos, creada con Node.js y MySQL.

---

## Que necesitarás para utilizar la API

Será necesario tener instalado Node.js, Postman y XAMPP. Si no los tienes instalado aquí encontrarás los pasos para la instalación de los mismos.

- Instalar Node.js

  Ingresa a [nodejs.org](https://nodejs.org/en/) y encontrarás un botón de descarga, el cual tendrá la versión necesaria para tu sistema operativo. A su vez hay una sección de descargas para que eligas la versión a tu convenienza.

  Si la instalación fue exitosa deberías poder correr sin ningún problema los comandos `node --version` y `npm --version` en la consola/terminal.

  ```node
  node --version
  v14.7.0

  npm --version
  v6.14.7
  ```

- Instalar Postman

  Ingresa a [Postman](https://www.postman.com/) y ve a la sección de descarga.

- Instalar XAMPP

  Ingresa a [XAMPP](https://www.apachefriends.org/es/index.html) y sigue los pasos.

---

## Empezando

Para usar la API empieza clonando el repositorio.

```bash
git clone https://github.com/manuelbarral/DelilahResto.git
```

## Instalación

Ejecuta `npm install` en la consola para installar todas las dependencias.

```node
npm install
```

## Creación de la base de datos

En el archivo _tables.sql_ encontrarás las estructuras de las tablas para la creación de la base de datos.

---

## Iniciando el servidor

- Ejecuta el servidor:

  1- _npm start_:

  ```node
  npm start
  ```

  _Ejecuta el archivo ***server.js*** una única vez_.

  ó

  2- _npm run dev_:

  ```node
  npm run dev
  ```

  _Ejecuta el archivo ***server.js*** automáticamente cada vez que guardas el archivo. Detrás de este comando trabaja 'nodemon'_.

  > Ambos comandos ejecutarlos desde la terminal.

- Inicia Xampp y una vez en el panel de control haz click en los botones _start_ de las filas Apache y MySQL.

- Abre tu navegador preferido y escribe la dirección `http://localhost:3000`.
- **_*Listo! Ya puedes hacer las pruebas desde Postman!*_**

---

## Endpoints

Encontrarás los endpoints en el archivo **_*spec.yaml*_**.

### Formatos _JSON_

- Para crear un usuario:

  ```json
  {
  	"userName": "john_doe",
  	"psw": "johndoe1234",
  	"name": "John",
  	"lastname": "Doe",
  	"email": "john@gmail.com",
  	"telephone": "2235555555",
  	"address": "address 1234",
  	"admin": "true"
  }
  ```

  > **_*Importante*:_** Debes crear un usuario administrador. No viene creado por defecto. Se pueden crear varios administradores.

- Para crear un producto:

  ```json
  {
  	"name": "Hamburguesa clásica",
  	"price": 350
  }
  ```

- Para crear un pedido:

  ```json
  {
  	"products": [
  		{"name": "Hamburguesa clásica", "quantity": 2},
  		{"name": "Sandwich veggie", "quantity": 1}
  	],
  	"paymentMethod": "Efectivo"
  }
  ```

---

## Autor

- **_*Manuel Barral*_**
