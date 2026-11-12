export const ACCEPTED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_PHOTO_BYTES = 10 * 1024 * 1024;

// Returns why a file cannot be used, or null when it is fine.
export const getPhotoError = (file: File) => {
  if (!ACCEPTED_PHOTO_TYPES.includes(file.type)) return "Підходять лише JPG, PNG або WEBP.";
  if (file.size > MAX_PHOTO_BYTES) return "Фото завелике: максимум 10 МБ.";
  return null;
};

// The crop as fractions (0–1) of the image's width and height.
export type CropArea = { x: number; y: number; width: number; height: number };

// Cuts the chosen area out of the photo at full resolution and returns it as a blob URL.
export const cropPhoto = async (src: string, area: CropArea) => {
  const image = new Image();
  image.src = src;
  await image.decode();

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(image.naturalWidth * area.width);
  canvas.height = Math.round(image.naturalHeight * area.height);
  canvas
    .getContext("2d")
    ?.drawImage(
      image,
      image.naturalWidth * area.x,
      image.naturalHeight * area.y,
      canvas.width,
      canvas.height,
      0,
      0,
      canvas.width,
      canvas.height,
    );

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.9),
  );
  return blob ? URL.createObjectURL(blob) : src;
};
