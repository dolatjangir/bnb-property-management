'use client';

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import SingleSelect from "@/app/component/SingleSelect";
import toast, { Toaster } from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { typesAllDataInterface } from "@/store/masters/types/types.interface";
import { getTypesById, updateTypes } from "@/store/masters/types/types";
import { handleFieldOptions } from "@/app/utils/handleFieldOptions";
import { getCampaign } from "@/store/masters/campaign/campaign";
import BackButton from "@/app/component/buttons/BackButton";
import SaveButton from "@/app/component/buttons/SaveButton";
import { handleFieldOptionsObject } from "@/app/utils/handleFieldOptionsObject";
import ObjectSelect from "@/app/component/ObjectSelect";
import MasterProtectedRoute from "@/app/component/MasterProtectedRoutes";
import { getRoomById, updateRoom } from "@/store/room/rooms/rooms";
import { roomAllDataInterface } from "@/store/room/rooms/rooms.interface";
import { getFloor } from "@/store/masters/floor/floor";
import { getRoomType } from "@/store/masters/roomtype/roomtype";
import { getProperty } from "@/store/property";
import ProtectedRoute from "@/app/component/ProtectedRoutes";

interface ErrorInterface {
    [key: string]: string;
}

export default function RoomEdit() {
    const [roomData, setRoomData] = useState<roomAllDataInterface>({
        Property: "",
        Floor: "",
        Room: "",
        RoomType: "",
        CareTaker: "",
    });

    const [errors, setErrors] = useState<ErrorInterface>({});
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { id } = useParams();
    const [fieldOptions, setFieldOptions] = useState<Record<string, any[]>>({});


    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            setRoomData((prev) => ({ ...prev, [name]: value }));
            setErrors((prev) => ({ ...prev, [name]: "" }));
        },
        []
    );

    const handleSelectChange = useCallback((label: string, selected: string) => {
        setRoomData((prev) => ({ ...prev, [label]: selected }));
        setErrors((prev) => ({ ...prev, [label]: "" }));
    }, []);

    const validateForm = () => {
        const newErrors: ErrorInterface = {};
        if (!roomData.Property.trim()) newErrors.Property = "Property is required";
        if (!roomData.Room.trim()) newErrors.Room = " Room is required";
        if (!roomData.Floor.trim()) newErrors.Floor = "Floor is required";
        return newErrors;
    };

    // Fetch existing data
    useEffect(() => {
        const fetchRoomData = async () => {
            const res = await getRoomById(id as string);
            console.log(res)
            if (res) {
                setRoomData({
                    Property: res.Property,
                    Floor: res.Floor,
                    Room: res.Room,
                    RoomType: res.RoomType,
                    CareTaker: res.CareTaker,
                });
            } else {
                toast.error("Failed to fetch Room details");
            }
            setLoading(false);
        };
        if (id) {
            fetchFields();
            fetchRoomData();
        }
    }, [id]);

    const handleSubmit = async () => {
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const result = await updateRoom(id as string, roomData);
            if (result) {
                toast.success(" Room updated successfully!");
                router.push("/rooms");
            }
        } catch (error) {
            toast.error("Failed to update  Room");
            console.error("Room Update Error:", error);
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

    const fetchFields = async () => {
        await handleFieldOptions(
            [
                { key: "Property", fetchFn: getProperties },
                { key: "Floor", fetchFn: getFloor },
                { key: "RoomType", fetchFn: getRoomType },
                { key: "Status", staticData: ["Active", "Inactive"] },
            ],
            setFieldOptions
        );
    };

    const statusOptions = ["Active", "Inactive"];
    const campaignOptions = ["Real Estate 2025", "Campaign A", "Campaign B", "Campaign C"];
    // dummy options

    if (loading) null;
    /* return (
      <div className="flex justify-center items-center min-h-screen text-gray-700 text-lg">
        Loading...
      </div>
    ); */

    return (
        <ProtectedRoute>
            <div className=" min-h-screen flex justify-center">
                <Toaster position="top-right" />
                <div className="w-full">
                    {/* Back Button */}
                    <div className="flex justify-end mb-4">

                        <BackButton
                            url="/rooms"
                            text="Back"
                            icon={<ArrowLeft size={18} />}
                        />
                    </div>

                    {/* Form Card */}
                    <div className="bg-white/90 backdrop-blur-lg p-10 w-full rounded-3xl shadow-2xl">
                        <form onSubmit={(e) => e.preventDefault()} className="w-full">
                            <div className="mb-8 text-left border-b pb-4 border-gray-200">
                                <h1 className="text-3xl font-extrabold text-gray-800 leading-tight tracking-tight">
                                    Edit <span className="text-[var(--color-primary)]"> Room</span>
                                </h1>
                            </div>

                            <div className="flex flex-col space-y-6">
                                <div className="grid grid-cols-2 gap-6 max-lg:grid-cols-1">

                                    <SingleSelect className=" "
                                        options={Array.isArray(fieldOptions?.Property) ? fieldOptions.Property : []}
                                        label="Property"
                                        value={roomData.Property}
                                        onChange={(v) => handleSelectChange("Property", v)} 
                                        error={errors.Property}
                                        />

                                    {/*  Room Name */}
                                    <InputField
                                        label=" Room Name"
                                        name="Room"
                                        value={roomData.Room}
                                        onChange={handleInputChange}
                                        error={errors.Room}
                                    />
                                    <SingleSelect className=""
                                        options={Array.isArray(fieldOptions?.Floor) ? fieldOptions.Floor : []}
                                        label="Floor"
                                        value={roomData.Floor}
                                        onChange={(v) => handleSelectChange("Floor", v)}
                                        error={errors.Floor}
                                    />
                                    <SingleSelect className=" "
                                        options={Array.isArray(fieldOptions?.RoomType) ? fieldOptions.RoomType : []}
                                        label="Room Type"
                                        value={roomData.RoomType}
                                        onChange={(v) => handleSelectChange("RoomType", v)}
                                    />

                                    <InputField
                                        label="Care Taker"
                                        name="CareTaker"
                                        value={roomData.CareTaker}
                                        onChange={handleInputChange}
                                        error={errors.CareTaker}
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
        </ProtectedRoute>
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
