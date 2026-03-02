'use client';

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import SingleSelect from "@/app/component/SingleSelect";
import toast, { Toaster } from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import DateSelector from "@/app/component/DateSelector";
import { GuestBillingAllDataInterface } from "@/store/financial/guestbilling/guestbilling.interface";
import { addGuestBilling, getGuestBillingById } from "@/store/financial/guestbilling/guestbilling";
import { handleFieldOptions } from "@/app/utils/handleFieldOptions";
import { getPayments } from "@/store/masters/payments/payments";
import { getAllAdmins } from "@/store/auth";
import BackButton from "@/app/component/buttons/BackButton";
import SaveButton from "@/app/component/buttons/SaveButton";
import { getHead } from "@/store/masters/head/head";
import { getProperty } from "@/store/property";
import TextareaField from "@/app/component/datafields/TextareaField";
import { getGuest } from "@/store/guest/guest";
import { handleFieldOptionsObject } from "@/app/utils/handleFieldOptionsObject";
import ObjectSelect from "@/app/component/ObjectSelect";

interface ErrorInterface {
    [key: string]: string;
}

export default function GuestBillingEdit() {
      const { id } = useParams();
    const [guestbillingData, setGuestBillingData] = useState<GuestBillingAllDataInterface>({
        Guest: { id: "", name: "" },
        FromDate: "",
        ToDate: "",
        Amount: "",
        RecievedAmount: "",
        DueAmount: "",
        PaymentMethod: "",
        Description: "",
    });

    const [errors, setErrors] = useState<ErrorInterface>({});
      const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [fieldOptions, setFieldOptions] = useState<Record<string, any[]>>({});
    


     // Fetch by id
      useEffect(() => {
        const fetchGuestBilling = async () => {
          try {
            if (!id) return;
            const data = await getGuestBillingById(id as string);
            if (data) {
              const date = new Date(data.createdAt);
              const formattedDate =
                date.getFullYear() + "-" + (date.getMonth() + 1).toString().padStart(2, "0") + "-" + date.getDate().toString().padStart(2, "0");
              console.log(" nice ", formattedDate)
              setGuestBillingData({
                Guest: { id: data.Guest.id, name: data.Guest },
                Property: data.Property ?? "",
                Description: data.Description ?? "",
                FromDate: data.FromDate ?? formattedDate,
                ToDate: data.ToDate ?? "",
                Amount: data.Amount ?? "",
                RecievedAmount: data.RecievedAmount ?? "",
                DueAmount: data.DueAmount ?? "",
                PaymentMethod: data.PaymentMethod ?? "",
              });
            } else {
              toast.error("GuestBilling Marketing not found");
            }
          } catch (error) {
            toast.error("Error fetching GuestBilling Marketing details");
            console.error("Fetch GuestBilling Marketing Error:", error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchGuestBilling();
        fetchFields();
      }, [id]);
    
     

    // Input change handler
    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const { name, value } = e.target;
            setGuestBillingData((prev) => ({ ...prev, [name]: value }));
            setErrors((prev) => ({ ...prev, [name]: "" }));
        },
        []
    );

    // Dropdown/Date selector handler
    const handleSelectChange = useCallback((label: string, selected: string) => {
        setGuestBillingData((prev) => ({ ...prev, [label]: selected }));
        setErrors((prev) => ({ ...prev, [label]: "" }));
    }, []);

    // Validation
    const validateForm = () => {
        const newErrors: ErrorInterface = {};
        if (!guestbillingData.Guest?.id.trim()) newErrors.Guest = "Guest is required";
        if (!guestbillingData.Amount.trim()) newErrors.Amount = "Amount is required";
        if (!guestbillingData.PaymentMethod.trim()) newErrors.PaymentMethod = "Payment Method is required";
        if (!guestbillingData.RecievedAmount.trim()) newErrors.RecievedAmount = "Recieved Amount is required";
        if (!guestbillingData.FromDate.trim()) newErrors.FromDate = "From Date is required";
        if (!guestbillingData.ToDate.trim()) newErrors.ToDate = "To Date is required";
        return newErrors;
    };

    // Submit handler
    const handleSubmit = async () => {
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            console.log(" validation error ", validationErrors)
            return;
        }

        try {
            const payload = {
                guestId: guestbillingData.Guest?.id,
                FromDate: guestbillingData.FromDate,
                ToDate: guestbillingData.ToDate,
                Amount: guestbillingData.Amount,
                RecievedAmount: guestbillingData.RecievedAmount,
                DueAmount: guestbillingData.DueAmount,
                PaymentMethod: guestbillingData.PaymentMethod,
                Description: guestbillingData.Description
            }
            const result = await addGuestBilling(payload);

            if (result) {
                toast.success("Guest Billing added successfully!");
                router.push("/financial/guestbilling");
            } else {
                toast.error("Failed to add Guest Billing");
            }
        } catch (error) {
            toast.error("Failed to add Guest Billing");
            console.error("Guest Billing Add Error:", error);
        }
    };

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

    const getGuestOptions = async () => {
        const data = await getGuest();
        let options = data.map((item: any) => ({
            _id: item._id,
            Name: item.GuestName,
            Status: "Active",
        })).sort((a: any, b: any) => a.Name.toLowerCase().localeCompare(b.Name.toLowerCase()));;
        console.log("Guest Options:", options);
        return new Promise((resolve) => resolve(options));
    }

    // Object-based fields (for ObjectSelect)
    const objectFields = [
        { key: "Guest", fetchFn: getGuestOptions },
    ];
    const fetchFields = async () => {
        await handleFieldOptions(
            [
                { key: "Property", fetchFn: getProperties },
                { key: "PaymentMethods", fetchFn: getPayments },
            ],
            setFieldOptions
        );
        await handleFieldOptionsObject(objectFields, setFieldOptions);
    }

    // Dropdown data
    const users = ["Admin", "Seller", "Visitor"];
    const paymentMethods = ["Cash", "UPI", "Bank Transfer"];
    const statusOptions = ["Active", "Inactive"];

    return (
        <div className="min-h-screen flex justify-center">
            <Toaster position="top-right" />
            <div className="w-full">
                {/* Back Button */}
                <div className="flex justify-end mb-4">

                    <BackButton
                        url="/financial/guestbilling"
                        text="Back"
                        icon={<ArrowLeft size={18} />}
                    />
                </div>

                {/* Form Card */}
                <div className="bg-white/90 backdrop-blur-lg p-10 w-full rounded-3xl shadow-2xl">
                    <form onSubmit={(e) => e.preventDefault()} className="w-full">
                        {/* Header */}
                        <div className="mb-8 text-left border-b pb-4 border-gray-200">
                            <h1 className="text-3xl font-extrabold text-[var(--color-secondary-darker)] leading-tight tracking-tight">
                                Edit <span className="text-[var(--color-primary)]">Guest Billing</span>
                            </h1>
                        </div>

                        {/* Form Fields */}
                        <div className="flex flex-col space-y-6">
                            <div className="grid grid-cols-2 gap-6 max-lg:grid-cols-1">
                                {/* User */}


                                <ObjectSelect
                                    options={Array.isArray(fieldOptions?.Guest) ? fieldOptions.Guest: []}
                                    label={"Guest"}
                                    value={guestbillingData.Guest?.id}
                                    getLabel={(item) => item?.Name || ""}   // ✅ FIX
                                    getId={(item) => item?._id || ""}
                                    onChange={(selectedId) => {
                                        const selectedObj = fieldOptions.Guest.find(
                                            (i) => i._id === selectedId
                                        );

                                        if (selectedObj) {
                                            setGuestBillingData((prev) => ({
                                                ...prev,
                                                Guest: {
                                                    id: selectedObj._id,
                                                    name: selectedObj.Name,          // ✅ FIX
                                                },
                                            }));
                                        }
                                    }}
                                    error={errors.Guest}
                                />


                                {/* Date */}
                                <DateSelector
                                    label="FromDate"
                                    value={guestbillingData.FromDate}
                                    onChange={(v) => handleSelectChange("FromDate", v)}
                                    error={errors.FromDate}
                                />

                                <DateSelector
                                    label="ToDate"
                                    value={guestbillingData.ToDate}
                                    onChange={(v) => handleSelectChange("ToDate", v)}
                                    error={errors.ToDate}
                                />
                                {/* Payment Method */}
                                <SingleSelect
                                    options={Array.isArray(fieldOptions?.PaymentMethods) ? fieldOptions.PaymentMethods : []}
                                    label="Payment Method"
                                    value={guestbillingData.PaymentMethod}
                                    onChange={(v) => handleSelectChange("PaymentMethod", v)}
                                    error={errors.PaymentMethod}
                                />

                                {/* Expense */}
                                <InputField
                                    label="Amount"
                                    name="Amount"
                                    value={guestbillingData.Amount}
                                    onChange={handleInputChange}
                                    error={errors.Expense}
                                />

                                {/* Amount */}
                                <InputField
                                    label="Recieved Amount"
                                    name="RecievedAmount"
                                    value={guestbillingData.RecievedAmount}
                                    onChange={handleInputChange}
                                    error={errors.RecievedAmount}
                                />

                                {/* Due Amount */}
                                <InputField
                                    label="Due Amount"
                                    name="DueAmount"
                                    value={guestbillingData.DueAmount}
                                    onChange={handleInputChange}
                                />

                                




                                <TextareaField label={"Description"} name="Description" value={guestbillingData.Description} onChange={handleInputChange} />
                            </div>

                            {/* Save Button */}
                            <div className="flex justify-end mt-4">

                                <SaveButton text="Save" onClick={handleSubmit} />

                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

// 🟦 Reusable Input Field
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
