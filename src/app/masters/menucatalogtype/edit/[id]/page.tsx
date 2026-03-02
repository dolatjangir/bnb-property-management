'use client';

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import SingleSelect from "@/app/component/SingleSelect";
import toast, { Toaster } from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { handleFieldOptions } from "@/app/utils/handleFieldOptions";

import BackButton from "@/app/component/buttons/BackButton";
import SaveButton from "@/app/component/buttons/SaveButton";
import { handleFieldOptionsObject } from "@/app/utils/handleFieldOptionsObject";
import ObjectSelect from "@/app/component/ObjectSelect";
import MasterProtectedRoute from "@/app/component/MasterProtectedRoutes";
import { getMenuCatalogTypeById, updateMenuCatalogType } from "@/store/masters/menucatalogtype/menucatalogtype";
import { menuCatalogTypeAllDataInterface } from "@/store/masters/menucatalogtype/menucatalogtype.interface";
import { getMenuCatalog } from "@/store/masters/menucatalog/menucatalog";

interface ErrorInterface {
  [key: string]: string;
}

export default function MenuCatalogTypeEdit() {
  const [menuCatalogType, setTypeData] = useState<menuCatalogTypeAllDataInterface>({
    MenuCatalog: "",
    Name: "",
    Status: "",
  });

  const [errors, setErrors] = useState<ErrorInterface>({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = useParams();
  const [fieldOptions, setFieldOptions] = useState<Record<string, any[]>>({});


  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setTypeData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    },
    []
  );

  const handleSelectChange = useCallback((label: string, selected: string) => {
    setTypeData((prev) => ({ ...prev, [label]: selected }));
    setErrors((prev) => ({ ...prev, [label]: "" }));
  }, []);

  const validateForm = () => {
    const newErrors: ErrorInterface = {};
    if (!menuCatalogType.MenuCatalog.trim()) newErrors.MenuCatalog = "MenuCatalog is required";
    if (!menuCatalogType.Name.trim()) newErrors.Name = "Menu Catalog Type Name is required";
    if (!menuCatalogType.Status.trim()) newErrors.Status = "Status is required";
    return newErrors;
  };

  // Fetch existing data
  useEffect(() => {
    const fetchTypeData = async () => {
      const res = await getMenuCatalogTypeById(id as string);
      console.log(res)
      if (res) {
        setTypeData({
          MenuCatalog: res.MenuCatalog?._id,
          Name: res.Name,
          Status: res.Status,
        });
      } else {
        toast.error("Failed to fetch Menu Catalog Type details");
      }
      setLoading(false);
    };
    if (id) {
      fetchFields();
      fetchTypeData();
    }
  }, [id]);

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const result = await updateMenuCatalogType(id as string, menuCatalogType);
      if (result) {
        toast.success("Menu Catalog Type updated successfully!");
        router.push("/masters/menucatalogtype");
      }
    } catch (error) {
      toast.error("Failed to update Menu Catalog Type");
      console.error("Menu CatalogType Update Error:", error);
    }
  };

  const fetchFields = async () => {
    await handleFieldOptionsObject(
      [
        { key: "Status", staticData: ["Active", "Inactive"] },
        { key: "MenuCatalog", fetchFn: getMenuCatalog },
      ],
      setFieldOptions
    );
  };

  const statusOptions = ["Active", "Inactive"];
  const campaignOptions = ["Real Estate 2025", "MenuCatalog A", "MenuCatalog B", "MenuCatalog C"];
  // dummy options

  if (loading) null;
  /* return (
    <div className="flex justify-center items-center min-h-screen text-gray-700 text-lg">
      Loading...
    </div>
  ); */

  return (
    <MasterProtectedRoute>
    <div className=" min-h-screen flex justify-center">
      <Toaster position="top-right" />
      <div className="w-full">
        {/* Back Button */}
        <div className="flex justify-end mb-4">

          <BackButton
            url="/masters/menucatalogtype"
            text="Back"
            icon={<ArrowLeft size={18} />}
          />
        </div>

        {/* Form Card */}
        <div className="bg-white/90 backdrop-blur-lg p-10 w-full rounded-3xl shadow-2xl">
          <form onSubmit={(e) => e.preventDefault()} className="w-full">
            <div className="mb-8 text-left border-b pb-4 border-gray-200">
              <h1 className="text-3xl font-extrabold text-gray-800 leading-tight tracking-tight">
                Edit <span className="text-[var(--color-primary)]">Menu Catalog Type</span>
              </h1>
            </div>

            <div className="flex flex-col space-y-6">
              <div className="grid grid-cols-2 gap-6 max-lg:grid-cols-1">
                {/* MenuCatalog Dropdown */}
                
                <ObjectSelect
                  options={Array.isArray(fieldOptions?.MenuCatalog) ? fieldOptions.MenuCatalog : []}
                  label="Menu Catalog"
                  value={menuCatalogType.MenuCatalog}
                  getLabel={(item) => item?.Name || ""}
                  getId={(item) => item?._id || ""}
                  onChange={(selected) => {
                    setTypeData((prev) => ({ ...prev, MenuCatalog: selected }));
                    setErrors((prev) => ({ ...prev, MenuCatalog: "" }));
                  }}
                  error={errors.MenuCatalog}
                />

                {/* Menu Catalog Type Name */}
                <InputField
                  label="Menu Catalog Type"
                  name="Name"
                  value={menuCatalogType.Name}
                  onChange={handleInputChange}
                  error={errors.Name}
                />

                {/* Status Dropdown */}
                <SingleSelect
                  options={statusOptions}
                  label="Status"
                  value={menuCatalogType.Status}
                  onChange={(v) => handleSelectChange("Status", v)}
                />
              </div>

              {/* Update Button */}
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

// 🟩 Reusable Input Field
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
