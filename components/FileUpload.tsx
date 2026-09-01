"use client";

import { useRef, useState } from "react";

type Props = {
  accept?: string;
  label?: string;
  onUploadComplete: (
    url: string,
    type: string,
    name: string
  ) => void;
};

export default function FileUpload({
  accept = "image/*,audio/*,application/pdf",
  label = "Upload File",
  onUploadComplete,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const uploadFile = async (
    file?: File
  ) => {
    if (!file) return;

    setUploading(true);
    setMessage("Uploading...");

    try {
      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch(
        "/api/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Upload failed"
        );
      }

      setMessage("Upload successful!");

      onUploadComplete(
        data.url,
        data.type,
        file.name
      );
    } catch (error: any) {
      setMessage(
        error.message || "Upload failed"
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="file-upload">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: "none" }}
        onChange={(e) =>
          uploadFile(e.target.files?.[0])
        }
      />

      <button
        type="button"
        className="file-upload-button"
        disabled={uploading}
        onClick={() =>
          inputRef.current?.click()
        }
      >
        <span className="file-upload-icon">
          +
        </span>

        <span>
          {uploading
            ? "Uploading..."
            : label}
        </span>
      </button>

      {message && (
        <p className="upload-status">
          {message}
        </p>
      )}
    </div>
  );
}
