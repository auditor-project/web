import axios from "axios";
import { useState } from "react";
import { type ImageUploaderResponse } from "./types";

interface ImageUploadState {
  status: string;
  uploadKey: string | null;
}

const useFileUploader = () => {
  const [uploadStatus, setUploadStatus] = useState<ImageUploadState>({
    status: "idle",
    uploadKey: null,
  });
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleUpload = async (
    file: File,
    presSignUrl: ImageUploaderResponse
  ) => {
    if (!file || !presSignUrl) {
      return null;
    }

    setUploadStatus((prevStatus) => ({
      ...prevStatus,
      [file.name]: { state: "uploading", publicUrl: "none" },
    }));

    try {
      const formData = new FormData();
      Object.entries(presSignUrl.presignedPost.fields).forEach(
        ([key, value]) => {
          formData.append(key, value as string);
        }
      );
      formData.append("acl", "public-read");
      formData.append("Content-Type", presSignUrl.contentType);
      formData.append("file", file);

      await axios.post(presSignUrl.presignedPost.url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent: any) => {
          const uploadProgress = Math.round(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            (progressEvent.loaded / progressEvent.total) * 100
          );
          setUploadProgress(uploadProgress);
        },
      });

      setUploadStatus({
        status: "success",
        uploadKey: presSignUrl.uploadKey,
      });
    } catch (error) {
      setUploadStatus({
        status: "failed",
        uploadKey: presSignUrl.uploadKey,
      });
    }
  };

  return { uploadStatus, handleUpload, uploadProgress };
};

export default useFileUploader;
