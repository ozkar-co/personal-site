# Personal Website

Este es mi sitio web personal, construido con React y TypeScript. El sitio presenta mi experiencia profesional, habilidades técnicas y formas de contacto.

## Características

- Diseño moderno y responsivo
- Sección de habilidades técnicas
- Enlaces a redes sociales
- Modo oscuro por defecto
- Optimizado para dispositivos móviles

## Tecnologías Utilizadas

- React 18
- TypeScript
- Vite
- CSS Moderno (Flexbox, Grid, Variables CSS)
- GitHub Actions para CI/CD
- GitHub Pages para hosting

## Desarrollo Local

1. Clona el repositorio:
```bash
git clone https://github.com/oscoobs/personal-site.git
cd personal-site
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

4. Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

## Despliegue

El sitio se despliega automáticamente en GitHub Pages cuando se hace push a la rama `main`. El proceso de despliegue está automatizado usando GitHub Actions.

Para desplegar manualmente:

```bash
npm run deploy
```

## Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye el sitio para producción
- `npm run preview`: Vista previa local de la versión de producción
- `npm run deploy`: Despliega el sitio en GitHub Pages

## Licencia

MIT
