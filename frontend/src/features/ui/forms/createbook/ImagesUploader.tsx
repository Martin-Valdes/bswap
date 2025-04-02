import ImageInput from "./ImageInput";

const imagesData = [
  {
    id: "image1",
    name: "images",
    label: "Portada del libro",
    required: true,
    dragInstruction:
      "La imagen debe ser de 1080 x 680 px y debe pesar menos de 500 kb. Solo se admiten los formatos JPG, JPEG y PNG. ",
  },
  {
    id: "image2",
    name: "images",
    label: "Imagen del libro 1",
    required: false,
    dragInstruction: "La imagen debe ser de 1080 x 680 px y pesar menos de 500 KB.",
  },
  {
    id: "image3",
    name: "images",
    label : "Imagen del libro 2",
    required: false,
    dragInstruction: "La imagen debe ser de 1080 x 680 px y pesar menos de 500 KB.",
  },
];

const ImagesUploader: React.FC = () => {
  return (
    <div>
      <div className="flex gap-6 justify-around">
        {imagesData.map((image) => (
          <ImageInput
            key={image.id}
            id={image.id}
            name={image.name}
            label={image.label}
            required={image.required}
            dragInstruction={image.dragInstruction}
          />
        ))}
      </div>
    </div>
  );
};

export default ImagesUploader;
