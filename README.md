# Ozkar

Sitio personal en HTML, servido por FastAPI. Un CSS. JavaScript solo en el reloj de vida, la calculadora dozenal y el calendario.

```bash
make setup
make run
```

El proceso escucha en el puerto 8000. Las claves van en `.env` (ver `.env.example`).

`data/site.sql` es la copia pública de la base. Si `data/blog.sqlite` no existe, el proceso lo crea desde esa copia.
