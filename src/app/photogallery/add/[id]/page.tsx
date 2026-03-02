"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { ArrowLeft, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";


import BackButton from "@/app/component/buttons/BackButton";
import SaveButton from "@/app/component/buttons/SaveButton";
import MasterProtectedRoute from "@/app/component/MasterProtectedRoutes";
import { photogalleryAllDataInterface } from "@/store/masters/photogallery/photogallery.interface";
import { addPhotoGallery } from "@/store/masters/photogallery/photogallery";
import SingleSelect from "@/app/component/SingleSelect";


interface ErrorInterface {
    [key: string]: string;
}

export default function PhotoGalleryAdd() {
    const [photogalleryData, setPhotogalleryData] = useState<photogalleryAllDataInterface>({
        Name: "",
        albumId:"",
        Image: {} as File,
        Status: "",
    });

     const { id } = useParams();
    const [errors, setErrors] = useState<ErrorInterface>({});
    const [preview, setPreview] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const router = useRouter();

    // ✅ Handle Image Select
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setPhotogalleryData((prev) => ({ ...prev, Image: file }));
        setPreview(URL.createObjectURL(file));
        setErrors((prev) => ({ ...prev, Image: "" }));
    };

    // ✅ Remove Image
    const handleRemoveImage = () => {
        setPhotogalleryData((prev) => ({ ...prev, Image: {} as File }));
        setPreview("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // ✅ Handle Dropdown Change
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

    // ✅ Form Validation
    const validateForm = () => {
        const newErrors: ErrorInterface = {};

        if (!photogalleryData.Status.trim()) newErrors.Status = "Status is required";
        if (!(photogalleryData.Image as any).name) newErrors.Image = "Image is required";

        return newErrors;
    };

    // ✅ Submit Form
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
            formData.append("Image", photogalleryData.Image);
            formData.append("albumId", id as string); 

            const res = await addPhotoGallery(formData);

            if (res) {
                toast.success("Photo Gallery added successfully!");
                router.push(`/photogallery/${id}`);
            } else {
                toast.error("Failed to add photogallery");
            }
        } catch (err) {
            toast.error("Error while adding photogallery");
            console.error(err);
        }
    };

    const statusOptions = ["Active", "Inactive"];

    return (
        <MasterProtectedRoute>
            <div className=" min-h-screen flex justify-center">
                <Toaster position="top-right" />

                <div className="w-full">
                    {/* Back Button */}
                    <div className="flex justify-end mb-4">

                        <BackButton
                            url={`/photogallery/${id}`}
                            text="Back"
                            icon={<ArrowLeft size={18} />}
                        />
                    </div>

                    {/* Form Card */}
                    <div className="bg-white/90 backdrop-blur-lg p-10 rounded-3xl shadow-2xl">
                        <div className="mb-8 border-b pb-4">
                            <h1 className="text-3xl font-extrabold text-[var(--color-secondary-darker)]">
                                Add <span className="text-[var(--color-primary)]">Photo Gallery</span>
                            </h1>
                        </div>

                        <form onSubmit={(e) => e.preventDefault()}>

                            <div className="grid grid-cols-2 gap-6 max-lg:grid-cols-1">

                                <InputField
                                    label="Photo Name"
                                    name="Name"
                                    value={photogalleryData.Name}
                                    onChange={handleInputChange}
                                    error={errors.Name}
                                />

                                {/* ✅ Status Dropdown */}
                                <SingleSelect
                                    label="Status"
                                    value={photogalleryData.Status}
                                    options={statusOptions}
                                    onChange={(v) => handleSelectChange("Status", v)}
                                    error={errors.Status}
                                />

                                {/* ✅ Image Upload */}
                                <div className="flex flex-col">
                                    <label className="font-semibold text-gray-700 mb-2">Photo Gallery Image</label>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="border border-gray-300 rounded-md p-2"
                                    />

                                    {errors.Image && (
                                        <p className="text-red-500 text-sm mt-1">{errors.Image}</p>
                                    )}

                                    {preview && (
                                        <div className="relative w-fit mt-3">
                                            <img
                                                src={preview}
                                                className="w-32 h-32 object-cover rounded-md border"
                                            />
                                            <button
                                                onClick={handleRemoveImage}
                                                type="button"
                                                className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* ✅ Save Button */}
                            <div className="flex justify-end mt-6">

                                <SaveButton text="Save" onClick={handleSubmit} />
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
