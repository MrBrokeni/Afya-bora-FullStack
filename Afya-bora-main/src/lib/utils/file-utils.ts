export const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const capturePhotoFromCanvas = (
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement
): Promise<File> => {
  return new Promise((resolve, reject) => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    
    if (!context) {
      reject(new Error('Could not get canvas context'));
      return;
    }
    
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(blob => {
      if (blob) {
        const newFile = new File([blob], `capture-${Date.now()}.png`, { type: 'image/png' });
        resolve(newFile);
      } else {
        reject(new Error('Failed to create blob from canvas'));
      }
    }, 'image/png');
  });
};

export const validateFileSize = (file: File, maxSizeMB: number = 5): boolean => {
  return file.size <= maxSizeMB * 1024 * 1024;
};

export const validateFileType = (file: File): boolean => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
  return allowedTypes.includes(file.type);
};
