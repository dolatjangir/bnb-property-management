"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, X } from "lucide-react";
import SingleSelect from "@/app/component/SingleSelect";
import DateSelector from "@/app/component/DateSelector";
import toast, { Toaster } from "react-hot-toast";

import { handleFieldOptions } from "@/app/utils/handleFieldOptions";
import { getCampaign } from "@/store/masters/campaign/campaign";
import { getTypes, getTypesByCampaign } from "@/store/masters/types/types";
import { getLocation, getLocationByCity } from "@/store/masters/location/location";
import { getCity } from "@/store/masters/city/city";
import { getFacilities } from "@/store/masters/facilities/facilities";
import { getSubtype, getSubtypeByCampaignAndType } from "@/store/masters/subtype/subtype";
import BackButton from "@/app/component/buttons/BackButton";
import SaveButton from "@/app/component/buttons/SaveButton";
import { handleFieldOptionsObject } from "@/app/utils/handleFieldOptionsObject";
import ObjectSelect from "@/app/component/ObjectSelect";
import { InputField } from "@/app/component/InputField";
import TextareaField from "@/app/component/datafields/TextareaField";
import { trimCountryCodeHelper } from "@/app/utils/trimCountryCodeHelper";
import { getsubLocationByCityLoc } from "@/store/masters/sublocation/sublocation";
import { getReferences } from "@/store/masters/references/references";
import { getPrice } from "@/store/masters/price/price";
import { getProperty } from "@/store/property";
import { foodMenuAllDataInterface } from "@/store/foodmenu/foodmenu.interface";
import { getFoodMenuById, updateFoodMenu } from "@/store/foodmenu/foodmenu";
import { getMenuCatalogTypeByMenuCatalog } from "@/store/masters/menucatalogtype/menucatalogtype";
import { getMenuCatalog } from "@/store/masters/menucatalog/menucatalog";

interface ErrorInterface {
    [key: string]: string;
}

type CustomFieldsType = {
    [key: string]: string; // key is dynamic, value is string
};

export default function FoodMenuEdit() {
    const { id } = useParams();
    const router = useRouter();

    const [foodMenuData, setFoodMenuData] = useState<foodMenuAllDataInterface>({
        Name: "",
        Description: "",
        MenuCatalog: { id: "", name: "" },
        MenuCatalogType: { id: "", name: "" },
        Price: "",
        Stock: "",
        FoodMenuImage: [],
    });

    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [KycImagePreview, setKycImagePreview] = useState<string>("");
    const [errors, setErrors] = useState<ErrorInterface>({});
    const [loading, setLoading] = useState(true);
    const [fieldOptions, setFieldOptions] = useState<Record<string, any[]>>({});
    const [customFields, setCustomFields] = useState<CustomFieldsType>({});

    // Track deleted existing images separately
    const [removedFoodMenuImages, setRemovedFoodMenuImages] = useState<string[]>([]);




    // Fetch existing foodMenu data
    useEffect(() => {
        const fetchFoodMenu = async () => {
            try {
                const data = await getFoodMenuById(id as string);
                if (!data) {
                    toast.error("FoodMenu not found");
                    return;
                }
                console.log("foodMenu ", data);
                // Just set the fetched data
                /* setFoodMenuData({
                  ...data,
                  FoodMenuImage: [], // no files yet, only local uploads go here
                  KycImage: {} as File, // same, user can manually upload
                }); */

                setFoodMenuData({
                    ...data,
                    MenuCatalog: {
                        id: data?.MenuCatalog?.id || "",
                        name: data.MenuCatalog?.Name || ""
                    },
                    MenuCatalogType: {
                        id: data.MenuCatalogType?._id || "",
                        name: data.MenuCatalogType?.Name || ""
                    },
                    FoodMenuImage: [],
                });


                // Preview URLs for already existing images
                setImagePreviews(Array.isArray(data.FoodMenuImage) ? data.FoodMenuImage : []);

            } catch (error) {
                toast.error("Error fetching foodMenu");
                console.error("Fetch Error:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchFoodMenu();


    }, [id]);

    useEffect(() => {
        console.log("filed optoins ", fieldOptions.Location, dropdownOptions)
    }, [fieldOptions])

    // Input change handlers
    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const { name, value } = e.target;
            setFoodMenuData((prev) => ({ ...prev, [name]: value }));
            setErrors((prev) => ({ ...prev, [name]: "" }));
        },
        []
    );

    // handle custom input changes dynamically
    const handleCustomInputChange = (key: string, value: string) => {
        setCustomFields((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSelectChange = useCallback((label: string, selected: string) => {
        setFoodMenuData((prev) => ({ ...prev, [label]: selected }));
        setErrors((prev) => ({ ...prev, [label]: "" }));
    }, []);

    // File upload
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        const files = e.target.files;
        if (!files) return;

        if (field === "FoodMenuImage") {
            const newFiles = Array.from(files);
            const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
            setFoodMenuData((prev) => ({
                ...prev,
                FoodMenuImage: [...prev.FoodMenuImage, ...newFiles],
            }));
            setImagePreviews((prev) => [...prev, ...newPreviews]);
        } else if (field === "KycImage") {
            const file = files[0];
            setFoodMenuData((prev) => ({ ...prev, KycImage: file }));
            setKycImagePreview(URL.createObjectURL(file));
        }
    };

    // ✅ Remove image (and mark for backend deletion if it was an existing URL)
    const handleRemoveImage = (index: number) => {
        setFoodMenuData((prev) => ({
            ...prev,
            FoodMenuImage: prev.FoodMenuImage.filter((_, i) => i !== index),
        }));

        setImagePreviews((prev) => {
            const removedUrl = prev[index];

            // Move this OUTSIDE of setImagePreviews callback to avoid double runs
            if (removedUrl.startsWith("http")) {
                setRemovedFoodMenuImages((prevDel) => {
                    // Prevent duplicates explicitly
                    if (!prevDel.includes(removedUrl)) {
                        return [...prevDel, removedUrl];
                    }
                    return prevDel;
                });
            }

            return prev.filter((_, i) => i !== index);
        });
    };


    // Validation
    const validateForm = () => {
        const newErrors: ErrorInterface = {};
        if (!foodMenuData.Name.trim())
            newErrors.Name = "Name is required";
        if (!foodMenuData.Description.trim())
            newErrors.Description = "Description is required";
        if (!foodMenuData.MenuCatalog.name.trim())
            newErrors.MenuCatalog = "Menu Catalog is required";
        if (!foodMenuData.Price.trim())
            newErrors.Price = "Price is required";
        return newErrors;
    };



    // ✅ Submit data correctly as FormData
    const handleSubmit = async () => {
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }


        const formData = new FormData();

        if (foodMenuData.Name) formData.append("Name", foodMenuData.Name);
        if (foodMenuData.Description) formData.append("Description", foodMenuData.Description);
        if (foodMenuData.MenuCatalog) formData.append("MenuCatalog", foodMenuData.MenuCatalog.name);
        if (foodMenuData.MenuCatalogType) formData.append("MenuCatalogType", foodMenuData.MenuCatalogType?.name);
        if (foodMenuData.Price) formData.append("Price", foodMenuData.Price);
        if (foodMenuData.Stock) formData.append("Stock", foodMenuData.Stock);

        // Append files correctly
        if (Array.isArray(foodMenuData.FoodMenuImage)) {
            foodMenuData.FoodMenuImage.forEach((file) => formData.append("FoodMenuImage", file));
        }


        // Add deletion info
        formData.append("removedFoodMenuImages", JSON.stringify(removedFoodMenuImages));

        /*   formData.append("FoodMenuFields", JSON.stringify(customFields)); */

        // Handle full deletion (when user removes all)
        /*  if (foodMenuData.FoodMenuImage.length === 0)
           formData.append("FoodMenuImage", JSON.stringify([]));
         if (!KycImagePreview)
           formData.append("KycImage", JSON.stringify([])); */

        //console.log("FormData entries:");
        /*  for (let pair of formData.entries()) {
           //console.log(pair[0], pair[1]);
         } */

        console.log(" Form data before Submission ", removedFoodMenuImages);
        const result = await updateFoodMenu(id as string, formData);

        if (result) {
            toast.success("FoodMenu updated successfully!");
            router.push("/foodmenu");
        } else {
            toast.error("Update failed");
        }

    };

    const dropdownOptions = ["Option1", "Option2", "Option3"];
    const objectFields = [
        { key: "MenuCatalog", fetchFn: getMenuCatalog },
        { key: "MenuCatalogType", staticData: [] }, // dependent
    ];



    // Simple array fields (for normal Select)
    const arrayFields = [
        { key: "Verified", staticData: ["yes", "no"] },
        { key: "Gender", staticData: ["male", "female", "other"] },
    ];


    useEffect(() => {
        const loadFieldOptions = async () => {
            await handleFieldOptionsObject(objectFields, setFieldOptions);
            await handleFieldOptions(arrayFields, setFieldOptions);
        };
        loadFieldOptions();
    }, []);


    useEffect(() => {


        if (foodMenuData.MenuCatalog.id) {
            fetchMenuCatalogType(foodMenuData.MenuCatalog.id);
        } else {
            setFieldOptions((prev) => ({ ...prev, MenuCatalogType: [] }));
        }
        /*   if (foodMenuData.MenuCatalog.id && foodMenuData.MenuCatalogType.id) {
              fetchSubLocation(foodMenuData.MenuCatalog.id, foodMenuData.MenuCatalogType.id);
          } else {
              setFieldOptions((prev) => ({ ...prev, SubLocation: [] }));
          } */
    }, [foodMenuData.MenuCatalog.id, foodMenuData.MenuCatalogType.id]);


    const fetchMenuCatalogType = async (menucatalogId: string) => {
        try {

            const res = await getMenuCatalogTypeByMenuCatalog(menucatalogId);
            setFieldOptions((prev) => ({ ...prev, MenuCatalogType: res || [] }));
        } catch (error) {
            console.error("Error fetching MenuCatalogType:", error);
            setFieldOptions((prev) => ({ ...prev, MenuCatalogType: [] }));
        }
    };

    /*     const fetchSubLocation = async (cityId: string, locationId: string) => {
            try {
                const res = await getsubLocationByCityLoc(cityId, locationId);
                setFieldOptions((prev) => ({ ...prev, SubLocation: res || [] }));
            } catch (error) {
                console.error("Error fetching sublocation:", error);
                setFieldOptions((prev) => ({ ...prev, SubLocation: [] }));
            }
        }; */

    if (loading) return null;

    return (
        <div className=" min-h-screen flex justify-center">
            <Toaster position="top-right" />
            <div className="w-full">
                <div className="flex justify-end mb-4">
                    <BackButton
                        url="/foodmenu"
                        text="Back"
                        icon={<ArrowLeft size={18} />}
                    />

                </div>

                <div className="bg-white backdrop-blur-lg p-10 max-sm:px-5 w-full rounded-3xl shadow-2xl h-auto">
                    <form onSubmit={(e) => e.preventDefault()} className="w-full">
                        <div className="mb-8 text-left border-b pb-4 border-gray-200">
                            <h1 className="text-3xl max-sm:text-2xl font-extrabold text-[var(--color-secondary-darker)] leading-tight tracking-tight">
                                Edit <span className="text-[var(--color-primary)]">FoodMenu Information</span>
                            </h1>
                        </div>

                        <div className="grid grid-cols-3 gap-6 max-xl:grid-cols-2 max-lg:grid-cols-1">

                            <InputField label={"Food Name"} name="Name" value={foodMenuData.Name} onChange={handleInputChange} error={errors.Name} />
                            <ObjectSelect
                                options={Array.isArray(fieldOptions?.MenuCatalog) ? fieldOptions.MenuCatalog : []}
                                label={"Catalog"}
                                value={foodMenuData.MenuCatalog.id}
                                getLabel={(item) => item?.Name || ""}
                                getId={(item) => item?._id || ""}
                                onChange={(selectedId) => {
                                    const selectedObj = fieldOptions.MenuCatalog.find((i) => i._id === selectedId);
                                    if (selectedObj) {
                                        setFoodMenuData((prev) => ({
                                            ...prev,
                                            MenuCatalog: { id: selectedObj._id, name: selectedObj.Name },
                                            MenuCatalogType: { id: "", name: "" }, // reset on change
                                            /*  SubLocation: { id: "", name: "" } */ // reset on change
                                        }));
                                    }
                                }}
                                error={errors.MenuCatalog}
                            />
                            <ObjectSelect
                                options={Array.isArray(fieldOptions?.MenuCatalogType) ? fieldOptions.MenuCatalogType : []}
                                label={"Catalog Type"}
                                value={foodMenuData.MenuCatalogType.id}
                                getLabel={(item) => item?.Name || ""}
                                getId={(item) => item?._id || ""}
                                onChange={(selectedId) => {
                                    const selectedObj = fieldOptions.MenuCatalogType.find((i) => i._id === selectedId);
                                    if (selectedObj) {
                                        setFoodMenuData((prev) => ({
                                            ...prev,
                                            MenuCatalogType: { id: selectedObj._id, name: selectedObj.Name },
                                            /*  SubLocation: { id: "", name: "" } */ // reset on change
                                        }));
                                    }
                                }}
                                error={errors.MenuCatalogType}
                            />


                            <InputField className=" max-sm:hidden" label={"Price"} name="Price" value={foodMenuData.Price} onChange={handleInputChange} />
                            <InputField className=" max-sm:hidden" label={"Stock"} name="Stock" value={foodMenuData.Stock} onChange={handleInputChange} error={errors.Stock} />
                            <TextareaField label={"Description"} name="Description" value={foodMenuData.Description} onChange={handleInputChange} />


                        </div>

                        <div className=" sm:flex flex-wrap my-5 gap-5">
                            <FileUpload label={"FoodMenu Images"} multiple onChange={(e) => handleFileChange(e, "FoodMenuImage")} previews={imagePreviews} onRemove={handleRemoveImage} />

                        </div>
                        <div className="flex justify-end mt-4">

                            <SaveButton text="Update" onClick={handleSubmit} />

                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

// InputField, TextareaField, and FileUpload components remain unchanged


// Input field component




// File upload with preview and remove
const FileUpload: React.FC<{
    label: string;
    multiple?: boolean;
    previews?: string[];
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemove?: (index: number) => void;
}> = ({ label, multiple, previews = [], onChange, onRemove }) => (
    <div className="flex flex-col">
        <label className="font-semibold text-gray-700 mb-2">{label}</label>
        <input
            type="file"
            multiple={multiple}
            onChange={onChange}
            className="border border-gray-300 rounded-md p-2"
        />
        {previews.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3">
                {previews.map((src, index) => (
                    <div key={index} className="relative">
                        <img
                            src={src}
                            alt={`preview-${index}`}
                            className="w-24 h-24 object-cover rounded-md border"
                        />
                        {onRemove && (
                            <button
                                type="button"
                                onClick={() => onRemove(index)}
                                className="absolute top-[-8px] right-[-8px] bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        )}
    </div>
);
