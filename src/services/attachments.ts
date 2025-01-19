import type { Attachment } from '../types';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png'
];

export class FileValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FileValidationError';
  }
}

export async function validateFile(file: File): Promise<void> {
  if (file.size > MAX_FILE_SIZE) {
    throw new FileValidationError(`Le fichier ${file.name} dépasse la taille maximale de 10 MB`);
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new FileValidationError(`Le type de fichier ${file.type} n'est pas autorisé`);
  }
}

export async function uploadAttachment(file: File): Promise<Attachment> {
  await validateFile(file);

  // Simuler un délai d'upload
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Dans un environnement réel, vous utiliseriez un service de stockage
  // comme Supabase Storage ou AWS S3
  const attachment: Attachment = {
    id: Math.random().toString(36).substring(7),
    name: file.name,
    type: file.type,
    size: file.size,
    url: URL.createObjectURL(file),
    uploadedAt: new Date()
  };

  return attachment;
}