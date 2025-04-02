import Image from "next/image";
import React, { useState } from "react";

interface ImageInputProps {
  id: string;
  name: string;
  label: string;
  required?: boolean;
  dragInstruction: string;
}

const ImageInput: React.FC<ImageInputProps> = ({
  id,
  name,
  label,
  required,
  dragInstruction,
}) => {
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Por favor, carga solo imágenes.");
      setImage(null);
      return;
    }
    setError(null);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImage(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-48">
      <div className="flex flex-col text-center">
        <label htmlFor={id} className="text-lg font-bold">
          {label}
        </label>

        <div
          className="bg-white  min-h-56 border-2 rounded-sm flex justify-center cursor-pointer border-gray-500"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => document.getElementById(id)?.click()}
        >
          {image ? (
            <Image
              src={image}
              alt="Imagen cargada"
              className=" object-cover"
              width={300}
              height={300}
            />
          ) : (
            <div className="flex flex-col items-center">
              <Image
                src="/uploadImageButton.png"
                alt="button upload"
                className="my-8"
                width={40}
                height={40}
              ></Image>
              <p className="text-sm font-bold p-1">{dragInstruction}</p>
            </div>
          )}
        </div>

        <input
          type="file"
          id={id}
          name={name}
          accept="image/*"
          className="hidden"
          required={required}
          onChange={handleFileChange}
        />

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default ImageInput;
