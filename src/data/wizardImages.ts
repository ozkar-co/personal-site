// Configuración de imágenes del mago
// Actualiza este número cuando agregues o elimines imágenes de la carpeta public/assets/wizz/
export const WIZARD_IMAGE_COUNT = 14; // wizz_0.png a wizz_13.png

// Función para obtener una imagen aleatoria del mago
export const getRandomWizardImage = (): string => {
  const randomIndex = Math.floor(Math.random() * WIZARD_IMAGE_COUNT);
  console.log(randomIndex);
  return `/assets/wizz/wizz_${randomIndex}.png`;
}; 