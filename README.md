<p align="center">
  <a href="http://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" />
  </a>
</p>

# STAR WARS API

Backend desarrollado con NestJS para la gestión de películas del universo Star Wars, utilizando datos sincronizados desde la API pública [SWAPI](https://swapi.dev/).

---

## 🛠️ Instalación

1. Clonar el repositorio:

   ```bash
   git clone git@github.com:francojalil7/starwars-api.git
   cd starwars-api
   ```

2. Instalar dependencias:

   ```bash
   pnpm install
   ```

3. Copiar el archivo `.env.template` y renombrarlo a `.env`:

   ```bash
   cp .env.template .env
   ```

4. Agregar las variables de entorno entregadas por mail (como `JWT_SECRET`, configuración de la base de datos, etc.)

5. Levantar la base de datos con Docker:

   ```bash
   docker-compose up -d
   ```

6. Levantar la aplicación:

   ```bash
   pnpm start:dev
   ```

7. Ejecutar el endpoint de seed para insertar datos iniciales:
   ```
   POST http://localhost:3000/api/seed
   ```

---

## 🧪 Usuario de prueba ADMIN

Estas credenciales te permiten acceder a los endpoints protegidos con rol `ADMIN`:

```json
{
  "email": "admin@gmail.com",
  "password": "AdminSW123!"
}
```

---

## 📄 Documentación de la API

Swagger disponible en:

```
http://localhost:3000/api
```

---

## ✅ Características

- Autenticación con JWT
- Roles de usuario (`USER`, `ADMIN`)
- CRUD completo de películas
- Sincronización con [SWAPI](https://swapi.dev/) (cron diario y endpoint manual)
- Swagger documentado
- Tests unitarios de servicios y controladores

## 📚 Documentación

Para ver y probar los endpoints desde Swagger:

🔗 https://starwars-api-x6gk.onrender.com/api
