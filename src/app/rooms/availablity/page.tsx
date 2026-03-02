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
import { roomAvailabilityGetDataInterface } from "@/store/room/roomavailablity/roomavailability.interface";
import { getRoom } from "@/store/room/rooms/rooms";

interface DeleteAllDialogDataInterface { }

export default function RoomAllotmentPage() {
    const [roomAllotment, setRoomAllotment] = useState<any[]>([]);
    const [availableRooms, setAvailableRooms] = useState<roomAvailabilityGetDataInterface[]>([]);
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
        // console.log(" RoomAllotment: ", data)
        if (data) {
            const formatted = data.map((item: any) => item.Room);
            setRoomAllotment(formatted);
            return formatted;
            // console.log(" Formatted RoomAllotment: ", formatted)
        }
    };

    useEffect(() => {
        getAvailableRooms();
    }, []);

    useEffect(() => {
        setRowsPerTablePage(Number(limit));
        setCurrentTablePage(1);
    }, [limit])


    const getAvailableRooms = async () => {
        //alloted rooms
        const roomAllotments = await fetchRoomAllotment();
        const allotedRooms = roomAllotments.map((allotment: any) => {
            return {
                id: allotment.id,
                Room: allotment.Room
            }
        });

        //all rooms
        let AllRooms = await getRoom();
        AllRooms = AllRooms.map((room: any) => {
            return {
                ...room,
                id: room._id,
                Room: room.Room
            }
        })


        console.log(" AllRooms: ", AllRooms, "\n AllotedRooms: ", allotedRooms)


        const available = AllRooms.filter((room: any) => {
            return !allotedRooms.some((allotment: any) => allotment.id === room.id);
        });
        console.log(" Available Rooms: ", available)
        setAvailableRooms(available);
    }

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


    const allotRoom = (id?: string) => {
        router.push(`/rooms/allotment/add?roomId=${id}`);
    };


    const handleClear = () => {
        setKeyword("");
        setLimit("10");
    };

    const totalTablePages = Math.ceil(filteredRoomAllotment.length / rowsPerTablePage);
    const indexOfLastRow = currentTablePage * rowsPerTablePage;
    const indexOfFirstRow = indexOfLastRow - rowsPerTablePage;
    const currentRows = filteredRoomAllotment.slice(indexOfFirstRow, indexOfLastRow);

    return (
        <ProtectedRoute>
            <Toaster position="top-right" />
            <div className="min-h-[calc(100vh-56px)] overflow-auto max-md:py-10">


                {/* Card Container */}
                <div className="sm:bg-white p-4 max-sm:p-1 rounded-2xl sm:shadow-lg border border-gray-200 relative">
                    <PageHeader title="Dashboard" subtitles={["Available Rooms"]} />
                    {/* Add Button */}

                    {/*   <AddButton
                        url="/rooms/allotment/add"
                        text="Add"
                        icon={<PlusSquare size={18} />}
                    /> */}

                    {/* Filter Form */}
 

                    {/* Table */}
                    <div className="overflow-auto relative">
                        <div className=" ">
                            {
                                availableRooms.length === 0 ? (
                                    <p className="text-center py-10">No Available Rooms Found.</p>
                                ) : (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 p-0">
                                        {availableRooms.map((room, index) => (
                                            <div
                                                key={room.id}
                                                className="group cursor-pointer relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                                                style={{
                                                    animationDelay: `${index * 100}ms`,
                                                    animation: 'fadeInUp 0.6s ease-out forwards',
                                                }}
                                            >
                                                {/* Decorative background element */}
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[var(--color-primary)]/10 to-transparent rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500" />

                                                {/* Content */}
                                                <div className="relative p-6 flex flex-col h-full">
                                                    {/* Room number badge */}
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="relative animate-pulse">
                                                            <div className="absolute inset-0 bg-[var(--color-primary)] blur-xl opacity-30 rounded-full" />
                                                            <div className="relative bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary)]/80 text-white px-6 py-3 rounded-xl font-bold text-2xl shadow-lg">
                                                                #{room.Room}
                                                            </div>
                                                        </div>

                                                        {/* Status indicator */}
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Available
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Floor information */}
                                                    <div className="flex items-center gap-3 mb-6">
                                                        <div className="p-2 bg-gray-100 rounded-lg">
                                                            <svg
                                                                className="w-5 h-5 text-gray-600"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                                                />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500 font-medium">Floor</p>
                                                            <p className="text-lg font-semibold text-gray-800">{room.Floor}</p>
                                                        </div>
                                                    </div>

                                                    {/* Spacer */}
                                                    <div className="flex-grow" />

                                                    {/* Action button */}
                                                    <button className="w-full relative overflow-hidden bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)]/90 text-white hover:from-[var(--color-secondary)] hover:to-[var(--color-secondary)]/90 cursor-pointer transition-colors duration-200 font-semibold py-3.5 px-6 rounded-xl shadow-lg "
                                                    onClick={() => allotRoom(room.id)}
                                                    >
                                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                                            Allot Room
                                                            <svg
                                                                className="w-5 h-5 transition-transform duration-300"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                                                                />
                                                            </svg>
                                                        </span>
                                                        {/*           <div className="absolute inset-0 bg-white/20 transform translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" /> */}
                                                    </button>
                                                </div>

                                                {/* Hover border effect */}
                                                <div className="absolute inset-0 rounded-2xl ring-2 ring-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            </div>
                                        ))}
                                    </div>
                                )
                            }
                        </div>


                        {/* <div className="flex justify-between items-center mt-3 py-3 px-5">
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
                        </div> */}
                    </div>
                </div>
            </div>

        </ProtectedRoute>
    );
}
