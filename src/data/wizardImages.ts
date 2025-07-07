// Configuración de imágenes del mago
// Actualiza este número cuando agregues o elimines imágenes de la carpeta public/assets/wizz/
export const WIZARD_IMAGE_COUNT = 8; // wizz_0.png a wizz_7.png

// Función para obtener una imagen aleatoria del mago
export const getRandomWizardImage = (): string => {
  const randomIndex = Math.floor(Math.random() * WIZARD_IMAGE_COUNT);
  return `/assets/wizz/wizz_${randomIndex}.png`;
}; 