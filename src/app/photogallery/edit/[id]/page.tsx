'use client';

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

import SingleSelect from "@/app/component/SingleSelect";
import BackButton from "@/app/component/buttons/BackButton";
import SaveButton from "@/app/component/buttons/SaveButton";
import MasterProtectedRoute from "@/app/component/MasterProtectedRoutes";
import { photogalleryGetDataInterface } from "@/store/masters/photogallery/photogallery.interface";
import { getPhotoGalleryById, updatePhotoGallery } from "@/store/masters/photogallery/photogallery";

interface ErrorInterface {
  [key: string]: string;
}

export default function PhotoGalleryEdit() {
  const { id } = useParams();
  const router = useRouter();

  const [photogalleryData, setPhotogalleryData] = useState<photogalleryGetDataInterface>({
    _id: "",
    albumId:"",
    Name:"",
    Image: "",
    Status: "",
  });

  const [newImage, setNewImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // 🆕 Track removed old image
  const [removedOldImage, setRemovedOldImage] = useState<string[]>([]);

  const [errors, setErrors] = useState<ErrorInterface>({});
  const [loading, setLoading] = useState(true);
   const fileInputRef = useRef<HTMLInputElement | null>(null);
  

  // 🟩 Fetch photogallery photo gallery by ID
  useEffect(() => {
    const fetchPhotoGallery = async () => {
      try {
        const data = await getPhotoGalleryById(id as string);
        if (data) {
          setPhotogalleryData(data);
          setRemovedOldImage([]); // initial old image
          setImagePreview(data.Image[0]); // existing image
        } else {
          toast.error("Photo Gallery not found");
        }
      } catch (error) {
        toast.error("Error fetching photo gallery details");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPhotoGallery();
  }, [id]);

  // 🟩 Dropdown handler
  const handleSelectChange = useCallback((label: string, selected: string) => {
    setPhotogalleryData((prev) => ({ ...prev, [label]: selected }));
    setErrors((prev) => ({ ...prev, [label]: "" }));
  }, []);

  
    //input change

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            setPhotogalleryData((prev) => ({ ...prev, [name]: value }));
            setErrors((prev) => ({ ...prev, [name]: "" }));
        },
        []
    );

  // 🟩 Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setNewImage(file);
    setImagePreview(URL.createObjectURL(file));

    // If user uploads a new image → old image becomes removed
    if (imagePreview && imagePreview.startsWith("http")) {
    setRemovedOldImage([imagePreview]);
  }

  };

  // 🟩 Remove current image
  const handleRemoveImage = () => {
    if (imagePreview?.startsWith("http")) {
      setRemovedOldImage((prev) => [...prev, imagePreview]);
    }


    setNewImage(null);
    setImagePreview("");
          if (fileInputRef.current) {
    fileInputRef.current.value = "";
  }

  };

  // 🟩 Validations
  const validateForm = () => {
    const newErrors: ErrorInterface = {};
    if (!photogalleryData.Status.trim()) newErrors.Status = "Status is required";
    // IMAGE REQUIRED VALIDATION
    const noImage =
      (!imagePreview || imagePreview.trim() === "") && !newImage;

    if (noImage) {
      newErrors.Image = "Photo Gallery Image is required";
    }
    return newErrors;
  };

  // 🟩 Submit
  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("Name", photogalleryData.Name);
      formData.append("Status", photogalleryData.Status);

      // Upload new image (if user selected)
      if (newImage) {
        formData.append("Image", newImage);
      }

      // 🆕 Send removed old image
      if (removedOldImage) {
        formData.append("removedImages", JSON.stringify(removedOldImage));
      }

      const result = await updatePhotoGallery(id as string, formData);

      if (result) {
        toast.success("Photo Gallery updated successfully!");
        router.push(`/photogallery/${photogalleryData.albumId}`);
      } else {
        toast.error("Failed to update photo gallery");
      }
    } catch (error) {
      toast.error("Error updating photo gallery");
    }
  };

  const statusOptions = ["Active", "Inactive"];

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Loading photo gallery details...
      </div>
    );

  return (
    <MasterProtectedRoute>
      <div className="min-h-screen flex justify-center">
        <Toaster position="top-right" />

        <div className="w-full max-w-2xl">
          {/* Back Button */}
          <div className="flex justify-end mb-4">
            <BackButton
              url={`/photogallery/${photogalleryData.albumId}`}
              text="Back"
              icon={<ArrowLeft size={18} />}
            />
          </div>

          {/* Card */}
          <div className="bg-white/90 backdrop-blur-lg p-10 w-full rounded-3xl shadow-2xl">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-8 border-b pb-4">
                <h1 className="text-3xl font-extrabold text-[var(--color-secondary-darker)]">
                  Edit <span className="text-[var(--color-primary)]">Photo Gallery</span>
                </h1>
              </div>

              {/* Fields */}
              <div className="flex flex-col space-y-6">
                 <InputField
                                    label="Photo Name"
                                    name="Name"
                                    value={photogalleryData.Name}
                                    onChange={handleInputChange}
                                    error={errors.Name}
                                />
                <SingleSelect
                  options={statusOptions}
                  label="Status"
                  value={photogalleryData.Status}
                  onChange={(v) => handleSelectChange("Status", v)}
                />

                {/* Image Upload */}
                <div className="flex flex-col">
                  <label className="font-semibold text-gray-700 mb-2">Photo Gallery Image</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="border border-gray-300 rounded-md p-2"
                  />
                  {errors.Image && (
                    <p className="text-red-600 text-sm mt-1">{errors.Image}</p>
                  )}


                  {imagePreview && (
                    <div className="relative mt-3 w-48 h-48">
                      <img
                        src={imagePreview}
                        alt="preview"
                        className="w-full h-full object-cover rounded-md border"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-[-8px] right-[-8px] bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}

                </div>

                {/* Submit */}
                <div className="flex justify-end mt-4">
                  <SaveButton text="Update" onClick={handleSubmit} />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </MasterProtectedRoute>
  );
}

//Reusable Input Field
const InputField: React.FC<{
    label: string;
    name: string;
    value: string;
    error?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ label, name, value, onChange, error }) => (
    <label className="relative block w-full">
        <input
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            placeholder=" "
            className={`peer w-full border rounded-sm bg-transparent py-3 px-4 outline-none 
        ${error ? "border-red-500 focus:border-red-500" : "border-gray-400 focus:border-blue-500"}`}
        />
        <p
            className={`absolute left-2 bg-white px-1 text-gray-500 text-sm transition-all duration-300
      ${value || error
                    ? "-top-2 text-xs text-blue-500"
                    : "peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500"
                }`}
        >
            {label}
        </p>
        {error && <span className="text-red-500 text-sm mt-1 block">{error}</span>}
    </label>
);
