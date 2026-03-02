"use client";

import { useEffect, useMemo, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { MdPhone, MdEmail } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
import { AiOutlineHeart } from "react-icons/ai";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { MdEdit, MdDelete, MdAdd } from "react-icons/md";

import { AiOutlineBackward, AiOutlineForward } from "react-icons/ai"
import { IoIosHeart, IoMdClose, IoMdEye } from "react-icons/io";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PopupMenu from "@/app/component/popups/PopupMenu";
import { GoArrowLeft } from "react-icons/go";
import CustomerImageSlider from "@/app/component/slides/PropertyImageSlider";
import Loader from "@/app/component/loaders/Loader";
import { Mail } from "lucide-react";
import FoodImageSlider from "@/app/component/slides/FoodImageSlider";
export interface LabelConfig {
    key: string;
    label: string;
    prefix?: string;
}

interface LeadsSectionProps<T extends Record<string, any>> {
    leads: T[];
    labelLeads: LabelConfig[];
    allLabelLeads?: LabelConfig[];
    isCustomerPage?: boolean
    onAdd?: (id: string) => void;
    onEdit?: (id: string) => void;
    onFavourite?: (lead: T) => void;
    loader?: boolean; // like desktop 
}

export default function FoodMenuTable<T extends Record<string, any>>({
    leads,
    labelLeads,
    allLabelLeads,
    onAdd,
    onEdit,
    onFavourite,
    loader,
}: LeadsSectionProps<T>) {
    const [toggleSearchDropdown, setToggleSearchDropdown] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsperpage = 10;
    const [viewAll, setViewAll] = useState(false);
    const [viewLeadData, setViewLeadData] = useState<T | null>(null);

    const totalPages = Math.ceil(leads.length / itemsperpage);
    const startIndex = (currentPage - 1) * itemsperpage;
    const paginatedLeads = leads.slice(startIndex, startIndex + itemsperpage);
    /* const [loader, setLoader] = useState(true); */
    const router = useRouter();

    const nextPage = async () => {
        // Normal client-side pagination
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
            return;
        }

        // Last page → fetch more from server (if available)

        const newTotalPages = Math.ceil((leads.length + itemsperpage) / itemsperpage);
        if (currentPage < newTotalPages) {
            setCurrentPage(prev => prev + 1);
        }

    };


    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    }

    const getDisplayedPages = () => {
        if (totalPages <= 3) return Array.from({ length: totalPages }, (_, i) => i + 1);

        if (currentPage === 1) return [1, 2, 3];
        if (currentPage === totalPages) return [totalPages - 2, totalPages - 1, totalPages];

        return [currentPage - 1, currentPage, currentPage + 1];
    };
    const pages = getDisplayedPages();
    /*    useEffect(() => {
           if (!leads || leads.length === 0) {
               setLoader(true);
           } else {
               setLoader(false);
           }
       }, [leads]) */

    const followupRedirect = () => {
        router.push('/followups/customer');
    }


    if (loader) {
        return <Loader label="Loading Properties..." />

    }
    return (
        <>
            {
                viewAll && (
                    <PopupMenu onClose={() => { setViewAll(false) }}>
                        <div className="  bg-white relative w-full h-full   flex flex-col">
                            <button className=" absolute top-3 left-3 cursor-pointer z-[2000] bg-gray-100/90 rounded-full p-1 self-end mb-1 " onClick={() => {
                                setViewAll(false)
                                setViewLeadData(null)
                            }}><GoArrowLeft size={26} /></button>

                            <div className=" relative">

                                <FoodImageSlider
                                    images={
                                        viewLeadData?.FoodMenuImage?.length
                                            ? viewLeadData.FoodMenuImage
                                            : ["/siteplan2.png"]
                                    }
                                />
                                <div className="absolute top-2 right-2 [clip-path:polygon(100%_100%,_50%_75%,_0_100%,_0_0,_0_0,_100%_0)] bg-linear-to-br from-white via-yellow-300 to-yellow-500 h-[50px] w-[45px]">
                                <div className=" flex flex-col mt-1 w-full tracking-[1.2px] justify-center font-bold items-center text-amber-950 text-xs">
                                    <span>Best</span>
                                    <span>Deal</span>
                                </div>
                            </div>
                                <div className=" absolute bottom-0 pb-[50px] flex flex-col justify-end h-1/2   w-full left-0 bg-linear-to-t from-black/90 via-black/70 to-transparent"
                                >
                                    {allLabelLeads?.map((item, j) => (<div key={j}>
                                        {item.label === "Name" && (
                                            <h3 className=" text-white px-3  text-lg font-semibold mb-2  flex items-center gap-2">
                                                <p className=" line-clamp-2">
                                                    {viewLeadData?.[item.key]}
                                                </p>
                                                <AiOutlineHeart size={18} className="text-white mt-[1px] cursor-pointer" />
                                            </h3>
                                        )}
                                        {item.label === "Description" && (
                                            <h3 className=" text-gray-200 px-3  text-xs mb-2  flex items-center gap-2">
                                                <p className=" line-clamp-2">
                                                    {viewLeadData?.[item.key]}
                                                </p>

                                            </h3>
                                        )}
                                    </div>))}


                                </div>
                            </div>


                            <div className="max-h-[calc(80vh-240px)] absolute top-[380px] w-full bg-white overflow-y-auto px-4 py-6 rounded-t-3xl ">
                                {/* <h2 className="text-2xl font-bold text-center mb-6 text-[var(--color-secondary-darker)]">
                                    Property Information
                                </h2> */}
                                <div className="space-y-3">
                                    {allLabelLeads?.map((item, j) => (
                                       (item.label!=="Name" && item.label!=="Description")&&<div
                                            key={j}
                                            className={`flex ${viewLeadData?.[item.key]?.length > 15 && "flex-col gap-2"} justify-between p-3 bg-gray-50 rounded-lg`}
                                        >
                                            <span className="font-semibold text-gray-700 text-sm">
                                                {item.label}
                                            </span>

                                            {item.label === "Contact No" ? (
                                                <a
                                                    href={`tel:+91${viewLeadData?.[item.key] ?? ""}`}
                                                    className="text-[var(--color-primary)] font-medium hover:underline text-sm"
                                                >
                                                    {viewLeadData?.[item.key] ?? ""}
                                                </a>
                                            ) : (
                                                <span className={`text-gray-900 font-medium text-right max-w-[60%] text-sm ${viewLeadData?.[item.key]?.length > 15 && "flex-col gap-2 max-w-full"} `}>
                                                    <p className="text-left">
                                                        {item.prefix && viewLeadData?.[item.key]
                                                            ? `${item.prefix}${viewLeadData[item.key]}`
                                                            : viewLeadData?.[item.key] ?? ""}
                                                    </p>

                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className=" px-5 text-center mt-10">
                                <button className="  w-full border border-[var(--color-primary)] rounded-md text-[var(--color-primary)] px-2 py-1"
                                 onClick={() => onEdit?.(viewLeadData?._id)}
                                >Edit Details</button>
                                </div>
                            </div>
                        </div>
                    </PopupMenu>
                )
            }
            {/* LEAD CARDS */}
            <div className="px-0 pb-4">

                {paginatedLeads.length === 0 && (
                    <div className="w-full flex justify-center items-center py-10 text-lg text-gray-500">
                        No menu available
                    </div>
                )}
                {paginatedLeads.map((lead, index) => (
                    <div
                        key={index}
                        className="w-full bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden mb-4"
                    >
                        {/* Image Section with Badges */}
                        <div className="relative w-full h-[320px] bg-gray-200">
                            <img
                                className="w-full h-full object-cover cursor-pointer"
                                src={lead.FoodMenuImage?.length > 0 ? lead.FoodMenuImage[0] : "/siteplan2.png"}
                                alt="Property"

                            />

                            {/* Campaign Badge - Top Left */}
                            {lead.Campaign && (
                                <div className="absolute top-3 left-3">
                                    <span className="bg-[var(--color-primary)] text-white text-xs font-semibold px-4 py-1.5 rounded">
                                        {lead.Campaign.toUpperCase()}
                                    </span>
                                </div>
                            )}

                            {/* Action Buttons - Top Right */}
                            <div className="absolute top-2 left-2 [clip-path:polygon(100%_100%,_50%_75%,_0_100%,_0_0,_0_0,_100%_0)] bg-linear-to-br from-white via-yellow-300 to-yellow-500 h-[50px] w-[45px]">
                                <div className=" flex flex-col mt-1 w-full tracking-[1.2px] justify-center font-bold items-center text-amber-950 text-xs">
                                    <span>Best</span>
                                    <span>Deal</span>
                                </div>
                            </div>

                            <div className="absolute top-3 right-3 flex gap-2">
                                {/*  <button
                                    onClick={() => onFavourite?.(lead)}
                                    className="p-2 text-white/90 bg-black/10 backdrop-blur-sm rounded  transition-all"
                                >
                                    {lead.isFavourite ?
                                        <IoIosHeart size={18} className="text-red-500" /> :
                                        <AiOutlineHeart size={18} className="text-white/90" />
                                    }
                                </button> */}
                                <button
                                    onClick={() => {
                                        setViewAll(true);
                                        setViewLeadData(lead);
                                    }}
                                    className="p-2 text-white/90 bg-black/10 backdrop-blur-sm rounded transition-all"
                                >
                                    <IoMdEye size={18} className="" />
                                </button>
                                <button
                                    onClick={() => onEdit?.(lead._id)}
                                    className="p-2 text-white/90 bg-black/10 backdrop-blur-sm rounded transition-all"
                                >
                                    <MdEdit size={18} className="" />
                                </button>
                            </div>



                            <div className=" absolute bottom-0 flex flex-col justify-end h-1/2   w-full left-0 bg-linear-to-t from-black/90 via-black/70 to-transparent">
                                {lead.Name && (
                                    <h3 className=" text-white px-3  text-lg font-semibold mb-2  flex items-center gap-2">
                                        <p className=" line-clamp-2">
                                            {String(lead.Name).charAt(0).toUpperCase() + String(lead.Name).slice(1, 30)}
                                        </p>
                                        <AiOutlineHeart size={18} className="text-white mt-[1px] cursor-pointer" onClick={() => onFavourite?.(lead)} />
                                    </h3>
                                )}
                                {lead.Description && (
                                    <h3 className=" text-gray-200 px-3  text-xs mb-2  flex items-center gap-2">
                                        <p className=" line-clamp-2">
                                            {String(lead.Description).charAt(0).toUpperCase() + String(lead.Description).slice(1)}
                                        </p>

                                    </h3>
                                )}
                                <div className=" bg-linear-to-t  from-black/80 to-transparent py-2 ">
                                    <div className=" border-t border-t-gray-400 py-1 px-3">
                                        <div className=" flex flex-col">
                                            {(lead.Price || lead.Budget) && (
                                                <div className="">
                                                    <span className=" text-white text-lg font-bold  py-1.5 rounded">
                                                        ₹{lead.Price || lead.Budget}
                                                    </span>
                                                </div>
                                            )}
                                            <div className=" flex items-center gap-1 px-1.5 text-gray-300 font-extralight text-xs">
                                                {(lead.MenuCatalog || lead.Budget) && (
                                                    <span className=" text-xs   rounded">
                                                        {lead.MenuCatalog || lead.Budget}
                                                    </span>
                                                )}
                                                {(lead.MenuCatalogType || lead.Budget) && (
                                                    <>
                                                        <span >|</span>
                                                        <span className=" text-xs   rounded">
                                                            {lead.MenuCatalogType || lead.Budget}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>


                            </div>
                        </div>

                        {/* Content Section */}



                    </div>
                ))}
                {/* animated button */}
                {paginatedLeads.length > 0 && (
                    <div className="flex items-center justify-center w-full">
                        <div className="flex items-center space-x-2 p-2  rounded-lg">
                            <button onClick={() => setCurrentPage(1)} className=" h-[30px] w-[30px] bg-white rounded-full text-sm grid place-items-center"><AiOutlineBackward /> </button>
                            <button onClick={prevPage}
                                disabled={currentPage === 1}
                                className={`h-[30px] w-[30px] bg-white rounded-full text-sm grid place-items-center ${currentPage === 1 ? "bg-gray-200 opacity-50 cursor-not-allowed" : "bg-white "}`}><GrFormPrevious /></button>
                            <AnimatePresence mode="popLayout">
                                {pages.map((num, i) => (
                                    <motion.button
                                        key={i}
                                        onClick={() => setCurrentPage(num)}
                                        className={`h-[30px] w-[30px]  rounded-full text-sm grid place-items-center  ${num === currentPage ? " bg-[var(--color-primary)] text-white w-[35px] h-[35px]" : "bg-white text-black w-[30px] h-[30px]"
                                            }`}>
                                        {num}
                                    </motion.button>
                                ))}
                            </AnimatePresence>

                            <button
                                onClick={nextPage}
                                disabled={currentPage === totalPages}
                                className={`h-[30px] w-[30px] bg-white rounded-full text-sm grid place-items-center ${currentPage === totalPages ? "bg-gray-200 opacity-50 cursor-not-allowed" : "bg-white"
                                    }`}
                            >
                                <GrFormNext />
                            </button>

                            <button onClick={() => setCurrentPage(totalPages)} className=" h-[30px] w-[30px] bg-white rounded-full text-sm grid place-items-center"><AiOutlineForward /> </button>
                        </div>
                    </div>)}
            </div>
            {/* <div>
        <button onClick={prevPage} 
        disabled = {currentPage === 1}
          className={`px-2 py-2 rounded-full border
      ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-[var(--color-primary)] text-white"}
    `}>prev</button>
     <button onClick={nextPage} 
        disabled = {currentPage === totalPages}
          className={`px-4 py-2 rounded-xl border
      ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-[var(--color-primary)] text-white"}
    `}>next</button>
      </div> */}

        </>
    );
}
