"use client";

import { useRef, useState } from "react";

type FileUploadProps = {
  accept?: string;
  label?: string;
  onUploadComplete: (url: string, type: string) => void;
};

export default function FileUpload({
  accept = "image/*,application/pdf,audio/*",
  label = "Upload File",
  onUploadComplete,
}: FileUploadProps) {

  const inputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [preview, setPreview] =
    useState("");

  const handleFile = async (
    file?: File
  ) => {

    if (!file) return;

    setUploading(true);

    setMessage("Uploading...");

    try {

      const formData = new FormData();

      formData.append(
        "file",
        file
      );

      const response =
        await fetch(
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
          data.error ||
          "Upload failed"
        );

      }

      setMessage(
        "Upload successful!"
      );

      if (
        file.type.startsWith(
          "image/"
        )
      ) {

        setPreview(
          data.url
        );

      } else {

        setPreview("");

      }

      onUploadComplete(
        data.url,
        data.type
      );

    } catch (error: any) {

      setMessage(
        error.message ||
        "Upload failed"
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
        style={{
          display: "none",
        }}
        onChange={(e) =>
          handleFile(
            e.target.files?.[0]
          )
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

        <span
          className="file-upload-icon"
        >
          +
        </span>

        <span>

          {uploading
            ? "Uploading..."
            : label}

        </span>

      </button>

      {message && (

        <p
          className={
            message.includes(
              "successful"
            )
              ? "upload-status upload-success"
              : message.includes(
                  "failed"
                )
              ? "upload-status upload-error"
              : "upload-status"
          }
        >

          {message}

        </p>

      )}

      {preview && (

        <img
          src={preview}
          alt="Uploaded preview"
          className="upload-preview"
        />

      )}

    </div>

  );

}
