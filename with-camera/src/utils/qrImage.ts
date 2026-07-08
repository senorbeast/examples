export async function createScannableImageUrl(file: File) {
  const bitmap = await createImageBitmap(file);
  const padding = Math.round(Math.max(bitmap.width, bitmap.height) * 0.14);
  const canvas = document.createElement("canvas");

  canvas.width = bitmap.width + padding * 2;
  canvas.height = bitmap.height + padding * 2;

  const context = canvas.getContext("2d");

  if (!context) {
    bitmap.close();
    return URL.createObjectURL(file);
  }

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.imageSmoothingEnabled = false;
  context.drawImage(bitmap, padding, padding);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  return URL.createObjectURL(blob ?? file);
}
