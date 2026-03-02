"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { toast, Toaster } from "react-hot-toast";
import { MdDelete, MdEdit } from "react-icons/md";
import Button from "@mui/material/Button";
import { PlusSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import {
    typesGetDataInterface,
    typesDialogDataInterface,
} from "@/store/masters/types/types.interface";
import { deleteAllTypes, deleteTypes, getTypes } from "@/store/masters/types/types";
import DeleteDialog from "@/app/component/popups/DeleteDialog";
import AddButton from "@/app/component/buttons/AddButton";
import PageHeader from "@/app/component/labels/PageHeader";
import MasterProtectedRoute from "@/app/component/MasterProtectedRoutes";
import ProtectedRoute from "../component/ProtectedRoutes";
import { foodMenuDeleteDialogDataInterface, foodMenuGetDataInterface } from "@/store/foodmenu/foodmenu.interface";
import { deleteAllFoodMenu, deleteFoodMenu, getFoodMenu } from "@/store/foodmenu/foodmenu";
import FoodMenuTable from "../phonescreens/DashboardScreens/tables/FoodMenuTable";


interface DeleteAllDialogDataInterface { }

export default function FoodMenusPage() {
    const [foodMenus, setFoodMenus] = useState<foodMenuGetDataInterface[]>([]);
    const [keyword, setKeyword] = useState("");
    const [limit, setLimit] = useState("10");
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);
    const [deleteDialogData, setDeleteDialogData] =
        useState<foodMenuDeleteDialogDataInterface | null>(null);
    const [deleteAllDialogData, setDeleteAllDialogData] =
        useState<DeleteAllDialogDataInterface | null>(null);
    const [currentTablePage, setCurrentTablePage] = useState(1);
    const [rowsPerTablePage, setRowsPerTablePage] = useState(10);
    const [selectedFoodMenus, setSelectedFoodMenus] = useState<string[]>([]);
     const [foodMenuTableLoader, setFoodMenuTableLoader] = useState(true);
    const router = useRouter();

    const fetchFoodMenus = async () => {
        const data = await getFoodMenu();
        if (data) {
            const formatted = data.map((t: foodMenuGetDataInterface) => ({
                ...t,
                Name: t.Name.charAt(0).toUpperCase() + t.Name.slice(1),
            }));
            setFoodMenus(formatted);
            setFoodMenuTableLoader(false);
        }
    };

    useEffect(() => {
        fetchFoodMenus();
    }, []);

    useEffect(() => {
        setRowsPerTablePage(Number(limit));
        setCurrentTablePage(1);
    }, [limit])

    const filteredFoodMenus = useMemo(() => {
        return foodMenus
            .filter(
                (t) =>
                    keyword === "" ||
                    t.Name.toLowerCase().includes(keyword.toLowerCase()) ||
                    t.Description.toLowerCase().includes(keyword.toLowerCase())
            )
    }, [foodMenus, keyword]);

    /* SELECT ALL HANDLER */
    const handleSelectAll = () => {
        const allIds = currentRows.map((c) => c._id);
        setSelectedFoodMenus((prev) =>
            allIds.every((id) => prev.includes(id))
                ? prev.filter((id) => !allIds.includes(id)) // unselect all
                : [...new Set([...prev, ...allIds])] // select all visible rows
        );
    };
    /* SELECT SINGLE ROW HANDLER */
    const handleSelectRow = (id: string) => {
        setSelectedFoodMenus((prev) =>
            prev.includes(id)
                ? prev.filter((cid) => cid !== id)
                : [...prev, id]
        );
    };

    const handleDelete = async (data: foodMenuDeleteDialogDataInterface | null) => {
        if (!data) return;
        const res = await deleteFoodMenu(data.id);
        if (res) {
            toast.success("Customer Type deleted successfully!");
            setIsDeleteDialogOpen(false);
            setDeleteDialogData(null);
            fetchFoodMenus();
            return;
        }
        toast.error("Failed to delete Customer Type.");
    };

    const handleEdit = (id?: string) => {
        router.push(`/foodmenu/edit/${id}`);
    };

    const handleDeleteAll = async () => {
        if (filteredFoodMenus.length === 0) return;
        const payload = {
            foodMenuIds: [...selectedFoodMenus]
        }
        const response = await deleteAllFoodMenu(payload);
        if (response) {
            toast.success(`All foodMenus deleted`);
            setIsDeleteAllDialogOpen(false);
            setDeleteAllDialogData(null);
            setSelectedFoodMenus([]);

            fetchFoodMenus();
            return;
        }
    };

    const handleClear = () => {
        setKeyword("");
        setLimit("10");
    };

    const totalTablePages = Math.ceil(filteredFoodMenus.length / rowsPerTablePage);
    const indexOfLastRow = currentTablePage * rowsPerTablePage;
    const indexOfFirstRow = indexOfLastRow - rowsPerTablePage;
    const currentRows = filteredFoodMenus.slice(indexOfFirstRow, indexOfLastRow);

    const phonetableheader = [
        {
            key: "Description", label: "Description"
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
                
                <div className=" flex justify-between items-center px-0 mt-10 mb-5 px-2">
                    <h1 className=" text-neutral-600 w-full font-extrabold  text-2xl  ">Menus</h1>
<AddButton
                          url={"/foodmenu/add"}
                          text="Add"
                          icon={<PlusSquare size={18} />}
                        />
                </div>
                
                 <FoodMenuTable
                          leads={foodMenus}
                          labelLeads={phonetableheader}
                          allLabelLeads={phoneViewAllHaders}
                          /* onAdd={(id) => addFollowup(id)} */
                          onEdit={(id) => router.push(`/foodmenu/edit/${id}`)}
                          loader={foodMenuTableLoader}
                        />
            </div>
            <div className="min-h-[calc(100vh-56px)] max-sm:hidden overflow-auto max-md:py-10">


                {/* DELETE POPUP */}
                <DeleteDialog<foodMenuDeleteDialogDataInterface>
                    isOpen={isDeleteDialogOpen}
                    title="Are you sure you want to delete this foodMenu?"
                    data={deleteDialogData}
                    onClose={() => {
                        setIsDeleteDialogOpen(false);
                        setDeleteDialogData(null);
                    }}
                    onDelete={handleDelete}
                />

                <DeleteDialog<DeleteAllDialogDataInterface>
                    isOpen={isDeleteAllDialogOpen}
                    title="Are you sure you want to delete selected foodMenus?"
                    data={deleteAllDialogData}
                    onClose={() => {
                        setIsDeleteAllDialogOpen(false);
                        setDeleteAllDialogData(null);
                    }}
                    onDelete={handleDeleteAll}
                />


                {/* Card Container */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 relative">
                    <PageHeader title="Dashboard" subtitles={["Food Menu"]} />
                    {/* Add Button */}

                    <AddButton
                        url="/foodmenu/add"
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
                                placeholder="Search menu..."
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
                                className="h-10 border  border-gray-300 rounded-md px-3 py-2  bg-white text-gray-800"
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
                                    if (filteredFoodMenus.length > 0) {
                                        if (selectedFoodMenus.length < 1) {
                                            const firstPageIds = currentRows.map((c) => c._id);
                                            setSelectedFoodMenus(firstPageIds);
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
                                                currentRows.every((r) => selectedFoodMenus.includes(r._id))
                                            }
                                            onChange={handleSelectAll}
                                        />

                                    </th>
                                    <th className="px-4 py-3 border-r border-r-[var(--color-secondary-dark)] text-left">S.No.</th>
                                    <th className="px-4 py-3 border-r border-r-[var(--color-secondary-dark)] text-left">Name</th>
                                    <th className="px-4 py-3 border-r border-r-[var(--color-secondary-dark)] text-left">Catalog</th>
                                    <th className="px-4 py-3 border-r border-r-[var(--color-secondary-dark)] text-left">Catalog Type</th>
                                    <th className="px-4 py-3 border-r border-r-[var(--color-secondary-dark)] text-left">Description</th>
                                    <th className="px-4 py-3 border-r border-r-[var(--color-secondary-dark)] text-left">Price</th>
                                    <th className="px-4 py-3 border-r border-r-[var(--color-secondary-dark)] text-left">Stock</th>

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
                                                    checked={selectedFoodMenus.includes(t._id)}
                                                    onChange={() => handleSelectRow(t._id)}
                                                />

                                            </td>
                                            <td className="px-4 py-3">
                                                {(currentTablePage - 1) * rowsPerTablePage + (i + 1)}
                                            </td>
                                            <td className="px-4 py-3 border border-gray-200">{t.Name}</td>
                                            <td className="px-4 py-3 border border-gray-200">{t.MenuCatalog}</td>
                                            <td className="px-4 py-3 border border-gray-200">{t.MenuCatalogType}</td>
                                            <td className="px-4 py-3 border border-gray-200">{t.Description}</td>
                                            <td className="px-4 py-3 border border-gray-200">{t.Price}</td>
                                            <td className="px-4 py-3 border border-gray-200">{t.Stock}</td>

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
                                                            Name: t.Name,
                                                            Stock: t.Stock,
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
                                            No FoodMenus available.
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
