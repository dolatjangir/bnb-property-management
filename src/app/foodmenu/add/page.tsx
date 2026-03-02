'use client'

import { useState, useCallback, useEffect, act } from "react";
import Link from "next/link";
import SingleSelect from "@/app/component/SingleSelect";
import DateSelector from "@/app/component/DateSelector";
import toast, { Toaster } from "react-hot-toast";
import { ArrowLeft, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { getCampaign } from "@/store/masters/campaign/campaign";
import { getTypes, getTypesByCampaign } from "@/store/masters/types/types";
import { getCity } from "@/store/masters/city/city";
import { getLocation, getLocationByCity } from "@/store/masters/location/location";
import { handleFieldOptions } from "@/app/utils/handleFieldOptions";
import { getSubtype, getSubtypeByCampaignAndType } from "@/store/masters/subtype/subtype";
import { getFacilities } from "@/store/masters/facilities/facilities";
import BackButton from "@/app/component/buttons/BackButton";
import SaveButton from "@/app/component/buttons/SaveButton";
import { handleFieldOptionsObject } from "@/app/utils/handleFieldOptionsObject";
import ObjectSelect from "@/app/component/ObjectSelect";
import InputField from "@/app/component/datafields/InputField";
import TextareaField from "@/app/component/datafields/TextareaField";
import { getFilteredContact } from "@/store/contact";
import { trimCountryCodeHelper } from "@/app/utils/trimCountryCodeHelper";
import { getsubLocationByCityLoc } from "@/store/masters/sublocation/sublocation";
import { getReferences } from "@/store/masters/references/references";
import { getPrice } from "@/store/masters/price/price";

import { foodMenuAllDataInterface } from "@/store/foodmenu/foodmenu.interface";
import { addFoodMenu } from "@/store/foodmenu/foodmenu";
import { getMenuCatalog } from "@/store/masters/menucatalog/menucatalog";
import { getMenuCatalogTypeByMenuCatalog } from "@/store/masters/menucatalogtype/menucatalogtype";

interface ErrorInterface {
    [key: string]: string;
}

type CustomFieldsType = {
    [key: string]: string; // key is dynamic, value is string
};

export default function FoodMenuAdd() {
    const [foodMenuData, setFoodMenuData] = useState<foodMenuAllDataInterface>({
        Name: "",
        Description: "",
        MenuCatalog: { id: "", name: "" },
        MenuCatalogType: { id: "", name: "" },
        Price: "",
        Stock: "",
        FoodMenuImage: [],
    });
    const [fieldOptions, setFieldOptions] = useState<Record<string, any[]>>({});
    const [customFields, setCustomFields] = useState<CustomFieldsType>({});
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [KycImagePreview, setKycImagePreview] = useState<string>("");
    const [errors, setErrors] = useState<ErrorInterface>({});
    const router = useRouter();

    /*   const getFoodMenuFieldsFunc = async () => {
        const data = await getFoodMenuFields();
        const activeFields = data.filter((e: any) => e.Status === "Active");
        console.log(" fields are ", activeFields);
        const fieldsObj: CustomFieldsType = {};
        activeFields.forEach((field: any) => {
          fieldsObj[field.Name] = "";
        });
    
        setCustomFields(fieldsObj);
      }
    
      useEffect(() => {
        getFoodMenuFieldsFunc();
      }, []) */



    // Handle Input
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

    const handleSelectChange = useCallback(
        (label: string, selected: string) => {
            setFoodMenuData((prev) => ({ ...prev, [label]: selected }));
            setErrors((prev) => ({ ...prev, [label]: "" }));
        },
        []
    );

    // 🟩 Handle File Input
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        const files = e.target.files;
        if (!files) return;

        if (field === "FoodMenuImage") {
            const newFiles = Array.from(files);
            const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
            setFoodMenuData((prev) => ({ ...prev, FoodMenuImage: [...prev.FoodMenuImage, ...newFiles] }));
            setImagePreviews((prev) => [...prev, ...newPreviews]);
        } else if (field === "KycImage") {
            const file = files[0];
            setFoodMenuData((prev) => ({ ...prev, KycImage: file }));
            setKycImagePreview(URL.createObjectURL(file));
        }
    };

    // 🟩 Remove image
    const handleRemoveImage = (index: number) => {
        setFoodMenuData((prev) => ({
            ...prev,
            FoodMenuImage: prev.FoodMenuImage.filter((_, i) => i !== index)
        }));
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };


    // 🟩 Validate Form
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

    const trimCountryCode = (num: string) => {
        if (!num) return "";
        return num.startsWith("+91") ? num.slice(3) : num;
    };


    // Submit Form
    const handleSubmit = async () => {
        /*  const duplicate = await isContactNoExist(foodMenuData.ContactNumber);
        if (duplicate) return; */
        console.log(" file object foodMenufields : ", customFields)

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const formData = new FormData();

        // Append fields

        if (foodMenuData.Name) formData.append("Name", foodMenuData.Name);
        if (foodMenuData.Description) formData.append("Description", foodMenuData.Description);
        if (foodMenuData.MenuCatalog) formData.append("MenuCatalog", foodMenuData.MenuCatalog.name);
        if (foodMenuData.MenuCatalogType) formData.append("MenuCatalogType", foodMenuData.MenuCatalogType?.name);
        if (foodMenuData.Price) formData.append("Price", foodMenuData.Price);
        if (foodMenuData.Stock) formData.append("Stock", foodMenuData.Stock);
        /*  if (foodMenuData.Verified) formData.append("Verified", foodMenuData.Verified); */
        formData.append("updatedAt", new Date().toISOString());

        // Append files correctly
        if (Array.isArray(foodMenuData.FoodMenuImage)) {
            foodMenuData.FoodMenuImage.forEach((file) => formData.append("FoodMenuImage", file));
        }


        /*  formData.append("FoodMenuFields", JSON.stringify(customFields)); */
        //console.log(foodMenuData)
        const result = await addFoodMenu(formData);

        if (result) {
            toast.success("FoodMenu added successfully!");
            router.push("/foodmenu");
        } else {
            //toast.error(result??"Failed to add foodMenu");
        }

    };

    const dropdownOptions = ["Option1", "Option2", "Option3"];

    // Object-based fields (for ObjectSelect)
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
                                Add <span className="text-[var(--color-primary)]">FoodMenu Information</span>
                            </h1>
                        </div>

                        <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-1">

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


                            <InputField className=" " label={"Price"} name="Price" value={foodMenuData.Price} onChange={handleInputChange} error={errors.Price}/>
                            <InputField className=" " label={"Stock"} name="Stock" value={foodMenuData.Stock} onChange={handleInputChange} error={errors.Stock} />
                            <TextareaField label={"Description"} name="Description" value={foodMenuData.Description} onChange={handleInputChange} error={errors.Description}/>



                        </div>

                        <div className="flex flex-col  my-5 gap-5">
                            <FileUpload label={"Menu Image"} multiple previews={imagePreviews} onChange={(e) => handleFileChange(e, "FoodMenuImage")} onRemove={handleRemoveImage} />
                        </div>

                        {/* <div className=" mt-10">
              <h2 className="text-xl font-semibold text-gray-700 mb-4 ">
                  Additional Information
                </h2>
            <div className=" grid grid-cols-3 gap-6 max-lg:grid-cols-1 my-6">
              {Object.keys(customFields).map((key) => (
                <InputField
                  key={key}
                  className="max-sm:hidden"
                  label={key}
                  name={key}
                  value={customFields[key]}
                  onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                    handleCustomInputChange(key, e.target.value)
                  }
                />
              ))}
            </div>

            </div> */}

                        <div className="flex justify-end mt-4">

                            <SaveButton text="Save" onClick={handleSubmit} />

                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}






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