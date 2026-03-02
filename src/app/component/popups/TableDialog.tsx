'use client';
import React from 'react';
import PopupMenu from './PopupMenu';
import { propertyGetDataInterface } from '@/store/property.interface';
import { IoMdClose } from 'react-icons/io';
import Button from '@mui/material/Button';
import { FaPhone, FaWhatsapp } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';



interface TableDialogProps {
    title?: string;
    subTitle?: string;
    onClose?: () => void;
    data: propertyGetDataInterface[] | null;
    totalData?: number;
    isOpen?: boolean; // optional prop to control visibility
}


const TableDialog = ({
    isOpen,
    title = '',
    subTitle = 'Contact No',
    data,
    totalData,
    onClose,
}: TableDialogProps) => {
    if (!isOpen || !data) return null;
    const customerTableLoader = false;

    return (
        <PopupMenu onClose={onClose} isOpen={isOpen}>
            <div className="flex flex-col relative border border-gray-300/30 w-full h-full overflow-auto bg-white text-[var(--color-secondary-darker)]  shadow-lg p-5  gap-5">
                <div className=' flex justify-between items-center'>
                    <div>
                        <h1 className="text-2xl p-2 font-semibold text-[var(--color-secondary-darker)] tracking-wide">
                            {title} {
                                <span className="text-[var(--color-primary)] font-light  text-xl"> {subTitle}</span>
                            }
                        </h1>
                        <p className='  p-2 text-sm text-gray-500'>{data.length} customers found with Contact No : <span className=' text-[var(--color-primary)]'>{data[0]?.ContactNumber}</span></p>
                    </div>

                    <button className=" -translate-y-4 cursor-pointer text-3xl transition-all duration-300 hover:bg-[var(--color-primary)] hover:text-white rounded-md p-3" onClick={onClose}><IoMdClose /></button>
                </div>
                <div className=" max-h-[calc(100vh-150px)] overflow-y-auto custom-scrollbar pr-1 border-b border-b-gray-300">
                    <table className="table-auto relative w-full  border-separate border-spacing-0 text-sm border border-gray-200">
                        <thead className="bg-[var(--color-primary)] text-white sticky top-0 left-0 z-[5]">
                            <tr>

                                {/* ✅ SELECT ALL CHECKBOX COLUMN */}
                                {/* <th className="px-2 py-3 border border-[var(--color-secondary-dark)] text-left">

                                 <input
                                    id="selectall"
                                    type="checkbox"
                                    className=" hidden"
                                    checked={
                                        currentRows.length > 0 &&
                                        currentRows.every((r) => selectedCustomers.includes(r._id))
                                    }
                                    onChange={handleSelectAll}
                                />
                            </th> */}

                                <th className="px-2 py-3 border border-[var(--color-secondary-dark)] text-left  max-w-[50px]">S.No.</th>
                                <th className="px-4 py-3 border border-[var(--color-secondary-dark)] text-left">Campaign</th>
                                <th className="px-4 py-3 border border-[var(--color-secondary-dark)] text-left">Customer Type</th>
                                <th className="px-4 py-3 border border-[var(--color-secondary-dark)] text-left">Customer Subtype</th>
                                <th className="px-4 py-3 border border-[var(--color-secondary-dark)] text-left">Name</th>
                                <th className="px-4 py-3 border border-[var(--color-secondary-dark)] text-left">Description</th>
                                <th className="px-4 py-3 border border-[var(--color-secondary-dark)] text-left">Location</th>
                                <th className="px-4 py-3 border border-[var(--color-secondary-dark)] text-left">Sub Location</th>
                                <th className="px-4 py-3 border border-[var(--color-secondary-dark)] text-left">Contact No</th>
                                <th className="px-4 py-3 border border-[var(--color-secondary-dark)] text-left">Assign To</th>
                                <th className="px-4 py-3 border border-[var(--color-secondary-dark)] text-left">Date</th>
                                {/*  <th className="px-4 py-3 border border-[var(--color-secondary-dark)] text-left">Actions</th> */}
                            </tr>
                        </thead>

                        <tbody>
                            {customerTableLoader ?
                                <tr>
                                    <td colSpan={12} className="text-center py-4 text-gray-500">
                                        Loading customers...
                                    </td>
                                </tr> : data.length > 0 ? (
                                    data.map((item, index) => (
                                        <tr key={item._id} className="border-t hover:bg-[#f7f6f3] transition-all duration-200">

                                            {/* ✅ ROW CHECKBOX */}
                                            {/* <td className="px-2 py-3 border border-gray-200">
                                             <input
                                                type="checkbox"
                                                checked={selectedCustomers.includes(item._id)}
                                                onChange={() => handleSelectRow(item._id)}
                                            />
                                        </td> */}

                                            <td className="px-2 py-3 border border-gray-200 break-all whitespace-normal max-w-[50px]">{/* (currentTablePage - 1) * rowsPerTablePage +  */(index + 1)}</td>
                                            <td className="px-2 py-3 border border-gray-200">{item.Campaign}</td>
                                            <td className="px-2 py-3 border border-gray-200 break-all whitespace-normal w-[130px]">{item.Type}</td>
                                            <td className="px-2 py-3 border  border-gray-200 break-all whitespace-normal max-w-[120px] ">{item.SubType}</td>
                                            <td className="px-2 py-3 border border-gray-200  ">{item.Name}</td>
                                            <td
                                                className={`px-2 py-3 border border-gray-200 break-all whitespace-normal max-w-[160px] ${item.Description ? "min-w-[160px]" : ""
                                                    }`}
                                            >
                                                {item.Description}
                                            </td>
                                            <td className="px-2 py-3 border border-gray-200">{item.Location}</td>
                                            <td className="px-2 py-3 border border-gray-200">{item.SubLocation}</td>
                                            <td className="px-2 py-3 border border-gray-200 break-all text-center whitespace-normal max-w-[140px]">{(item.ContactNumber) && <>{<div className=" "

                                            >{item.ContactNumber}</div>}
                                                {/* <span className=" flex"> <Button
                                                component="a"
                                                href={`tel:${item.ContactNumber}`}
                                                sx={{
                                                    backgroundColor: "#E8F5E9",
                                                    color: "var(--color-primary)",
                                                    minWidth: "14px",
                                                    height: "24px",
                                                    borderRadius: "8px",
                                                    margin: "4px"
                                                }} ><FaPhone size={12} /></Button>
                                                <Button
                                                    sx={{
                                                        backgroundColor: "#E8F5E9",
                                                        color: "var(--color-primary)",
                                                        minWidth: "14px",
                                                        height: "24px",
                                                        borderRadius: "8px",
                                                        margin: "4px"
                                                    }}
                                                    onClick={() => {
                                                        setSelectedCustomers([item._id])
                                                        setSelectUser(item._id)
                                                        setIsMailAllOpen(true);
                                                        fetchEmailTemplates();
                                                    }}
                                                ><MdEmail size={14} /></Button>
                                                <Button
                                                    onClick={() => {
                                                        setSelectedCustomers([item._id]);
                                                        setSelectUser(item._id);
                                                        setIsWhatsappAllOpen(true);
                                                        fetchWhatsappTemplates()

                                                    }}
                                                    sx={{
                                                        backgroundColor: "#E8F5E9",
                                                        color: "var(--color-primary)",
                                                        minWidth: "14px",
                                                        height: "24px",
                                                        borderRadius: "8px",
                                                        margin: "4px"
                                                    }} ><FaWhatsapp size={14} /></Button>
                                            </span> */}
                                            </>
                                            }
                                            </td>
                                            <td className="px-2 py-3 border border-gray-200">{item.AssignTo}</td>
                                            <td className="px-2 py-3 border border-gray-200 min-w-[100px]">{item.Date}</td>

                                            {/* <td className="px-2 py-3 border border-gray-200 min-w-[90px] align-middle">
                              <div className="grid grid-cols-2 gap-3 items-center h-full">
                                <Button
                                  sx={{ backgroundColor: "#E8F5E9", color: "var(--color-primary)", minWidth: "32px", height: "32px", borderRadius: "8px", }}
                                  onClick={() => router.push(`/followups/customer/add/${item._id}`)}
                                >
                                  <MdAdd />
                                </Button>

                                <Button
                                  sx={{ backgroundColor: "#E8F5E9", color: "var(--color-primary)", minWidth: "32px", height: "32px", borderRadius: "8px", }}
                                  onClick={() => router.push(`/customer/edit/${item._id}`)}
                                >
                                  <MdEdit />
                                </Button>

                                <Button
                                  sx={{ backgroundColor: "#FDECEA", color: "#C62828", minWidth: "32px", height: "32px", borderRadius: "8px", }}
                                  onClick={() => {
                                    setIsDeleteDialogOpen(true);
                                    setDialogType("delete");
                                    setDialogData({
                                      id: item._id,
                                      customerName: item.Name,
                                      ContactNumber: item.ContactNumber,
                                    });
                                  }}
                                >
                                  <MdDelete />
                                </Button>

                                <Button
                                  sx={{
                                    backgroundColor: "#FFF0F5",
                                    color: item.isFavourite ? "#E91E63" : "#C62828",
                                    minWidth: "32px",
                                    height: "32px",
                                    borderRadius: "8px",

                                  }}
                                  onClick={() =>
                                    handleFavouriteToggle(item._id, item.Name, item.ContactNumber, item.isFavourite ?? false)
                                  }
                                >
                                  {item.isFavourite ? <MdFavorite /> : <MdFavoriteBorder />}
                                </Button>
                              </div>
                            </td> */}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={10} className="text-center py-4 text-gray-500">
                                            No data available.
                                        </td>
                                    </tr>
                                )}
                        </tbody>
                    </table>
                </div>

            </div>
        </PopupMenu>
    );
};

export default TableDialog;
