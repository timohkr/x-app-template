import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Box, Text, Image } from "@chakra-ui/react";

interface ImageDropzoneProps {
  onFileUpload: (file: File) => void;
}

export const ImageDropzone: React.FC<ImageDropzoneProps> = ({ onFileUpload }) => {
  const [preview, setPreview] = useState<string | null>(null); // To hold the image preview URL

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      onFileUpload(file); // Pass the file to the parent component

      // Create a preview of the image
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],  // Accept only image files
    },
    multiple: false,   // Single file upload
  });

  // Clean up the preview URL when the component unmounts or when a new file is selected
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <Box
      {...getRootProps()}
      p={4}
      borderWidth="2px"
      borderRadius="lg"
      borderColor={isDragActive ? "teal.500" : "gray.300"}
      borderStyle="dashed"
      textAlign="center"
      cursor="pointer"
      bg={isDragActive ? "gray.100" : "white"}
    >
      <input {...getInputProps()} />
      {preview ? (
        <Image src={preview} alt="Selected image preview" maxH="200px" objectFit="contain" mt={4} />
      ) : isDragActive ? (
        <Text>Drop the image here...</Text>
      ) : (
        <Text>Drag & drop an image, or click to select one</Text>
      )}
    </Box>
  );
};
