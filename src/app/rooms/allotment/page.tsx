"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { toast, Toaster } from "react-hot-toast";
import { MdDelete, MdEdit } from "react-icons/md";
import Button from "@mui/material/Button";
import { PlusSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import DeleteDialog from "@/app/component/popups/DeleteDialog";
import AddButton from "@/app/component/buttons/AddButton";
import PageHeader from "@/app/component/labels/PageHeader";

import ProtectedRoute from "@/app/component/ProtectedRoutes";
import { deleteAllRoomAllotment, deleteRoomAllotment, getRoomAllotment } from "@/store/room/roomallotment/roomallotment";
import { roomAllotmentDialogDataInterface, roomAllotmentGetDataInterface } from "@/store/room/roomallotment/roomallotment.interface";
import RoomAllotmentTable from "@/app/phonescreens/DashboardScreens/tables/RoomAllotmentTable";

interface DeleteAllDialogDataInterface { }

export default function RoomAllotmentPage() {
    const [roomAllotment, setRoomAllotment] = useState<roomAllotmentGetDataInterface[]>([]);
    const [keyword, setKeyword] = useState("");
    const [limit, setLimit] = useState("10");
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);
    const [deleteDialogData, setDeleteDialogData] =
        useState<roomAllotmentDialogDataInterface | null>(null);
    const [deleteAllDialogData, setDeleteAllDialogData] =
        useState<DeleteAllDialogDataInterface | null>(null);
    const [currentTablePage, setCurrentTablePage] = useState(1);
    const [rowsPerTablePage, setRowsPerTablePage] = useState(10);
    const [selectedRoomAllotment, setSelectedRoomAllotment] = useState<string[]>([]);
    const router = useRouter();

    const fetchRoomAllotment = async () => {
        const data = await getRoomAllotment();
        console.log(" RoomAllotment: ", data)
        if (data) {
            const formatted = data.map((t: any) => ({
                ...t,
                Property: t.Property.charAt(0).toUpperCase() + t.Property.slice(1),
                Room: t.Room.Room,
            }));
            setRoomAllotment(formatted);
        }
    };

    useEffect(() => {
        fetchRoomAllotment();
    }, []);

    useEffect(() => {
        setRowsPerTablePage(Number(limit));
        setCurrentTablePage(1);
    }, [limit])

    const filteredRoomAllotment = useMemo(() => {
        return roomAllotment
            .filter(
                (t) =>
                    keyword === "" ||
                    t.Property.toLowerCase().includes(keyword.toLowerCase()) ||
                    t.Guest.toLowerCase().includes(keyword.toLowerCase()) ||
                    t.Room.toLowerCase().includes(keyword.toLowerCase()) ||
                    t.FromDate.toLowerCase().includes(keyword.toLowerCase()) ||
                    t.ToDate.toLowerCase().includes(keyword.toLowerCase())
            )
    }, [roomAllotment, keyword]);

    /* SELECT ALL HANDLER */
    const handleSelectAll = () => {
        const allIds = currentRows.map((c) => c._id);
        setSelectedRoomAllotment((prev) =>
            allIds.every((id) => prev.includes(id))
                ? prev.filter((id) => !allIds.includes(id)) // unselect all
                : [...new Set([...prev, ...allIds])] // select all visible rows
        );
    };
    /* ✅ SELECT SINGLE ROW HANDLER */
    const handleSelectRow = (id: string) => {
        setSelectedRoomAllotment((prev) =>
            prev.includes(id)
                ? prev.filter((cid) => cid !== id)
                : [...prev, id]
        );
    };

    const handleDelete = async (data: roomAllotmentDialogDataInterface | null) => {
        if (!data) return;
        const res = await deleteRoomAllotment(data.id);
        if (res) {
            toast.success("allotment deleted successfully!");
            setIsDeleteDialogOpen(false);
            setDeleteDialogData(null);
            fetchRoomAllotment();
            return;
        }
        toast.error("Failed to delete Customer Type.");
    };

    const handleEdit = (id?: string) => {
        router.push(`/rooms/allotment/edit/${id}`);
    };

    const handleDeleteAll = async () => {
        if (filteredRoomAllotment.length === 0) return;
        const payload = {
            roomAllotmentIds: [...selectedRoomAllotment]
        }
        const response = await deleteAllRoomAllotment(payload);
        if (response) {
            toast.success(`All room allotment deleted`);
            setIsDeleteAllDialogOpen(false);
            setDeleteAllDialogData(null);
            setSelectedRoomAllotment([]);

            fetchRoomAllotment();
            return;
        }
    };

    const handleClear = () => {
        setKeyword("");
        setLimit("10");
    };

    const totalTablePages = Math.ceil(filteredRoomAllotment.length / rowsPerTablePage);
    const indexOfLastRow = currentTablePage * rowsPerTablePage;
    const indexOfFirstRow = indexOfLastRow - rowsPerTablePage;
    const currentRows = filteredRoomAllotment.slice(indexOfFirstRow, indexOfLastRow);

    const phonetableheader = [
        {
            key: "Property", label: "Property"
        },
        {
            key: "Room", label: "Room #"
        },
        {
            key: "Guest", label: "Guest"
        },
        {
            key: "FromDate", label: "Check In"
        },
        {
            key: "ToDate", label: "Check Out"
        },
    ]

    const phoneViewAllHaders = [
        {
            key: "Name", label: "Name",
        },
        {
            key: "Description", label: "Description",
        },
        {
            key: "MenuCatalog", label: "Catalog",
        },
        {
            key: "MenuCatalogType", label: "Catalog Type",
        },
        {
            key: "Price", label: "Price", prefix: "₹"
        },
        {
            key: "Stock", label: "Stock",
        },


    ]

    return (
        <ProtectedRoute>
            <Toaster position="top-right" />
            <div className=" sm:hidden min-h-[calc(100vh-56px)] overflow-auto max-sm:py-2 p-2">
                <div className=" flex justify-between items-center px-0  my-5 px-2">
                    <div>
                        <h1 className="text-[22px] font-bold text-gray-900 leading-tight tracking-tight">
                            Alloted Rooms
                        </h1>
                        <p className="text-[12px] text-gray-400 font-medium mt-0.5">
                            Manage Allotments
                        </p>
                    </div>
                    <AddButton
                        url={"/rooms/allotment/add"}
                        text="Add"
                        icon={<PlusSquare size={18} />}
                    />
                </div>
                <RoomAllotmentTable
                    leads={roomAllotment}
                    labelLeads={phonetableheader}
                    onEdit={(id) => router.push(`/rooms/allotment/edit/${id}`)}
                />
            </div>
            <div className="min-h-[calc(100vh-56px)] max-sm:hidden overflow-auto max-md:py-10">


                {/* DELETE POPUP */}
                <DeleteDialog<roomAllotmentDialogDataInterface>
                    isOpen={isDeleteDialogOpen}
                    title="Are you sure you want to delete this room?"
                    data={deleteDialogData}
                    onClose={() => {
                        setIsDeleteDialogOpen(false);
                        setDeleteDialogData(null);
                    }}
                    onDelete={handleDelete}
                />

                <DeleteDialog<DeleteAllDialogDataInterface>
                    isOpen={isDeleteAllDialogOpen}
                    title="Are you sure you want to delete selected allotments?"
                    data={deleteAllDialogData}
                    onClose={() => {
                        setIsDeleteAllDialogOpen(false);
                        setDeleteAllDialogData(null);
                    }}
                    onDelete={handleDeleteAll}
                />


                {/* Card Container */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 relative">
                    <PageHeader title="Dashboard" subtitles={["RoomAllotment"]} />
                    {/* Add Button */}

                    <AddButton
                        url="/rooms/allotment/add"
                        text="Add"
                        icon={<PlusSquare size={18} />}
                    />

                    {/* Filter Form */}
                    <form className="w-full flex flex-wrap gap-6 items-end mb-6 mt-16">
                        <div className="flex flex-col flex-1 w-60">
                            <label
                                htmlFor="keyword"
                                className="text-lg font-medium text-gray-900 pl-1"
                            >
                                Keyword
                            </label>
                            <input
                                id="keyword"
                                type="text"
                                placeholder="Search by name or campaign..."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                className="w-full outline-none border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-800"
                            />
                        </div>

                        <div className="flex flex-col w-40">
                            <label
                                htmlFor="limit"
                                className="text-lg font-medium text-gray-900 pl-1"
                            >
                                Limit
                            </label>
                            <select
                                id="limit"
                                value={limit}
                                onChange={(e) => setLimit(e.target.value)}
                                className="h-10 border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-800"
                            >
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                            </select>
                        </div>

                        <div className="flex gap-3 ml-auto">
                            <button
                                type="button"
                                onClick={handleClear}
                                className="px-4 py-2 text-sm hover:underline transition-all"
                            >
                                Clear Search
                            </button>
                        </div>
                    </form>

                    {/* Table */}
                    <div className="overflow-auto relative">
                        <div className=" flex justify-between items-center sticky top-0 left-0 w-full">
                            <div className="flex gap-10 items-center px-3 py-4 min-w-max text-gray-700">
                                <label htmlFor="selectall" className=" relative overflow-hidden py-[2px] group hover:bg-[var(--color-primary-lighter)] hover:text-white text-[var(--color-primary)] bg-[var(--color-primary-lighter)]  rounded-tr-sm rounded-br-sm  border-l-[3px] px-2 border-l-[var(--color-primary)] cursor-pointer">
                                    <div className=" absolute top-0 left-0 z-0 h-full bg-[var(--color-primary)] w-0 group-hover:w-full transition-all duration-300 "></div>
                                    <span className="relative">Select All</span>
                                </label>
                                <button type="button" className=" relative overflow-hidden py-[2px] group hover:bg-[var(--color-primary-lighter)] hover:text-white text-[var(--color-primary)] bg-[var(--color-primary-lighter)]  rounded-tr-sm rounded-br-sm  border-l-[3px] px-2 border-l-[var(--color-primary)] cursor-pointer" onClick={() => {
                                    if (filteredRoomAllotment.length > 0) {
                                        if (selectedRoomAllotment.length < 1) {
                                            const firstPageIds = currentRows.map((c) => c._id);
                                            setSelectedRoomAllotment(firstPageIds);
                                        }

                                        setIsDeleteAllDialogOpen(true);
                                        setDeleteAllDialogData({});
                                    }
                                }}><div className=" absolute top-0 left-0 z-0 h-full bg-[var(--color-primary)] w-0 group-hover:w-full transition-all duration-300 "></div>
                                    <span className="relative ">Delete All</span>
                                </button>
                            </div>
                        </div>
                        <table className="table-auto w-full border-collapse text-sm border border-gray-200">
                            <thead className="bg-[var(--color-primary)] rounmd text-white">
                                <tr className="">
                                    <th className="px-2 py-3 text-left">

                                        <input
                                            id="selectall"
                                            type="checkbox"
                                            className=" hidden"
                                            checked={
                                                currentRows.length > 0 &&
                                                currentRows.every((r) => selectedRoomAllotment.includes(r._id))
                                            }
                                            onChange={handleSelectAll}
                                        />

                                    </th>
                                    <th className="px-4 py-3 border-r border-r-[var(--color-secondary-dark)] text-left">S.No.</th>
                                    <th className="px-4 py-3 border-r border-r-[var(--color-secondary-dark)] text-left">Property</th>
                                    <th className="px-4 py-3 border-r border-r-[var(--color-secondary-dark)] text-left">Room</th>
                                    <th className="px-4 py-3 border-r border-r-[var(--color-secondary-dark)] text-left">Guest</th>
                                    <th className="px-4 py-3 border-r border-r-[var(--color-secondary-dark)] text-left">From</th>
                                    <th className="px-4 py-3 border-r border-r-[var(--color-secondary-dark)] text-left">To</th>

                                    <th className="px-4 py-3 border-r border-r-[var(--color-secondary-dark)] text-left">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {currentRows.length > 0 ? (
                                    currentRows.map((t, i) => (
                                        <tr
                                            key={t._id || i}
                                            className="border-t hover:bg-[#f7f6f3] transition-all duration-200"
                                        >
                                            <td className="px-2 py-3 border border-gray-200">

                                                <input
                                                    type="checkbox"
                                                    checked={selectedRoomAllotment.includes(t._id)}
                                                    onChange={() => handleSelectRow(t._id)}
                                                />

                                            </td>
                                            <td className="px-4 py-3">
                                                {(currentTablePage - 1) * rowsPerTablePage + (i + 1)}
                                            </td>
                                            <td className="px-4 py-3 border border-gray-200">{t.Property}</td>
                                            <td className="px-4 py-3 border border-gray-200">{t.Room}</td>
                                            <td className="px-4 py-3 border border-gray-200">{t.Guest}</td>
                                            <td className="px-4 py-3 border border-gray-200">{t.FromDate}</td>
                                            <td className="px-4 py-3 border border-gray-200">{t.ToDate}</td>

                                            <td className="px-4 py-3 border border-gray-200">

                                                <Button
                                                    sx={{
                                                        backgroundColor: "#E8F5E9",
                                                        color: "var(--color-primary)",
                                                        minWidth: "32px",
                                                        height: "32px",
                                                        borderRadius: "8px",
                                                    }}
                                                    onClick={() => handleEdit(t._id || String(i))}
                                                >
                                                    <MdEdit />
                                                </Button>

                                                <Button
                                                    sx={{
                                                        backgroundColor: "#FDECEA",
                                                        color: "#C62828",
                                                        minWidth: "32px",
                                                        height: "32px",
                                                        borderRadius: "8px",
                                                    }}
                                                    onClick={() => {
                                                        setIsDeleteDialogOpen(true);
                                                        setDeleteDialogData({
                                                            id: t._id || String(i),
                                                            Property: t.Property,
                                                            Room: t.Room,
                                                        });
                                                    }}
                                                >
                                                    <MdDelete />
                                                </Button>

                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={9}
                                            className="text-center py-4 text-gray-500"
                                        >
                                            No RoomAllotment available.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        <div className="flex justify-between items-center mt-3 py-3 px-5">
                            <p className="text-sm">
                                Page {currentTablePage} of {totalTablePages}
                            </p>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setCurrentTablePage((p) => Math.max(1, p - 1))
                                    }
                                    disabled={currentTablePage === 1}
                                    className="px-3 py-1 bg-gray-200 border border-gray-300 rounded disabled:opacity-50"
                                >
                                    Prev
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setCurrentTablePage((p) =>
                                            p < totalTablePages ? p + 1 : p
                                        )
                                    }
                                    disabled={
                                        currentTablePage === totalTablePages ||
                                        currentRows.length <= 0
                                    }
                                    className="px-3 py-1 bg-gray-200 border border-gray-300 rounded disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
