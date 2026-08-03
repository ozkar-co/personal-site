// Configuración de imágenes del mago
// Actualiza este número cuando agregues o elimines imágenes de public/assets/wizz/
export const WIZARD_IMAGE_COUNT = 14; // wizz_0.webp a wizz_13.webp

export const getWizardImagePath = (index: number): string =>
  `/assets/wizz/wizz_${index}.webp`;

export const getRandomWizardImage = (): string => {
  const randomIndex = Math.floor(Math.random() * WIZARD_IMAGE_COUNT);
  return getWizardImagePath(randomIndex);
};

export const preloadWizardImages = (): void => {
  for (let i = 0; i < WIZARD_IMAGE_COUNT; i++) {
    const img = new Image();
    img.src = getWizardImagePath(i);
  }
};
