# Componente Wizz

## Descripción
El componente Wizz es una sección interactiva que presenta frases aleatorias de sabiduría de forma mágica y misteriosa. Cada vez que se carga la página o se hace clic en el mago, se muestra una nueva frase del archivo `quotes.txt`.

## Características

### 🎭 Diseño Temático
- **Fuente Antigua**: Utiliza la fuente Cinzel para simular escritura antigua y manuscritos
- **Efectos Mágicos**: Bordes brillantes, sombras y animaciones que dan un toque místico
- **Comillas Decorativas**: Usa caracteres especiales (❝❞) con la fuente UnifrakturMaguntia

### 🧙‍♂️ Interactividad
- **Clic en el Mago**: Al hacer clic en la imagen del mago se genera una nueva frase
- **Actualización de Página**: Al recargar la página se muestra una frase diferente
- **Animación de Carga**: Muestra puntos animados mientras se genera la nueva frase

### 📱 Responsive Design
- **Desktop**: Layout en grid con el mago a la derecha
- **Mobile**: Layout vertical centrado para mejor experiencia móvil
- **Adaptación de Fuentes**: Tamaños y posicionamiento adaptados para diferentes pantallas

### 🎨 Efectos Visuales
- **Glow del Mago**: Efecto de resplandor alrededor de la imagen del mago
- **Bordes Animados**: Bordes que brillan con animación continua
- **Hover Effects**: Efectos al pasar el mouse sobre el mago
- **Fondo Mágico**: Gradientes sutiles que crean ambiente místico

## Estructura de Archivos
```
src/components/Wizz/
├── Wizz.tsx          # Componente principal
├── Wizz.scss         # Estilos con efectos mágicos
└── README.md         # Esta documentación
```

## Dependencias
- **Fuentes Google**: Cinzel y UnifrakturMaguntia para el estilo antiguo
- **React Hooks**: useState y useEffect para la funcionalidad
- **SCSS**: Variables y mixins del proyecto para consistencia

## Uso
El componente se accede a través de la ruta `/wizz` y está disponible en el menú de navegación como "WIZZ".

## Personalización
- Las frases se cargan desde `src/data/quotes.txt`
- Los colores y efectos usan las variables del proyecto para mantener consistencia
- La imagen del mago se encuentra en `public/assets/wizz.png` 