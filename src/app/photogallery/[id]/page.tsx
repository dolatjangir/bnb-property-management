"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { toast, Toaster } from "react-hot-toast";
import { MdDelete, MdEdit } from "react-icons/md";
import Button from "@mui/material/Button";
import { PlusSquare } from "lucide-react";
import { useParams, useRouter } from "next/navigation";



import DeleteDialog from "@/app/component/popups/DeleteDialog";
import AddButton from "@/app/component/buttons/AddButton";
import PageHeader from "@/app/component/labels/PageHeader";
import MasterProtectedRoute from "@/app/component/MasterProtectedRoutes";
import { deletePhotoGallery, getFilteredPhotoGallery, getPhotoGallery } from "@/store/masters/photogallery/photogallery";
import { DeleteDialogDataInterface, photogalleryGetDataInterface } from "@/store/masters/photogallery/photogallery.interface";

export default function AlbumPhotoGalleryPage() {
    const { id } = useParams();
    const [photogallery, setPhotoGallery] = useState<photogalleryGetDataInterface[]>([]);
    const [keyword, setKeyword] = useState("");
    const [limit, setLimit] = useState("10");

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deleteDialogData, setDeleteDialogData] =
        useState<DeleteDialogDataInterface | null>(null);

    const [currentTablePage, setCurrentTablePage] = useState(1);
    const [rowsPerTablePage, setRowsPerTablePage] = useState(10);

    const router = useRouter();

    // ✅ Fetch photogallery
    const fetchPhotoGallery = async () => {
        const queryParams = new URLSearchParams();
        queryParams.append("albumId", id as string);
        const data = await getFilteredPhotoGallery(queryParams.toString());
        if (!data) return;
        console.log(data)
        setPhotoGallery(data.map((d: any) => ({
            ...d,
            Image: Array.isArray(d.Image) && d.Image.length > 0 ? d.Image[0] : "",
        })));
    };

    useEffect(() => {
        fetchPhotoGallery();
    }, []);

    useEffect(() => {
        setRowsPerTablePage(Number(limit));
        setCurrentTablePage(1);
    }, [limit])

    // ✅ Filter + limit logic
    const filteredPhotoGallery = useMemo(() => {
        return photogallery
            .filter(
                (s) =>
                    keyword === "" ||
                    s.Name.toLowerCase().includes(keyword.toLowerCase()) ||
                    s.Status.toLowerCase().includes(keyword.toLowerCase())
            )
    }, [photogallery, keyword]);

    // ✅ Delete
    const handleDelete = async (data: DeleteDialogDataInterface | null) => {
        if (!data) return;

        const res = await deletePhotoGallery(data.id);

        if (res) {
            toast.success("Photo Gallery deleted successfully!");
            setIsDeleteDialogOpen(false);
            setDeleteDialogData(null);
            fetchPhotoGallery();
            return;
        }
        toast.error("Failed to delete photo gallery.");
    };

    // ✅ Edit
    const handleEdit = (id: string) => {
        router.push(`/photogallery/edit/${id}`);
    };

    const handleAdd = (id: string) => {
        router.push(`/photogallery/edit/${id}`);
    };

    const handleClear = () => {
        setKeyword("");
        setLimit("10");
    };

    // ✅ Pagination
    const totalTablePages = Math.ceil(filteredPhotoGallery.length / rowsPerTablePage);
    const indexOfLastRow = currentTablePage * rowsPerTablePage;
    const indexOfFirstRow = indexOfLastRow - rowsPerTablePage;
    const currentRows = filteredPhotoGallery.slice(
        indexOfFirstRow,
        indexOfLastRow
    );

    const nexttablePage = () => {
        if (currentTablePage !== totalTablePages)
            setCurrentTablePage(currentTablePage + 1);
    };

    const prevtablePage = () => {
        if (currentTablePage !== 1)
            setCurrentTablePage(currentTablePage - 1);
    };

    return (
        <MasterProtectedRoute>
            <Toaster position="top-right" />

            <div className="min-h-[calc(100vh-56px)] overflow-auto max-md:py-10">
                {/* Header */}

                {/* Delete Dialog */}
                <DeleteDialog<DeleteDialogDataInterface>
                    isOpen={isDeleteDialogOpen}
                    title="Are you sure you want to delete this photo gallery?"
                    data={deleteDialogData}
                    onClose={() => {
                        setIsDeleteDialogOpen(false);
                        setDeleteDialogData(null);
                    }}
                    onDelete={handleDelete}
                />

                {/* Card container */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 relative">
                    <PageHeader title="Dashboard" subtitles={["Photo Gallery"]} />
                    {/* Add Button */}
                    <AddButton
                        url={`/photogallery/add/${id}`}
                        text="Add"
                        icon={<PlusSquare size={18} />}
                    />

                    {/* Filter Form */}
                    <form className="w-full flex flex-wrap gap-6 items-end mb-6 mt-16">
                        <div className="flex flex-col flex-1 min-w-[250px]">
                            <label className="text-lg font-medium text-gray-900 pl-1">
                                Keyword
                            </label>
                            <input
                                type="text"
                                placeholder="Search by Name, status..."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                className="w-full outline-none border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-800"
                            />
                        </div>

                        <div className="flex flex-col w-40">
                            <label className="text-lg font-medium text-gray-900 pl-1">
                                Limit
                            </label>
                            <select
                                value={limit}
                                onChange={(e) => setLimit(e.target.value)}
                                className="h-10 border border-gray-300 rounded-md px-3 text-gray-800"
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
                                className="px-4 py-2 text-sm hover:underline"
                            >
                                Clear Search
                            </button>
                        </div>
                    </form>

                    {/* Table */}
                    <div className="max-h-[600px] overflow-y-auto">
                        <table className="table-auto relative w-full border-separate border-spacing-0 text-sm border border-gray-200">
                            <thead className="bg-[var(--color-primary)] text-white sticky top-0 left-0 z-[5]">

                                <tr className="">
                                    <th className="px-2 py-3 border border-[var(--color-secondary-dark)] text-left   max-w-[60px]">S.No.</th>
                                    <th className="px-2 py-3 border border-[var(--color-secondary-dark)] text-center">Name</th>
                                    <th className="px-2 py-3 border border-[var(--color-secondary-dark)] text-center">Image</th>
                                    <th className="px-2 py-3 border border-[var(--color-secondary-dark)] text-center">Status</th>
                                    <th className="px-2 py-3 border border-[var(--color-secondary-dark)] text-center">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {currentRows.length > 0 ? (
                                    currentRows.map((s, i) => (
                                        <tr
                                            key={s._id}
                                            className=""
                                        >
                                       
                                            <td className="px-2 py-3 border border-gray-200 break-all whitespace-normal max-w-[60px]">{(currentTablePage - 1) * rowsPerTablePage + (i + 1)}</td>
                                            <td className="px-2 py-3 border border-gray-200 text-center">{s.Name.charAt(0).toUpperCase() + s.Name.slice(1)}</td>
                                            <td className="px-2 py-3 border border-gray-200 text-center"><img
                                                src={s.Image}
                                                alt="photo gallery"
                                                className="w-28 h-16 mx-auto rounded-md object-cover border"
                                            /></td>

                                            {/* RIGHT */}
                                            <td className="px-2 py-3 border border-gray-200 text-center">
                                                <span
                                                    className={`px-3 py-1 rounded-[2px] text-xs font-semibold ${s.Status === "Active"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                        }`}
                                                >
                                                    {s.Status}
                                                </span>
                                            </td>
                                            <td className="px-2 py-3 border border-gray-200">
                                                 <div className="flex flex-wrap justify-center gap-5 items-center h-full">
                                                <Button
                                                    sx={{
                                                        backgroundColor: "#E8F5E9",
                                                        color: "var(--color-primary)",
                                                        minWidth: "32px",
                                                        height: "32px",
                                                        borderRadius: "8px",
                                                    }}
                                                    onClick={() => handleEdit(s._id)}
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
                                                        setDeleteDialogData({ id: s._id });
                                                    }}
                                                >
                                                    <MdDelete />
                                                </Button>
                                                </div>
                                            </td>

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="text-center py-4 text-gray-500"
                                        >
                                            No photogallery found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* ✅ Pagination */}
                        <div className="flex justify-between items-center mt-3 py-3 px-5">
                            <p className="text-sm">
                                Page {currentTablePage} of {totalTablePages}
                            </p>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={prevtablePage}
                                    disabled={currentTablePage === 1}
                                    className="px-3 py-1 bg-gray-200 border rounded disabled:opacity-50"
                                >
                                    Prev
                                </button>

                                <button
                                    type="button"
                                    onClick={nexttablePage}
                                    disabled={
                                        currentTablePage === totalTablePages ||
                                        currentRows.length <= 0
                                    }
                                    className="px-3 py-1 bg-gray-200 border rounded disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MasterProtectedRoute>
    );
}
