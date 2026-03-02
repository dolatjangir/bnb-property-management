'use client';

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import SingleSelect from "@/app/component/SingleSelect";
import toast, { Toaster } from "react-hot-toast";
import BackButton from "@/app/component/buttons/BackButton";
import SaveButton from "@/app/component/buttons/SaveButton";
import MasterProtectedRoute from "@/app/component/MasterProtectedRoutes";
import { floorAllDataInterface } from "@/store/masters/floor/floor.interface";
import { getFloorById, updateFloor } from "@/store/masters/floor/floor";

interface ErrorInterface {
  [key: string]: string;
}

export default function FloorEdit() {
  const { id } = useParams();
  const router = useRouter();

  const [floorData, setFloorData] = useState<floorAllDataInterface>({
    Name: "",
    Status: "",
  });
  const [errors, setErrors] = useState<ErrorInterface>({});
  const [loading, setLoading] = useState(true);

  // Fetch Floor by ID
  useEffect(() => {
    const fetchFloor = async () => {
      try {
        const data = await getFloorById(id as string);
        if (data) setFloorData(data);
        else toast.error("Floor not found");
      } catch (error) {
        toast.error("Error fetching floor details");
        console.error("Fetch Floor Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchFloor();
  }, [id]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFloorData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    },
    []
  );

  const handleSelectChange = useCallback((label: string, selected: string) => {
    setFloorData((prev) => ({ ...prev, [label]: selected }));
    setErrors((prev) => ({ ...prev, [label]: "" }));
  }, []);

  const validateForm = () => {
    const newErrors: ErrorInterface = {};
    if (!floorData.Name.trim()) newErrors.Name = "Floor Name is required";
    if (!floorData.Status.trim()) newErrors.Status = "Status is required";
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const result = await updateFloor(id as string, floorData);
      if (result) {
        toast.success("Floor updated successfully!");
        router.push("/masters/floor");
      } else toast.error("Failed to update floor");
    } catch (error) {
      toast.error("Failed to update floor");
      console.error("Update Floor Error:", error);
    }
  };

  const statusOptions = ["Active", "Inactive"];

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Loading floor details...
      </div>
    );

  return (
    <MasterProtectedRoute>
      <div className="min-h-screen flex justify-center">
        <Toaster position="top-right" />
        <div className="w-full">
          {/* Back Button */}
          <div className="flex justify-end mb-4">
            <BackButton
              url="/masters/floor"
              text="Back"
              icon={<ArrowLeft size={18} />}
            />
          </div>

          {/* Form Card */}
          <div className="bg-white/90 backdrop-blur-lg p-10 w-full rounded-3xl shadow-2xl">
            <form onSubmit={(e) => e.preventDefault()} className="w-full">
              <div className="mb-8 text-left border-b pb-4 border-gray-200">
                <h1 className="text-3xl font-extrabold text-[var(--color-secondary-darker)] leading-tight tracking-tight">
                  Edit <span className="text-[var(--color-primary)]">Floor</span>
                </h1>
              </div>

              <div className="flex flex-col space-y-6">
                <div className="grid grid-cols-2 gap-6 max-lg:grid-cols-1">
                  {/* Floor Name */}
                  <InputField
                    label="Floor Name"
                    name="Name"
                    value={floorData.Name}
                    onChange={handleInputChange}
                    error={errors.Name}
                  />

                  {/* Status */}
                  <SingleSelect
                    options={statusOptions}
                    label="Status"
                    value={floorData.Status}
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

// Reusable Input Field
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
        ${
          error
            ? "border-red-500 focus:border-red-500"
            : "border-gray-400 focus:border-blue-500"
        }`}
    />
    <p
      className={`absolute left-2 bg-white px-1 text-gray-500 text-sm transition-all duration-300
      ${
        value || error
          ? "-top-2 text-xs text-blue-500"
          : "peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500"
      }`}
    >
      {label}
    </p>
    {error && <span className="text-red-500 text-sm mt-1 block">{error}</span>}
  </label>
);
