export interface ImageUploaderResponse {
  uniqueFileName: string;
  fileExtension: string;
  contentType: string;
  presignedPost: PresignedPost;
  type: string;
  acl: string;
  uploadKey: string;
}

export interface PresignedPost {
  url: string;
  fields: Fields;
}

export interface Fields {
  Key: string;
  bucket: string;
  "X-Amz-Algorithm": string;
  "X-Amz-Credential": string;
  "X-Amz-Date": string;
  key: string;
  Policy: string;
  "X-Amz-Signature": string;
}
