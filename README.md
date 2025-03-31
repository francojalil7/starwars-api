<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Teslo API

## 🔑 Usuario de prueba ADMIN

Para probar los endpoints que requieren permisos de administrador, se pueden usar las siguientes credenciales:

```json
{
  "email": "admin@gmail.com",
  "password": "AdminSW123!"
}
```

1. Clonar proyecto
2. `pnpm install`
3. Copiar el archivo `.env.template` y renombrarlo a `.env`
4. Agregar las variables de entorno anteriormente entregadas por mail
5. Levantar la base de datos

```
docker-compose up -d
```

6. Levantar: `pnpm start:dev`

7. Ejecutar el POST del SEED

```
http://localhost:3000/api/seed
```
