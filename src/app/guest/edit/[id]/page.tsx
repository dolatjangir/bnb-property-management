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
import { guestAllDataInterface } from "@/store/guest/guest.interface";
import { getGuestById, updateGuest } from "@/store/guest/guest";
import { getProperty } from "@/store/property";

interface ErrorInterface {
    [key: string]: string;
}

type CustomFieldsType = {
    [key: string]: string; // key is dynamic, value is string
};

export default function GuestEdit() {
    const { id } = useParams();
    const router = useRouter();

    const [guestData, setGuestData] = useState<guestAllDataInterface>({
        Property: { id: "", name: "" },
        GuestName: "",
        ContactNumber: "",
        City: { id: "", name: "" },
        Location: { id: "", name: "" },
        Address: "",
        KycDocument: "",
        DOB: "",
        Gender: "",
        Email: "",
        GuestId: "",
        GuestDate: "",
        Other: "",
        CheckInDate: "",
        CheckOutDate: "",
        Verified: "",
        GuestImage: [],
        KycImage: {} as File
    });

    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [KycImagePreview, setKycImagePreview] = useState<string>("");
    const [errors, setErrors] = useState<ErrorInterface>({});
    const [loading, setLoading] = useState(true);
    const [fieldOptions, setFieldOptions] = useState<Record<string, any[]>>({});
    const [customFields, setCustomFields] = useState<CustomFieldsType>({});

    // Track deleted existing images separately
    const [removedGuestImages, setRemovedGuestImages] = useState<string[]>([]);
    const [removedKycImages, setRemovedKycImages] = useState<string[]>([]);


    const trimCountryCode = (num: string) => {
        if (!num) return "";
        return num.startsWith("+91") ? num.slice(3) : num;
    };


    // Fetch existing guest data
    useEffect(() => {
        const fetchGuest = async () => {
            try {
                const data = await getGuestById(id as string);
                if (!data) {
                    toast.error("Guest not found");
                    return;
                }
                console.log("guest ", data);
                // Just set the fetched data
                /* setGuestData({
                  ...data,
                  GuestImage: [], // no files yet, only local uploads go here
                  KycImage: {} as File, // same, user can manually upload
                }); */

                setGuestData({
                    ...data,
                    Property:{id:data.property.id,name:data.property.propertyName},
                    City: {
                        id: data?.City?._id || "",
                        name: data.City?.Name || ""
                    },
                    Location: {
                        id: data.Location?._id || "",
                        name: data.Location?.Name || ""
                    },
                    Address: data?.Adderess,

                    GuestDate: data?.GuestDate,
                    GuestImage: [],
                    KycImage: {} as File,
                });


                // Preview URLs for already existing images
                setImagePreviews(Array.isArray(data.GuestImage) ? data.GuestImage : []);

                // Show site plan if it exists

                setKycImagePreview(data.KycImage[0]);
            } catch (error) {
                toast.error("Error fetching guest");
                console.error("Fetch Error:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchGuest();


    }, [id]);

    useEffect(() => {
        console.log("filed optoins ", fieldOptions.Location, dropdownOptions)
    }, [fieldOptions])

    // Input change handlers
    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const { name, value } = e.target;
            setGuestData((prev) => ({ ...prev, [name]: value }));
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
        setGuestData((prev) => ({ ...prev, [label]: selected }));
        setErrors((prev) => ({ ...prev, [label]: "" }));
    }, []);

    // File upload
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        const files = e.target.files;
        if (!files) return;

        if (field === "GuestImage") {
            const newFiles = Array.from(files);
            const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
            setGuestData((prev) => ({
                ...prev,
                GuestImage: [...prev.GuestImage, ...newFiles],
            }));
            setImagePreviews((prev) => [...prev, ...newPreviews]);
        } else if (field === "KycImage") {
            const file = files[0];
            setGuestData((prev) => ({ ...prev, KycImage: file }));
            setKycImagePreview(URL.createObjectURL(file));
        }
    };

    // ✅ Remove image (and mark for backend deletion if it was an existing URL)
    const handleRemoveImage = (index: number) => {
        setGuestData((prev) => ({
            ...prev,
            GuestImage: prev.GuestImage.filter((_, i) => i !== index),
        }));

        setImagePreviews((prev) => {
            const removedUrl = prev[index];

            // Move this OUTSIDE of setImagePreviews callback to avoid double runs
            if (removedUrl.startsWith("http")) {
                setRemovedGuestImages((prevDel) => {
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

    // Remove site plan
    const handleRemoveKycImage = () => {
        if (KycImagePreview.length > 0 && KycImagePreview?.startsWith("http")) {
            setRemovedKycImages((prev) => [...prev, KycImagePreview]);
        }
        setGuestData((prev) => ({ ...prev, KycImage: {} as File }));
        setKycImagePreview("");
    };

    // Validation
    const validateForm = () => {
        const newErrors: ErrorInterface = {};
        if (!guestData?.GuestName?.trim()) newErrors.GuestName = "Guest Name is required";
        if (
            guestData?.Email?.trim() &&
            !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(guestData.Email)
        )
            newErrors.Email = "Invalid email format";
        if (!guestData?.ContactNumber?.trim())
            newErrors.ContactNumber = "Contact No is required";
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

        if (guestData.Property) formData.append("propertyId", guestData.Property.id);
        if (guestData.GuestName) formData.append("GuestName", guestData.GuestName);
        if (guestData.ContactNumber) formData.append("ContactNumber", trimCountryCodeHelper(guestData.ContactNumber));
        if (guestData.City) formData.append("City", guestData.City.name);
        if (guestData.KycDocument) formData.append("KycDocument", guestData.KycDocument);
        if (guestData.Location) formData.append("Location", guestData.Location?.name);
        if (guestData.Address) formData.append("Adderess", guestData.Address);
        if (guestData.Email) formData.append("Email", guestData.Email);
        if (guestData.Gender) formData.append("Gender", guestData.Gender);
        if (guestData.GuestId) formData.append("GuestId", guestData.GuestId);
        if (guestData.GuestDate) formData.append("GuestDate", guestData.GuestDate);
        if (guestData.DOB) formData.append("DOB", guestData.DOB);
        if (guestData.CheckInDate) formData.append("CheckInDate", guestData.CheckInDate);
        if (guestData.CheckOutDate) formData.append("CheckOutDate", guestData.CheckOutDate);
        if (guestData.Other) formData.append("Other", guestData.Other);


        // ✅ Append files correctly
        if (Array.isArray(guestData.GuestImage)) {
            guestData.GuestImage.forEach((file) => formData.append("GuestImage", file));
        }

        if (guestData.KycImage && (guestData.KycImage as any).name) {
            formData.append("KycImage", guestData.KycImage);
        }

        // ✅ Add deletion info
        formData.append("removedGuestImages", JSON.stringify(removedGuestImages));
        formData.append("removedKycImages", JSON.stringify(removedKycImages));
        console.log(" removed siteplan ", removedKycImages)

        formData.append("GuestFields", JSON.stringify(customFields));

        // Handle full deletion (when user removes all)
        /*  if (guestData.GuestImage.length === 0)
           formData.append("GuestImage", JSON.stringify([]));
         if (!KycImagePreview)
           formData.append("KycImage", JSON.stringify([])); */

        //console.log("FormData entries:");
        /*  for (let pair of formData.entries()) {
           //console.log(pair[0], pair[1]);
         } */

        console.log(" Form data before Submission ", removedGuestImages);
        const result = await updateGuest(id as string, formData);

        if (result) {
            toast.success("Guest updated successfully!");
            router.push("/guest");
        } else {
            toast.error("Update failed");
        }

    };

    const dropdownOptions = ["Option1", "Option2", "Option3"];

    const getProperties = async () => {
        const data = await getProperty();
        let options = data.map((item: any) => ({
            _id: item.id,
            Name: item.propertyName,
            Status: "Active",
        })).sort((a: any, b: any) => a.Name.toLowerCase().localeCompare(b.Name.toLowerCase()));;
        console.log("Property Options:", options);
        return new Promise((resolve) => resolve(options));
    }
    // Object-based fields (for ObjectSelect)
    const objectFields = [
        { key: "Property", fetchFn: getProperties },
        { key: "City", fetchFn: getCity },
        { key: "Location", staticData: [] },  // dependent

    ];

    // Simple array fields (for normal Select)
    const arrayFields = [
        { key: "Verified", staticData: ["yes", "no"] },
        { key: "Gender", staticData: ["male", "female", "other"] },
        { key: "KycDocument", staticData: ["Adhaar", "PAN", "Driving License", "Passport"] },
    ];


    useEffect(() => {
        const loadFieldOptions = async () => {
            await handleFieldOptionsObject(objectFields, setFieldOptions);
            await handleFieldOptions(arrayFields, setFieldOptions);
        };
        loadFieldOptions();
    }, []);


    useEffect(() => {

        if (guestData.City.id) {
            fetchLocation(guestData.City.id);
        } else {
            setFieldOptions((prev) => ({ ...prev, Location: [] }));
        }
        if (guestData.City.id && guestData.Location.id) {
            fetchSubLocation(guestData.City.id, guestData.Location.id);
        } else {
            setFieldOptions((prev) => ({ ...prev, SubLocation: [] }));
        }
    }, [guestData.City.id, guestData.Location.id]);


    const fetchLocation = async (cityId: string) => {
        try {

            const res = await getLocationByCity(cityId);
            setFieldOptions((prev) => ({ ...prev, Location: res || [] }));
        } catch (error) {
            console.error("Error fetching location:", error);
            setFieldOptions((prev) => ({ ...prev, Location: [] }));
        }
    };

    const fetchSubLocation = async (cityId: string, locationId: string) => {
        try {
            const res = await getsubLocationByCityLoc(cityId, locationId);
            setFieldOptions((prev) => ({ ...prev, SubLocation: res || [] }));
        } catch (error) {
            console.error("Error fetching sublocation:", error);
            setFieldOptions((prev) => ({ ...prev, SubLocation: [] }));
        }
    };

    if (loading) return null;

    return (
        <div className=" min-h-screen flex justify-center">
            <Toaster position="top-right" />
            <div className="w-full">
                <div className="flex justify-end mb-4">
                    <BackButton
                        url="/guest"
                        text="Back"
                        icon={<ArrowLeft size={18} />}
                    />

                </div>

                <div className="bg-white backdrop-blur-lg p-10 max-sm:px-5 w-full rounded-3xl shadow-2xl h-auto">
                    <form onSubmit={(e) => e.preventDefault()} className="w-full">
                        <div className="mb-8 text-left border-b pb-4 border-gray-200">
                            <h1 className="text-3xl max-sm:text-2xl font-extrabold text-[var(--color-secondary-darker)] leading-tight tracking-tight">
                                Edit <span className="text-[var(--color-primary)]">Guest Information</span>
                            </h1>
                        </div>

                        <div className="grid grid-cols-3 gap-6 max-xl:grid-cols-2 max-lg:grid-cols-1">
                            {/*  <SingleSelect options={Array.isArray(fieldOptions?.Campaign)?fieldOptions.Campaign:[]} label="Campaign" value={guestData.Campaign} onChange={(v) => handleSelectChange("Campaign", v)} />
              <SingleSelect options={Array.isArray(fieldOptions?.GuestType)?fieldOptions.GuestType:[]} label="Guest Type" value={guestData.GuestType} onChange={(v) => handleSelectChange("GuestType", v)} /> */}

                            <ObjectSelect
                                options={Array.isArray(fieldOptions?.Property) ? fieldOptions.Property : []}
                                label={"Property"}
                                value={guestData.Property.id}
                                getLabel={(item) => item?.Name || ""}
                                getId={(item) => item?._id || ""}
                                onChange={(selectedId) => {
                                    const selectedObj = fieldOptions.Property.find((i) => i._id === selectedId);
                                    if (selectedObj) {
                                        setGuestData((prev) => ({
                                            ...prev,
                                            Property: { id: selectedObj._id, name: selectedObj.Name },

                                        }));
                                    }
                                }}
                                error={errors.Property}
                            />
                            <InputField label={"Guest Name"} name="GuestName" value={guestData.GuestName} onChange={handleInputChange} error={errors.GuestName} />
                            <InputField label={"Contact No"} name="ContactNumber" value={guestData.ContactNumber} onChange={handleInputChange} error={errors.ContactNumber} />
                            <ObjectSelect
                                options={Array.isArray(fieldOptions?.City) ? fieldOptions.City : []}
                                label={"City"}
                                value={guestData.City.id}
                                getLabel={(item) => item?.Name || ""}
                                getId={(item) => item?._id || ""}
                                onChange={(selectedId) => {
                                    const selectedObj = fieldOptions.City.find((i) => i._id === selectedId);
                                    if (selectedObj) {
                                        setGuestData((prev) => ({
                                            ...prev,
                                            City: { id: selectedObj._id, name: selectedObj.Name },
                                            Location: { id: "", name: "" }, // reset on change
                                            SubLocation: { id: "", name: "" } // reset on change
                                        }));
                                    }
                                }}
                                error={errors.City}
                            />
                            <ObjectSelect
                                options={Array.isArray(fieldOptions?.Location) ? fieldOptions.Location : []}
                                label={"Location"}
                                value={guestData.Location.id}
                                getLabel={(item) => item?.Name || ""}
                                getId={(item) => item?._id || ""}
                                onChange={(selectedId) => {
                                    const selectedObj = fieldOptions.Location.find((i) => i._id === selectedId);
                                    if (selectedObj) {
                                        setGuestData((prev) => ({
                                            ...prev,
                                            Location: { id: selectedObj._id, name: selectedObj.Name },
                                            SubLocation: { id: "", name: "" }, // reset on change
                                        }));
                                    }
                                }}
                                error={errors.Location}
                            />


                            <InputField className=" max-sm:hidden" label={"Address"} name="Address" value={guestData.Address} onChange={handleInputChange} />
                            <InputField className=" max-sm:hidden" label={"Email"} name="Email" value={guestData.Email} onChange={handleInputChange} error={errors.Email} />
                            <InputField className=" max-sm:hidden" label={"Guest Id"} name="GuestId" value={guestData.GuestId} onChange={handleInputChange} />
                            <div className=" max-sm:hidden">
                                <DateSelector label={"GuestDate"} value={guestData.GuestDate} onChange={(val) => handleSelectChange("GuestDate", val)} />
                            </div>
                            <DateSelector label={"DOB"} value={guestData.DOB} onChange={(val) => handleSelectChange("DOB", val)} />
                            <DateSelector label={"Check-In Date"} value={guestData.CheckInDate} onChange={(val) => handleSelectChange("CheckInDate", val)} />
                            <DateSelector label={"Check-Out Date"} value={guestData.CheckOutDate} onChange={(val) => handleSelectChange("CheckOutDate", val)} />

                            <InputField className=" max-sm:hidden" label={"Others"} name="Other" value={guestData.Other} onChange={handleInputChange} />


                        </div>

                        <div className=" sm:flex flex-wrap my-5 gap-5">
                            <FileUpload label={"Guest Images"} multiple onChange={(e) => handleFileChange(e, "GuestImage")} previews={imagePreviews} onRemove={handleRemoveImage} />

                        </div>
                        <div className=" grid grid-cols-2 place-items-center gap-3 max-lg:grid-cols-1">
                            <SingleSelect className=" max-sm:hidden" options={Array.isArray(fieldOptions?.KycDocument) ? fieldOptions.KycDocument : []} label={"Kyc Document"} value={guestData.KycDocument} onChange={(v) => handleSelectChange("KycDocument", v)} />
                            <FileUpload label={"Kyc Document Image"} onChange={(e) => handleFileChange(e, "KycImage")} previews={KycImagePreview ? [KycImagePreview] : []} onRemove={() => handleRemoveKycImage()} />
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
