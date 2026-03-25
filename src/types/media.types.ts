export interface Media {
  _id: string;
  url: string;
  alt?: string;
  type?: string;
  publicId?: string;
  fileName?: string;
  format?: string;
  bytes?: number;
  resourceType?: string;
  createdAt?: string;
}

export interface MediaUploadPayload {
  file: File;
  alt?: string;
  type?: string;
}

export interface MediaServiceStatus {
  configured: boolean;
  folder: string;
  supportsDocuments: boolean;
  supportsImages: boolean;
}
