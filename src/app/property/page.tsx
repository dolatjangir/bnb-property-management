'use client'
import { useEffect, useMemo, useRef, useState } from "react";
import { CiExport, CiSearch } from "react-icons/ci";
import { IoIosArrowUp, IoIosArrowDown, IoMdClose } from "react-icons/io";
import { MdEdit, MdDelete, MdAdd, MdFavorite, MdFavoriteBorder, MdEmail } from "react-icons/md";
import Button from '@mui/material/Button';
import SingleSelect from "@/app/component/SingleSelect";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowDown, ArrowUp, ChevronsLeft, ChevronsRight, PlusSquare, Building2, Filter, ChevronDown, ChevronUp } from "lucide-react";
import ProtectedRoute from "../component/ProtectedRoutes";
import toast, { Toaster } from "react-hot-toast";
import { getProperty, deleteProperty, getFilteredProperty, updateProperty, assignProperty, deleteAllProperty } from "@/store/property";
import { CheckDialogDataInterface, PropertyAdvInterface, propertyAssignInterface, propertyGetDataInterface, DeleteDialogDataInterface } from "@/store/property.interface";
import DeleteDialog from "../component/popups/DeleteDialog";
import { getCampaign } from "@/store/masters/campaign/campaign";
import { getTypes, getTypesByCampaign } from "@/store/masters/types/types";
import { getCity } from "@/store/masters/city/city";
import { getLocation, getLocationByCity } from "@/store/masters/location/location";
import { handleFieldOptions } from "../utils/handleFieldOptions";
import PopupMenu from "../component/popups/PopupMenu";
import { getAllAdmins } from "@/store/auth";
import { usersGetDataInterface } from "@/store/auth.interface";
import { getSubtype, getSubtypeByCampaignAndType } from "@/store/masters/subtype/subtype";
import { mailAllPropertyInterface, mailGetDataInterface } from "@/store/masters/mail/mail.interface";
import { whatsappAllPropertyInterface, whatsappGetDataInterface } from "@/store/masters/whatsapp/whatsapp.interface";
import { emailAllProperty, getMail } from "@/store/masters/mail/mail";
import { getWhatsapp, whatsappAllProperty } from "@/store/masters/whatsapp/whatsapp";
import FavouriteDialog from "../component/popups/FavouriteDialog";
import AddButton from "../component/buttons/AddButton";
import PageHeader from "../component/labels/PageHeader";
import ListPopup from "../component/popups/ListPopup";
import LoaderCircle from "../component/LoaderCircle";
import useHorizontalScroll from "@/hooks/useHorizontalScroll";
import { Description } from "@radix-ui/react-dialog";
import LeadsSection from "../phonescreens/DashboardScreens/LeadsSection";
import DynamicAdvance from "../phonescreens/DashboardScreens/DynamicAdvance";
import { handleFieldOptionsObject } from "../utils/handleFieldOptionsObject";
import ObjectSelect from "../component/ObjectSelect";
import { FaCaretDown, FaCaretUp, FaCheck, FaCheckDouble, FaEye, FaPhone, FaWhatsapp } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { exportToExcel } from "../utils/exportToExcel";
import { getsubLocationByCityLoc } from "@/store/masters/sublocation/sublocation";
import { Sub } from "@radix-ui/react-dropdown-menu";
import { formatDateDMY } from "../utils/formatDateDMY";
import TableDialog from "../component/popups/TableDialog";
import { IoCheckmark, IoCheckmarkDoneOutline } from "react-icons/io5";
import DateSelector from "../component/DateSelector";
import BounceLoader from "react-spinners/BounceLoader";
import SyncLoader from "react-spinners/SyncLoader";
import BeatLoader from "react-spinners/BeatLoader";
import HashLoader from "react-spinners/HashLoader";
import { getReferences } from "@/store/masters/references/references";
import { getPrice } from "@/store/masters/price/price";
import PropertyTable from "../phonescreens/DashboardScreens/tables/PropertyTable";
import { usePropertyFieldLabel } from "@/context/property/PropertyFieldLabelContext";

interface DeleteAllDialogDataInterface {}

export default function Property() {
  // ── All original state & logic UNCHANGED ──────────────────────────
  const router = useRouter();
  const hasInitialFetched = useRef(false);
  const { getLabel } = usePropertyFieldLabel();
  const FETCH_CHUNK = 100;
  const [keywordInput, setKeywordInput] = useState("");
  const [fetchedCount, setFetchedCount] = useState(0);
  const [hasMorePropertys, setHasMorePropertys] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [totalPropertys, setTotalPropertys] = useState(0);
  const [totalPropertyPage, setTotalPropertyPage] = useState(1);
  const [isFilteredTrigger, setIsFilteredTrigger] = useState(false);
  const lastAppliedFiltersRef = useRef<typeof filters | null>(null);
  const [selectedPropertys, setSelectedPropertys] = useState<string[]>([]);
  const [selectedUser, setSelectUser] = useState<string>();
  const [selectedWhatsapptemplate, setSelectedWhatsapptemplate] = useState<string>();
  const [selectedMailtemplate, setSelectedMailtemplate] = useState<string>();
  const [users, setUsers] = useState<usersGetDataInterface[]>([]);
  const [mailTemplates, setMailtemplates] = useState<mailGetDataInterface[]>([]);
  const [whatsappTemplates, setWhatsappTemplates] = useState<whatsappGetDataInterface[]>([]);
  const [toggleSearchDropdown, setToggleSearchDropdown] = useState(false);
  const [currentTablePage, setCurrentTablePage] = useState(1);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isMailAllOpen, setIsMailAllOpen] = useState(false);
  const [isWhatsappAllOpen, setIsWhatsappAllOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);
  const [isFavouriteDialogOpen, setIsFavouriteDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState<DeleteDialogDataInterface | null>(null);
  const [dialogType, setDialogType] = useState<"delete" | "favourite" | null>(null);
  const [fieldOptions, setFieldOptions] = useState<Record<string, any[]>>({});
  const [isFavrouteProperty, setIsFavrouteProperty] = useState<boolean>(false);
  const [propertyTableLoader, setPropertyTableLoader] = useState(true);
  const [deleteAllDialogData, setDeleteAllDialogData] = useState<DeleteAllDialogDataInterface | null>(null);
  const [isTableDialogOpen, setIsTableDialogOpen] = useState(false);
  const [tableDialogpropertyData, setTableDialogPropertyData] = useState<propertyGetDataInterface[]>([]);
  const scrollRef = useHorizontalScroll();
  const searchParams = useSearchParams();
  const { admin } = useAuth();
  const [rowsPerTablePage, setRowsPerTablePage] = useState(100);
  const SEARCH_FIELDS = ["Description","Campaign","PropertyType","PropertySubType","City","Location","SubLocation","Price","ReferenceId"] as const;
  const [toggleAiGenieSearchBy, setToggleAiGenieSearchBy] = useState(false);
  const [filters, setFilters] = useState({ StatusAssign: [] as string[], Campaign: [] as string[], PropertyType: [] as string[], PropertySubType: [] as string[], City: [] as string[], Location: [] as string[], SubLocation: [] as string[], User: [] as string[], Keyword: "" as string, SearchIn: [] as string[], ReferenceId: [] as string[], Price: [] as string[], Limit: ["100"] as string[], StartDate: [] as string[], EndDate: [] as string[] });
  const [dependent, setDependent] = useState({ Campaign: { id: "", name: "" }, PropertyType: { id: "", name: "" }, PropertySubType: { id: "", name: "" }, City: { id: "", name: "" }, Location: { id: "", name: "" }, SubLocation: { id: "", name: "" } });
  const [propertyData, setPropertyData] = useState<propertyGetDataInterface[]>([]);
  const [propertyAdv, setPropertyAdv] = useState<PropertyAdvInterface[]>([]);
  const [exportingPropertyData, setExportingPropertyData] = useState<propertyGetDataInterface[]>([]);
  const [duplicateContacts, setDuplicateContacts] = useState<Record<string, boolean>>({});
  const STEPS = { SEARCH: "Searching Property Data", SHOW: "Showing Result", FOUND: (count: number) => `${count} Propertys Found` } as const;
  const [currentStep, setCurrentStep] = useState<string>("");
  const [fade, setFade] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const changeStep = async (text: string) => { setFade(true); await new Promise(r => setTimeout(r, 2000)); setCurrentStep(text); setFade(false); };
  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {
    const status = searchParams.get("Campaign");
    if (!fieldOptions?.Campaign?.length) return;
    if (status) {
      const campaignObj = fieldOptions?.Campaign?.find((c) => c.Name === status);
      setFilters((prev) => ({ ...prev, StatusAssign: [status] }));
      setDependent((prev) => ({ ...prev, Campaign: { id: campaignObj?._id, name: campaignObj?.Name } }));
      const updatedFilters = { ...filters, Campaign: [status] };
      setPropertyTableLoader(false);
      handleSelectChange("Campaign", status, updatedFilters);
    } else { getPropertys(); fetchFields(); }
    getTotalPropertyPage();
  }, [searchParams, fieldOptions.Campaign]);

  useEffect(() => { const datatoExport = propertyData.filter((property) => selectedPropertys.includes(property._id)); setExportingPropertyData(datatoExport); }, [selectedPropertys]);
  const getTotalPropertyPage = async () => { const data = await getProperty(); const total = Math.ceil(data.length / Number(filters.Limit[0])) || 1; setTotalPropertyPage(total); setTotalPropertys(data.length); };
  useEffect(() => { const total = Math.ceil(totalPropertys / Number(filters.Limit[0])) || 1; setTotalPropertyPage(total); }, [filters, totalPropertys]);
  function getPlainTextFromHTML(htmlString: string) { const parser = new DOMParser(); const doc = parser.parseFromString(htmlString, "text/html"); return doc.body.textContent || ""; }

  const getPropertys = async () => {
    setPropertyTableLoader(true); setFetchedCount(0); setHasMorePropertys(true);
    const queryParams = new URLSearchParams();
    queryParams.append("Limit", FETCH_CHUNK.toString()); queryParams.append("Skip", "0");
    const data = await getFilteredProperty(queryParams.toString());
    if (data) { const mapped = data.map(mapProperty); setPropertyData(mapped); setFetchedCount(mapped.length); setHasMorePropertys(mapped.length === FETCH_CHUNK); }
    setPropertyTableLoader(false);
  };

  const mapProperty = (item: any) => {
    const date = new Date(item.createdAt);
    const formattedDate = date.getDate().toString().padStart(2, "0") + "-" + (date.getMonth() + 1).toString().padStart(2, "0") + "-" + date.getFullYear();
    return { _id: item._id, Campaign: item.Campaign, Type: item.PropertyType, SubType: item.PropertySubType, Name: item.propertyName, Description: item.Description, Email: item.Email, City: item.City, Location: item.Location, SubLocation: item.SubLocation, ContactNumber: item.ContactNumber?.slice(0, 10), ReferenceId: item.ReferenceId, AssignTo: item.AssignTo?.name, isFavourite: item.isFavourite, isChecked: item.isChecked, Date: item.PropertyDate ? formatDateDMY(item.PropertyDate) : formattedDate, PropertyImage: item.PropertyImage || "", SitePlan: item.SitePlan || "" };
  };

  const fetchMore = async () => {
    if (isFetchingMore || !hasMorePropertys) return;
    setIsFetchingMore(true); setPropertyTableLoader(true);
    const queryParams = new URLSearchParams();
    queryParams.append("Limit", FETCH_CHUNK.toString()); queryParams.append("Skip", propertyData.length.toString());
    Object.entries(filters).forEach(([key, value]) => { if (key === "Limit") return; if (Array.isArray(value)) value.forEach(v => queryParams.append(key, v)); if (typeof value === "string" && value) queryParams.append(key, value); });
    const data = await getFilteredProperty(queryParams.toString());
    if (data) { const mapped = data.map(mapProperty); setPropertyData(prev => [...prev, ...mapped]); setFetchedCount(prev => prev + mapped.length); setHasMorePropertys(mapped.length === FETCH_CHUNK); }
    setPropertyTableLoader(false); setIsFetchingMore(false);
  };

  const handleLastPage = async () => {
    setPropertyTableLoader(true);
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => { if (key === "Limit") return; if (Array.isArray(value)) value.forEach(v => queryParams.append(key, v)); if (typeof value === "string" && value) queryParams.append(key, value); });
    queryParams.delete("Limit"); queryParams.delete("Skip");
    const data = await getFilteredProperty(queryParams.toString());
    if (data) { const mapped = data.map(mapProperty); setPropertyData(mapped); setFetchedCount(mapped.length); setHasMorePropertys(false); setTotalPropertys(mapped.length); const finalTotalPages = Math.ceil(mapped.length / rowsPerTablePage) || 1; setCurrentTablePage(finalTotalPages); }
    setPropertyTableLoader(false);
  };

  const handleDelete = async (data: DeleteDialogDataInterface | null) => {
    if (!data) return;
    const response = await deleteProperty(data.id);
    if (response) { toast.success(`Property deleted successfully`); setIsDeleteDialogOpen(false); setDialogData(null); if (isFilteredTrigger) { await refreshPropertysWithLastFilters(); return; } await getPropertys(); }
  };

  const handleFavourite = async (data: DeleteDialogDataInterface | null) => {
    if (!data) return;
    const formData = new FormData();
    const current = propertyData.find(c => c._id === data.id);
    const newFav = !current?.isFavourite;
    formData.append("isFavourite", newFav.toString());
    const res = await updateProperty(data.id, formData);
    if (res) { toast.success("Favourite updated successfully"); setIsFavouriteDialogOpen(false); setDialogData(null); await getPropertys(); } else { toast.error("Failed to update favourite"); }
  };

  const handleChecked = async (data: CheckDialogDataInterface | null) => {
    if (!data) return;
    console.log("data is ", data);
    const formData = new FormData();
    const current = propertyData.find(c => c._id === data.id);
    const newChecked = !current?.isChecked;
    console.log(" yes ", current?.isChecked);
    formData.append("isChecked", newChecked.toString());
    const res = await updateProperty(data.id, formData);
    if (res) { setPropertyData(prev => prev.map(property => property._id === data.id ? { ...property, isChecked: newChecked } : property)); } else { toast.error("Failed to check property"); }
  };

  const handleFavouriteToggle = (id: string, name: string, number: string, isFavourite: boolean) => { setDialogType("favourite"); setIsFavouriteDialogOpen(true); setDialogData({ id, propertyName: name, ContactNumber: number }); setIsFavrouteProperty(isFavourite); };

  const filterByDate = async () => {
    if (!filters.StartDate[0] || !filters.EndDate[0]) return;
    const updatedFilters = { ...filters };
    lastAppliedFiltersRef.current = updatedFilters; setIsFilteredTrigger(true);
    const queryParams = new URLSearchParams();
    queryParams.append("StartDate", filters.StartDate[0]); queryParams.append("EndDate", filters.EndDate[0]);
    const data = await getFilteredProperty(queryParams.toString());
    const totalQueryParams = new URLSearchParams(queryParams);
    if (data) { const mapped = data.map(mapProperty); setPropertyData(mapped); setFetchedCount(mapped.length); setHasMorePropertys(mapped.length === FETCH_CHUNK); setCurrentTablePage(1); }
    const totalfilteredData = await getFilteredProperty(totalQueryParams.toString());
    if (totalfilteredData) setTotalPropertys(totalfilteredData.length);
    setPropertyTableLoader(false);
  };

  const handleSelectChange = async (field: keyof typeof filters, selected: string | string[], filtersOverride?: typeof filters) => {
    setPropertyTableLoader(true);
    const updatedFilters = filtersOverride || { ...filters, [field]: Array.isArray(selected) ? selected : selected ? [selected] : [] };
    setFilters(updatedFilters); lastAppliedFiltersRef.current = updatedFilters; setIsFilteredTrigger(true);
    const hasBothDates = updatedFilters.StartDate?.length > 0 && updatedFilters.EndDate?.length > 0;
    const queryParams = new URLSearchParams();
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (key === "Limit") return;
      if ((key === "StartDate" || key === "EndDate") && !hasBothDates) return;
      if (Array.isArray(value) && value.length > 0) value.forEach((v) => queryParams.append(key, v));
      else if (typeof value === "string" && value) queryParams.append(key, value);
    });
    if (!hasBothDates) { queryParams.append("Limit", FETCH_CHUNK.toString()); queryParams.append("Skip", "0"); }
    const data = await getFilteredProperty(queryParams.toString());
    const totalQueryParams = new URLSearchParams(queryParams);
    totalQueryParams.delete("Limit"); totalQueryParams.delete("Skip");
    if (data) { const mapped = data.map(mapProperty); setPropertyData(mapped); setFetchedCount(mapped.length); setHasMorePropertys(mapped.length === FETCH_CHUNK); setCurrentTablePage(1); }
    const totalfilteredData = await getFilteredProperty(totalQueryParams.toString());
    if (totalfilteredData) { setTotalPropertys(totalfilteredData.length); if (field === "Keyword") await changeStep(STEPS.FOUND(totalfilteredData.length)); }
    setPropertyTableLoader(false);
    console.log(" filter date length ", data.length);
    return data;
  };

  const clearFilter = async () => {
    setFilters({ StatusAssign: [], Campaign: [], PropertyType: [], PropertySubType: [], City: [], Location: [], SubLocation: [], User: [], Keyword: "", SearchIn: [], ReferenceId: [], Price: [], Limit: ["100"], StartDate: [], EndDate: [] });
    setDependent({ Campaign: { id: "", name: "" }, PropertyType: { id: "", name: "" }, PropertySubType: { id: "", name: "" }, City: { id: "", name: "" }, Location: { id: "", name: "" }, SubLocation: { id: "", name: "" } });
    setCurrentStep(""); setAiLoading(false); setIsFilteredTrigger(false); await getPropertys();
  };

  const refreshPropertysWithLastFilters = async () => {
    const appliedFilters = lastAppliedFiltersRef.current;
    if (!appliedFilters) return;
    setPropertyTableLoader(true);
    const queryParams = new URLSearchParams();
    Object.entries(appliedFilters).forEach(([key, value]) => { if (key === "Limit") return; if (Array.isArray(value) && value.length > 0) value.forEach((v) => queryParams.append(key, v)); else if (typeof value === "string" && value) queryParams.append(key, value); });
    queryParams.append("Limit", FETCH_CHUNK.toString()); queryParams.append("Skip", "0");
    const data = await getFilteredProperty(queryParams.toString());
    if (data) { const mapped = data.map(mapProperty); setPropertyData(mapped); setFetchedCount(mapped.length); setHasMorePropertys(mapped.length === FETCH_CHUNK); setCurrentTablePage(1); }
    setPropertyTableLoader(false);
  };

  const totalTablePages = useMemo(() => Math.ceil(propertyData.length / rowsPerTablePage) || 1, [propertyData, rowsPerTablePage]);
  const startIndex = (currentTablePage - 1) * rowsPerTablePage;
  const currentRows = propertyData.slice(startIndex, startIndex + rowsPerTablePage);

  useEffect(() => { const safeLimit = Number(filters.Limit?.[0]); setRowsPerTablePage(safeLimit); setCurrentTablePage(1); }, [filters.Limit]);

  const nexttablePage = () => { if (currentTablePage !== totalTablePages) setCurrentTablePage(currentTablePage + 1); };
  const prevtablePage = () => { if (currentTablePage !== 1) setCurrentTablePage(currentTablePage - 1); };
  const [filterOptions, setFilterOptions] = useState({ StatusAssign: [] as string[], Campaign: [], PropertyType: [], PropertySubtype: [], City: [], Location: [], User: [] as string[] });

  const fetchUsers = async () => { const response = await getAllAdmins(); if (response) { console.log("response ", response); const admins = response?.admins?.filter((e) => e.role === "user" || e.role === "city_admin") ?? []; setUsers(admins.map((item: any): usersGetDataInterface => ({ _id: item?._id ?? "", name: item?.name ?? "" }))); return; } };
  const fetchEmailTemplates = async () => { const response = await getMail(); if (response) { console.log("response ", response); const mailtemplates = response?.filter((e: any) => e.status === "Active") ?? []; console.log(" mail data ", response); setMailtemplates(mailtemplates.map((item: any): mailGetDataInterface => ({ _id: item?._id ?? "", name: item?.name ?? "", body: getPlainTextFromHTML(item?.body) ?? "" }))); return; } };
  const fetchWhatsappTemplates = async () => { const response = await getWhatsapp(); if (response) { console.log("response ", response); const whatsapptemplates = response?.filter((e: any) => e.status === "Active") ?? []; console.log(" mail data ", response); setWhatsappTemplates(whatsapptemplates.map((item: any): whatsappGetDataInterface => ({ _id: item?._id ?? "", name: item?.name ?? "", body: item?.body ?? "" }))); return; } };

  const handleDeleteAll = async () => {
    if (propertyData.length === 0) return;
    const payload = { propertyIds: [...selectedPropertys] };
    const response = await deleteAllProperty(payload);
    if (response) { toast.success(`All contacts deleted`); setIsDeleteAllDialogOpen(false); setDeleteAllDialogData(null); setSelectedPropertys([]); if (isFilteredTrigger) { await refreshPropertysWithLastFilters(); return; } getPropertys(); }
  };

  const fetchFields = async () => {};
  const objectFields = [{ key: "Campaign", fetchFn: getCampaign }, { key: "PropertyType", staticData: [] }, { key: "PropertySubtype", staticData: [] }, { key: "City", fetchFn: getCity }, { key: "Location", staticData: [] }, { key: "SubLocation", staticData: [] }];
  const arrayFields = [{ key: "StatusAssign", staticData: ["Assigned", "Unassigned"] }, { key: "User", fetchFn: getAllAdmins }, { key: "ReferenceId", fetchFn: getReferences }, { key: "Price", fetchFn: getPrice }];

  useEffect(() => { const loadFieldOptions = async () => { await handleFieldOptionsObject(objectFields, setFieldOptions); await handleFieldOptions(arrayFields, setFieldOptions); }; loadFieldOptions(); }, []);

  useEffect(() => {
    const campaignId = dependent.Campaign.id; const propertyTypeId = dependent.PropertyType.id; const cityId = dependent.City.id; const locationId = dependent.Location.id;
    if (campaignId) { fetchPropertyType(campaignId); } else { setFieldOptions(prev => ({ ...prev, PropertyType: [] })); setFilters(prev => ({ ...prev, PropertyType: [], PropertySubType: [] })); }
    if (campaignId && propertyTypeId) { fetchPropertySubType(campaignId, propertyTypeId); } else { setFieldOptions(prev => ({ ...prev, PropertySubType: [] })); setFilters(prev => ({ ...prev, PropertySubType: [] })); }
    if (cityId) { fetchLocation(cityId); } else { setFieldOptions(prev => ({ ...prev, Location: [] })); setFilters(prev => ({ ...prev, Location: [] })); }
    if (cityId && locationId) { fetchSubLocation(cityId, locationId); } else { setFieldOptions(prev => ({ ...prev, SubLocation: [] })); setFilters(prev => ({ ...prev, SubLocation: [] })); }
  }, [dependent.Campaign.id, dependent.PropertyType.id, dependent.City.id, dependent.Location.id]);

  const fetchPropertyType = async (campaignId: string) => { try { const res = await getTypesByCampaign(campaignId); setFieldOptions((prev) => ({ ...prev, PropertyType: res || [] })); } catch (error) { console.error("Error fetching types:", error); setFieldOptions((prev) => ({ ...prev, PropertyType: [] })); } };
  const fetchLocation = async (cityId: string) => { try { const res = await getLocationByCity(cityId); setFieldOptions((prev) => ({ ...prev, Location: res || [] })); } catch (error) { console.error("Error fetching location:", error); setFieldOptions((prev) => ({ ...prev, Location: [] })); } };
  const fetchSubLocation = async (cityId: string, locationId: string) => { try { const res = await getsubLocationByCityLoc(cityId, locationId); setFieldOptions((prev) => ({ ...prev, SubLocation: res || [] })); } catch (error) { console.error("Error fetching sublocation:", error); setFieldOptions((prev) => ({ ...prev, SubLocation: [] })); } };
  const fetchPropertySubType = async (campaignId: string, propertytypeId: string) => { try { const res = await getSubtypeByCampaignAndType(campaignId, propertytypeId); setFieldOptions((prev) => ({ ...prev, PropertySubtype: res || [] })); } catch (error) { console.error("Error fetching types:", error); setFieldOptions((prev) => ({ ...prev, PropertySubtype: [] })); } };

  const handleSelectAll = () => { const allIds = currentRows.map((c) => c._id); setSelectedPropertys((prev) => allIds.every((id) => prev.includes(id)) ? prev.filter((id) => !allIds.includes(id)) : [...new Set([...prev, ...allIds])]); };
  const handleSelectRow = (id: string) => { setSelectedPropertys((prev) => prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]); };
  const handleSelectUser = (id: string) => { setSelectUser(prev => (prev === id ? undefined : id)); };
  const handleSelectMailtemplate = (id: string) => { setSelectedMailtemplate(prev => (prev === id ? undefined : id)); };
  const handleSelectWhatsapptemplate = (id: string) => { setSelectedWhatsapptemplate(prev => (prev === id ? undefined : id)); };

  const handleAssignto = async () => {
    if (!selectedUser) { toast.error("Please select a user"); return; }
    const payload: propertyAssignInterface = { propertyIds: selectedPropertys, assignToId: selectedUser };
    console.log(payload);
    const response = await assignProperty(payload);
    if (response) { toast.success(" propertys assigned succesfully"); await getPropertys(); setIsAssignOpen(false); return response; }
    toast.error("failed to assign propertys"); setIsAssignOpen(false);
  };

  const handleMailAll = async () => {
    if (!selectedMailtemplate) { toast.error("Please select a template"); return; }
    const payload: mailAllPropertyInterface = { propertyIds: selectedPropertys, templateId: selectedMailtemplate };
    console.log(payload);
    const response = await emailAllProperty(payload);
    if (response) { toast.success("Email propertys succesfully"); setIsMailAllOpen(false); return response; }
    toast.error("failed to email propertys"); setIsMailAllOpen(false);
  };

  const handleWhatsappAll = async () => {
    if (!selectedWhatsapptemplate) { toast.error("Please select a template"); return; }
    const payload: whatsappAllPropertyInterface = { propertyIds: selectedPropertys, templateId: selectedWhatsapptemplate };
    console.log(payload);
    const response = await whatsappAllProperty(payload);
    if (response) { toast.success("Whatsapp propertys succesfully"); setIsWhatsappAllOpen(false); return response; }
    toast.error("failed to whatsapp propertys"); setIsWhatsappAllOpen(false);
  };

  const phonetableheader = [{ key: "Description", label: getLabel("Description", "Description") }, { key: "Campaign", label: getLabel("Campaign", "Campaign") }, { key: "Name", label: getLabel("propertyName", "Name") }, { key: "Location", label: getLabel("Location", "Location") }, { key: "ContactNumber", label: "Ph. No." }, { key: "Type", label: getLabel("PropertyType", "Property Type") }];
  const phoneViewAllHaders = [{ key: "Campaign", label: getLabel("Campaign", "Campaign") }, { key: "Type", label: getLabel("PropertyType", "Property Type") }, { key: "SubType", label: getLabel("PropertySubType", "Property Subtype") }, { key: "Name", label: getLabel("propertyName", "Name") }, { key: "Location", label: getLabel("Location", "Location") }, { key: "Description", label: getLabel("Description", "Description") }, { key: "ContactNumber", label: "Contact No" }, { key: "AssignTo", label: getLabel("AssignTo", "Assign To") }, { key: "Date", label: getLabel("PropertyDate", "Date") }];

  const addFollowup = (id: string) => router.push(`/followups/property/add/${id}`);

  const handleTableDialogData = async (contactno: string) => {
    const queryParams = new URLSearchParams();
    queryParams.append("Limit", "100000"); queryParams.append("Skip", "0"); queryParams.append("ContactNumber", contactno);
    const data = await getFilteredProperty(queryParams.toString());
    if (data.length > 0) { console.log(" data of contact no is ", data); const mapped = data.map(mapProperty); setTableDialogPropertyData(mapped); return mapped; }
    toast.error("Sever Error, please try again"); return [];
  };

  const isDuplicateContactNo = async (contactNo: string, currentId: string) => {
    if (duplicateContacts[contactNo] !== undefined) return duplicateContacts[contactNo];
    const queryParams = new URLSearchParams();
    queryParams.append("Limit", "100000"); queryParams.append("Skip", "0"); queryParams.append("ContactNumber", contactNo);
    const data = await getFilteredProperty(queryParams.toString());
    const hasDuplicates = data.filter((d: any) => d._id !== currentId).length > 0;
    setDuplicateContacts(prev => ({ ...prev, [contactNo]: hasDuplicates }));
    return hasDuplicates;
  };

  useEffect(() => { currentRows.forEach(item => { isDuplicateContactNo(item.ContactNumber, item._id); }); }, [currentRows]);

  const aiGenieSearch = async () => {
    if (!keywordInput.trim()) return;
    await wait(800);
    await changeStep(STEPS.SHOW);
    await wait(800);
    const filtersOverride = { ...filters, Keyword: keywordInput };
    if (filters.SearchIn.length > 0) filtersOverride.SearchIn = filters.SearchIn;
    const data = await handleSelectChange("Keyword", keywordInput, filtersOverride);
    const count = data?.length ?? 0;
    await wait(1000);
    setAiLoading(false);
  };

  // ── Style helpers ─────────────────────────────────────────────────
  const actionBase = "relative overflow-hidden group flex items-center gap-1.5 py-1.5 px-3 text-xs font-semibold rounded-lg border transition-all duration-200 cursor-pointer select-none";
  const btnGreen = `${actionBase} text-[var(--color-primary)] dark:text-[#6EE7B7] bg-[var(--color-primary-lighter)] dark:bg-[rgba(52,211,153,0.07)] border-[var(--color-primary-light)] dark:border-[rgba(52,211,153,0.18)] hover:bg-[var(--color-primary)] hover:text-white`;
  const btnRed = `${actionBase} text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700/40 hover:bg-red-600 hover:text-white hover:border-red-600`;
  const TH = "px-4 py-3.5 text-left border-b-2 border-r border-[var(--color-primary-dark)] dark:border-[#2a5c3a] bg-[var(--color-primary)] dark:bg-[#003D21] text-white text-xs font-bold uppercase tracking-wider whitespace-nowrap";
  const TD = "px-4 py-3 border-b border-r border-[var(--color-primary-light)] dark:border-[#1a3a24]";
  const pagBtn = "flex items-center justify-center h-8 rounded-lg border border-[var(--color-primary-light)] dark:border-[#1a3a24] bg-white dark:bg-[#0d1f14] text-[var(--color-primary)] dark:text-[#6EE7B7] hover:bg-[var(--color-primary-lighter)] dark:hover:bg-[rgba(52,211,153,0.08)] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 text-sm font-medium px-3";

  // ── JSX ───────────────────────────────────────────────────────────
  return (
    <ProtectedRoute>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: "'DM Sans',sans-serif",
            borderRadius: 12,
            border: "1px solid var(--color-primary-light)",
          },
        }}
      />

      {/* Popups — UNCHANGED */}
      {isWhatsappAllOpen && selectedPropertys.length > 0 && (
        <ListPopup title="Whatsapp Propertys" list={whatsappTemplates} selected={selectedWhatsapptemplate} onSelect={handleSelectWhatsapptemplate} onSubmit={handleWhatsappAll} submitLabel="Whatsapp" onClose={() => { setSelectedPropertys([]); setIsWhatsappAllOpen(false); }} />
      )}
      {isMailAllOpen && selectedPropertys.length > 0 && (
        <ListPopup title="Mail Propertys" list={mailTemplates} selected={selectedMailtemplate} onSelect={handleSelectMailtemplate} onSubmit={handleMailAll} submitLabel="Mail" onClose={() => { setSelectedPropertys([]); setIsMailAllOpen(false); }} />
      )}
      <FavouriteDialog<DeleteDialogDataInterface>
        isOpen={isFavouriteDialogOpen}
        title={`Are you sure you want to ${isFavrouteProperty ? "unfavourite" : "favourite"} this property?`}
        data={dialogData}
        onClose={() => { setIsFavouriteDialogOpen(false); setDialogData(null); }}
        onDelete={handleFavourite}
      />
      <TableDialog isOpen={isTableDialogOpen} title="Propertys By" data={tableDialogpropertyData} onClose={() => setIsTableDialogOpen(false)} />

      {/* ════ MOBILE ════════════════════════════════════════════════════ */}
      <div className="sm:hidden min-h-[calc(100vh-56px)] overflow-auto py-3 px-3  ">
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-3 px-1">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md flex-shrink-0" style={{ background: "linear-gradient(135deg,#006838,#0B7A43)" }}>
            <Building2 size={15} color="#fff" />
          </div>
          <h1 className="text-[var(--color-primary)] dark:text-[#6EE7B7] font-extrabold text-xl" style={{ fontFamily: "'Playfair Display',serif" }}>Properties</h1>
        </div>

        <div className="w-full">
          <DynamicAdvance>
            <ObjectSelect options={Array.isArray(fieldOptions?.Campaign) ? fieldOptions.Campaign : []} label={getLabel("Campaign", "Campaign")} value={dependent.Campaign.id} getLabel={(item) => item?.Name || ""} getId={(item) => item?._id || ""} onChange={(selectedId) => { const s = fieldOptions.Campaign.find((i) => i._id === selectedId); if (s) { const uf = { ...filters, Campaign: [s.Name], PropertyType: [], PropertySubType: [] }; setFilters(uf); setDependent(p => ({ ...p, Campaign: { id: s._id, name: s.Name }, PropertyType: { id: "", name: "" }, PropertySubType: { id: "", name: "" } })); handleSelectChange("Campaign", s.Name, uf); } }} />
            <ObjectSelect options={Array.isArray(fieldOptions?.PropertyType) ? fieldOptions.PropertyType : []} label={getLabel("PropertyType", "Property Type")} value={dependent.PropertyType.name} getLabel={(item) => item?.Name || ""} getId={(item) => item?._id || ""} onChange={(selectedId) => { const s = fieldOptions.PropertyType.find((i) => i._id === selectedId); if (s) { const uf = { ...filters, PropertyType: [s.Name], PropertySubType: [] }; setFilters(uf); setDependent(p => ({ ...p, PropertyType: { id: s._id, name: s.Name }, PropertySubType: { id: "", name: "" } })); handleSelectChange("PropertyType", s.Name, uf); } }} />
            <ObjectSelect options={Array.isArray(fieldOptions?.PropertySubtype) ? fieldOptions.PropertySubtype : []} label={getLabel("PropertySubType", "Property Subtype")} value={dependent.PropertySubType.name} getLabel={(item) => item?.Name || ""} getId={(item) => item?._id || ""} onChange={(selectedId) => { const s = fieldOptions.PropertySubtype.find((i) => i._id === selectedId); if (s) { const uf = { ...filters, PropertySubType: [s.Name] }; setFilters(uf); setDependent(p => ({ ...p, PropertySubType: { id: s._id, name: s.Name } })); handleSelectChange("PropertySubType", s.Name, uf); } }} />
            <ObjectSelect options={Array.isArray(fieldOptions?.City) ? fieldOptions.City : []} label={getLabel("City", "City")} value={dependent.City.id} getLabel={(item) => item?.Name || ""} getId={(item) => item?._id || ""} onChange={(selectedId) => { const s = fieldOptions.City.find((i) => i._id === selectedId); if (s) { const uf = { ...filters, City: [s.Name], Location: [] }; setFilters(uf); setDependent(p => ({ ...p, City: { id: s._id, name: s.Name }, Location: { id: "", name: "" } })); handleSelectChange("City", s.Name, uf); } }} />
            <ObjectSelect options={Array.isArray(fieldOptions?.Location) ? fieldOptions.Location : []} label={getLabel("Location", "Location")} value={dependent.Location.id} getLabel={(item) => item?.Name || ""} getId={(item) => item?._id || ""} onChange={(selectedId) => { const s = fieldOptions.Location.find((i) => i._id === selectedId); if (s) { const uf = { ...filters, Location: [s.Name] }; setFilters(uf); setDependent(p => ({ ...p, Location: { id: s._id, name: s.Name } })); handleSelectChange("Location", s.Name, uf); } }} />
            <SingleSelect options={Array.isArray(fieldOptions?.User) ? fieldOptions.User : []} value={filters.User[0]} label="User" onChange={(v) => handleSelectChange("User", v)} isSearchable />
            <div className="w-full flex justify-end">
              <button type="reset" onClick={clearFilter} className="text-red-500 dark:text-red-400 cursor-pointer hover:underline text-sm px-4 py-2">Clear Search</button>
            </div>
          </DynamicAdvance>
        </div>

        <PropertyTable
          leads={propertyData} labelLeads={phonetableheader} allLabelLeads={phoneViewAllHaders}
          onAdd={(id) => addFollowup(id)} onEdit={(id) => router.push(`/property/edit/${id}`)}
          onWhatsappClick={(lead) => { setSelectedPropertys([lead._id]); setIsWhatsappAllOpen(true); fetchWhatsappTemplates(); }}
          onMailClick={(lead) => { setSelectedPropertys([lead._id]); setIsMailAllOpen(true); fetchEmailTemplates(); }}
          onFavourite={(lead) => { handleFavouriteToggle(lead._id, lead.Name, lead.ContactNumber, lead.isFavourite ?? false); }}
          loader={propertyTableLoader} hasMorePropertys={hasMorePropertys} fetchMore={fetchMore}
        />
      </div>

      {/* ════ DESKTOP ═══════════════════════════════════════════════════ */}
      <div className="min-h-[calc(100vh-56px)] max-sm:hidden overflow-auto   p-4">

        {/* Dialogs */}
        <DeleteDialog<DeleteDialogDataInterface> isOpen={isDeleteDialogOpen} title="Are you sure you want to delete this property?" data={dialogData} onClose={() => { setIsDeleteDialogOpen(false); setDialogData(null); }} onDelete={handleDelete} />
        <DeleteDialog<DeleteAllDialogDataInterface> isOpen={isDeleteAllDialogOpen} title="Are you sure you want to delete ALL propertys?" data={deleteAllDialogData} onClose={() => { setIsDeleteAllDialogOpen(false); setDeleteAllDialogData(null); }} onDelete={handleDeleteAll} />
        {isAssignOpen && selectedPropertys.length > 0 && (
          <ListPopup title="Assign Propertys" list={users} selected={selectedUser} onSelect={handleSelectUser} onSubmit={handleAssignto} submitLabel="Assign" onClose={() => setIsAssignOpen(false)} />
        )}

        {/* ── Main card ── */}
        <div className="w-full rounded-2xl overflow-hidden bg-white dark:bg-[#0d1f14] border border-[var(--color-primary-light)] dark:border-[#1a3a24] shadow-sm dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">

          {/* Page header */}
          <div className="flex flex-wrap justify-between items-center gap-3 px-6 py-4 border-b border-[var(--color-primary-light)] dark:border-[#1a3a24] bg-[var(--color-primary-lighter)] dark:bg-[#091510]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md flex-shrink-0" style={{ background: "linear-gradient(135deg,#006838,#0B7A43)" }}>
                <Building2 size={17} color="#fff" />
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-widest uppercase text-[var(--color-primary)] dark:text-[#6EE7B7]">Management</p>
                <h1 className="text-[var(--color-secondary-darker)] dark:text-white leading-tight" style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700 }}>Properties</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-[#0d1f14] border border-[var(--color-primary-light)] dark:border-[#1a3a24] text-[var(--color-primary)] dark:text-[#6EE7B7]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
                {totalPropertys} records
              </div>
              {admin?.role === "administrator" && (
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 text-[var(--color-primary)] dark:text-[#6EE7B7] bg-[var(--color-primary-lighter)] dark:bg-[rgba(52,211,153,0.07)] border border-[var(--color-primary-light)] dark:border-[rgba(52,211,153,0.18)] hover:bg-[var(--color-primary)] hover:text-white"
                  onClick={() => { if (selectedPropertys.length === 0) { toast.error("Please select at least one property to export"); return; } exportToExcel(exportingPropertyData, "property_list"); }}>
                  <CiExport size={15} /> Export
                </button>
              )}
              <AddButton url="/property/add" text="Add" icon={<PlusSquare size={16} />} />
            </div>
          </div>

          {/* Advanced Search accordion */}
          <div className="border-b border-[var(--color-primary-light)] dark:border-[#1a3a24]">
            <button
              type="button"
              className="w-full flex items-center justify-between px-6 py-3.5 cursor-pointer hover:bg-[var(--color-primary-lighter)] dark:hover:bg-[rgba(52,211,153,0.04)] transition-colors duration-200"
              onClick={() => setToggleSearchDropdown(!toggleSearchDropdown)}
            >
              <div className="flex items-center gap-2.5">
                <Filter size={15} className="text-[var(--color-primary)] dark:text-[#6EE7B7]" />
                <span className="text-sm font-semibold text-[var(--color-secondary-darker)] dark:text-white">Advanced Search</span>
                {isFilteredTrigger && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--color-primary)] text-white">Active</span>}
              </div>
              {toggleSearchDropdown
                ? <ChevronUp size={16} className="text-[var(--color-primary)] dark:text-[#6EE7B7]" />
                : <ChevronDown size={16} className="text-[#9CA3AF] dark:text-[#6b7280]" />
              }
            </button>

            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${toggleSearchDropdown ? "max-h-[2000px]" : "max-h-0"}`}>
              <div className="px-6 py-5 bg-[var(--color-primary-lighter)]/60 dark:bg-[#091510]/60 border-t border-[var(--color-primary-light)] dark:border-[#1a3a24]">
                <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1 max-lg:grid-cols-2 mb-5">
                  <ObjectSelect options={Array.isArray(fieldOptions?.Campaign) ? fieldOptions.Campaign : []} label={getLabel("Campaign", "Campaign")} value={dependent.Campaign.id} getLabel={(item) => item?.Name || ""} getId={(item) => item?._id || ""} onChange={(selectedId) => { const s = fieldOptions.Campaign.find((i) => i._id === selectedId); if (s) { const uf = { ...filters, Campaign: [s.Name], PropertyType: [], PropertySubType: [] }; setFilters(uf); setDependent(p => ({ ...p, Campaign: { id: s._id, name: s.Name }, PropertyType: { id: "", name: "" }, PropertySubType: { id: "", name: "" } })); handleSelectChange("Campaign", s.Name, uf); } }} />
                  <ObjectSelect options={Array.isArray(fieldOptions?.PropertyType) ? fieldOptions.PropertyType : []} label={getLabel("PropertyType", "Property Type")} value={dependent.PropertyType.name} getLabel={(item) => item?.Name || ""} getId={(item) => item?._id || ""} onChange={(selectedId) => { const s = fieldOptions.PropertyType.find((i) => i._id === selectedId); if (s) { const uf = { ...filters, PropertyType: [s.Name], PropertySubType: [] }; setFilters(uf); setDependent(p => ({ ...p, PropertyType: { id: s._id, name: s.Name }, PropertySubType: { id: "", name: "" } })); handleSelectChange("PropertyType", s.Name, uf); } }} />
                  <ObjectSelect options={Array.isArray(fieldOptions?.PropertySubtype) ? fieldOptions.PropertySubtype : []} label={getLabel("PropertySubType", "Property Subtype")} value={dependent.PropertySubType.name} getLabel={(item) => item?.Name || ""} getId={(item) => item?._id || ""} onChange={(selectedId) => { const s = fieldOptions.PropertySubtype.find((i) => i._id === selectedId); if (s) { const uf = { ...filters, PropertySubType: [s.Name] }; setFilters(uf); setDependent(p => ({ ...p, PropertySubType: { id: s._id, name: s.Name } })); handleSelectChange("PropertySubType", s.Name, uf); } }} />
                  <ObjectSelect options={Array.isArray(fieldOptions?.City) ? fieldOptions.City : []} label={getLabel("City", "City")} value={dependent.City.id} getLabel={(item) => item?.Name || ""} getId={(item) => item?._id || ""} onChange={(selectedId) => { const s = fieldOptions.City.find((i) => i._id === selectedId); if (s) { const uf = { ...filters, City: [s.Name], Location: [] }; setFilters(uf); setDependent(p => ({ ...p, City: { id: s._id, name: s.Name }, Location: { id: "", name: "" } })); handleSelectChange("City", s.Name, uf); } }} />
                  <ObjectSelect options={Array.isArray(fieldOptions?.Location) ? fieldOptions.Location : []} label={getLabel("Location", "Location")} value={dependent.Location.id} getLabel={(item) => item?.Name || ""} getId={(item) => item?._id || ""} onChange={(selectedId) => { const s = fieldOptions.Location.find((i) => i._id === selectedId); if (s) { const uf = { ...filters, Location: [s.Name] }; setFilters(uf); setDependent(p => ({ ...p, Location: { id: s._id, name: s.Name } })); handleSelectChange("Location", s.Name, uf); } }} isSearchable />
                  <ObjectSelect options={Array.isArray(fieldOptions?.SubLocation) ? fieldOptions.SubLocation : []} label={getLabel("SubLocation", "Sub Location")} value={dependent.SubLocation.id} getLabel={(item) => item?.Name || ""} getId={(item) => item?._id || ""} onChange={(selectedId) => { const s = fieldOptions.SubLocation.find((i) => i._id === selectedId); if (s) { const uf = { ...filters, SubLocation: [s.Name] }; setFilters(uf); setDependent(p => ({ ...p, SubLocation: { id: s._id, name: s.Name } })); handleSelectChange("SubLocation", s.Name, uf); } }} isSearchable />
                  <SingleSelect options={Array.isArray(fieldOptions?.ReferenceId) ? fieldOptions.ReferenceId : []} value={filters.ReferenceId[0]} label={getLabel("ReferenceId", "Reference Id")} onChange={(v) => handleSelectChange("ReferenceId", v)} isSearchable />
                  <SingleSelect options={Array.isArray(fieldOptions?.Price) ? fieldOptions.Price : []} value={filters.Price[0]} label={getLabel("Price", "Price")} onChange={(v) => handleSelectChange("Price", v)} isSearchable />
                  <SingleSelect options={Array.isArray(fieldOptions?.User) ? fieldOptions.User : []} value={filters.User[0]} label="User" onChange={(v) => handleSelectChange("User", v)} isSearchable />
                  <SingleSelect options={["10", "25", "50", "100"]} value={filters.Limit[0]} label="Limit" onChange={(v) => handleSelectChange("Limit", v)} />
                  <DateSelector label="From" value={filters.StartDate[0]} onChange={(v) => handleSelectChange("StartDate", v)} />
                  <DateSelector label="To" value={filters.EndDate[0]} onChange={(v) => handleSelectChange("EndDate", v)} />
                </div>

                {/* AI Genie */}
                <div className="mt-2 p-4 rounded-xl border border-[var(--color-primary-light)] dark:border-[#1a3a24] bg-white dark:bg-[#0d1f14]">
                  <div className="flex items-center gap-2 mb-3">
                    {aiLoading ? <BounceLoader loading size={22} color="var(--color-primary)" /> : <img className="w-[22px]" src="/aiBot.png" alt="AI" />}
                    <span className="text-sm font-bold text-[var(--color-secondary-darker)] dark:text-white">AI Genie</span>
                    {currentStep && (
                      <span className="flex items-center gap-1 text-xs text-[#9CA3AF] dark:text-[#6b7280]">
                        {currentStep}
                        {aiLoading && <BeatLoader size={2} color="gray" />}
                      </span>
                    )}
                  </div>

                  <form
                    className="flex max-lg:flex-col gap-3 items-start"
                    onSubmit={(e) => { e.preventDefault(); if (keywordInput.trim() === "") return; setAiLoading(true); setCurrentStep(STEPS.SEARCH); aiGenieSearch(); }}
                  >
                    <div className="flex-1 w-full">
                      <div className="flex items-center border border-[var(--color-primary-light)] dark:border-[#1a3a24] rounded-xl overflow-hidden focus-within:border-[var(--color-primary)] dark:focus-within:border-[#6EE7B7] focus-within:shadow-[0_0_0_3px_rgba(0,104,56,0.1)] transition-all duration-200">
                        <input
                          type="text"
                          placeholder="What you want to search?"
                          className="outline-none flex-1 px-4 py-2.5 text-sm bg-transparent text-[var(--color-secondary-darker)] dark:text-white placeholder-[#9CA3AF] dark:placeholder-[#6b7280]"
                          value={keywordInput}
                          onChange={(e) => setKeywordInput(e.target.value)}
                        />
                        <button type="button" className="px-3 py-2.5 text-[#9CA3AF] dark:text-[#6b7280] hover:text-[var(--color-primary)] dark:hover:text-[#6EE7B7] transition-colors" onClick={() => setToggleAiGenieSearchBy(!toggleAiGenieSearchBy)}>
                          {toggleAiGenieSearchBy ? <FaCaretUp /> : <FaCaretDown />}
                        </button>
                      </div>

                      <div className={`overflow-hidden transition-all duration-300 ${toggleAiGenieSearchBy ? "max-h-[200px] mt-3" : "max-h-0"}`}>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {SEARCH_FIELDS.filter(f => !filters.SearchIn.includes(f)).map((field) => (
                            <button key={field} type="button" className="px-2.5 py-1 border border-[var(--color-primary-light)] dark:border-[#1a3a24] rounded-lg text-xs text-[var(--color-primary)] dark:text-[#6EE7B7] hover:bg-[var(--color-primary-lighter)] dark:hover:bg-[rgba(52,211,153,0.08)] transition-colors" onClick={() => setFilters(prev => ({ ...prev, SearchIn: [...prev.SearchIn, field] }))}>
                              {field.toLowerCase()}
                            </button>
                          ))}
                        </div>
                        {filters.SearchIn.length > 0 && (
                          <>
                            <p className="text-[11px] text-[#9CA3AF] dark:text-[#6b7280] mb-2 font-semibold uppercase tracking-wider">Selected fields</p>
                            <div className="flex flex-wrap gap-2">
                              {filters.SearchIn.map((field) => (
                                <div key={field} className="group flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs border border-[var(--color-primary)] dark:border-[#6EE7B7] bg-[var(--color-primary-lighter)] dark:bg-[rgba(52,211,153,0.08)] text-[var(--color-primary)] dark:text-[#6EE7B7]">
                                  {field.toLowerCase()}
                                  <button className="ml-0.5 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setFilters(prev => ({ ...prev, SearchIn: prev.SearchIn.filter(f => f !== field) }))}><IoMdClose size={12} /></button>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className={`flex items-center gap-2 flex-shrink-0 ${toggleAiGenieSearchBy ? "lg:-mt-28" : "lg:mt-0"} transition-all duration-300`}>
                      {!aiLoading ? (
                        <button type="submit" className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold border border-[var(--color-primary)] dark:border-[#6EE7B7] text-[var(--color-primary)] dark:text-[#6EE7B7] hover:bg-[var(--color-primary)] hover:text-white transition-all duration-200">Explore</button>
                      ) : (
                        <button type="button" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-[var(--color-primary)] text-white">
                          Exploring <HashLoader loading color="white" size={10} />
                        </button>
                      )}
                      <button type="reset" onClick={clearFilter} className="px-3 py-2.5 text-sm text-red-500 dark:text-red-400 hover:underline rounded-xl">Clear</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Bulk action toolbar */}
          <div className="flex flex-wrap justify-between items-center px-6 py-3 gap-2  bg-white dark:bg-[#0d1f14]">
            <div className="flex flex-wrap items-center gap-2">
              <label htmlFor="selectall" className={`${btnGreen} cursor-pointer`}>
                <input id="selectall" type="checkbox" className="hidden" checked={currentRows.length > 0 && currentRows.every((r) => selectedPropertys.includes(r._id))} onChange={handleSelectAll} />
                Select All
              </label>
              <button type="button" className={btnGreen} onClick={() => { if (selectedPropertys.length <= 0) toast.error("please select atleast 1 property"); else { setIsAssignOpen(true); fetchUsers(); } }}>Assign To</button>
              <button type="button" className={btnGreen} onClick={() => { if (selectedPropertys.length <= 0) toast.error("please select atleast 1 property"); else { setIsMailAllOpen(true); fetchEmailTemplates(); } }}>Email All</button>
              <button type="button" className={btnGreen} onClick={() => { if (selectedPropertys.length <= 0) toast.error("please select atleast 1 property"); else { setIsWhatsappAllOpen(true); fetchWhatsappTemplates(); } }}>SMS All</button>
              {admin?.role !== "user" && (
                <button type="button" className={btnRed} onClick={() => { if (propertyData.length > 0) { if (selectedPropertys.length < 1) { const firstPageIds = currentRows.map((c) => c._id); setSelectedPropertys(firstPageIds); } setIsDeleteAllDialogOpen(true); setDeleteAllDialogData({}); } }}>Delete All</button>
              )}
            </div>
            {selectedPropertys.length > 0 && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--color-primary-lighter)] dark:bg-[rgba(52,211,153,0.08)] text-[var(--color-primary)] dark:text-[#6EE7B7] border border-[var(--color-primary-light)] dark:border-[rgba(52,211,153,0.18)]">
                {selectedPropertys.length} selected
              </span>
            )}
          </div>

          {/* Table */}
       <div className="w-full bg-white dark:bg-[var(--color-primary)] rounded-lg  shadow-sm">

  {/* Table */}
  <div className="max-h-[600px] overflow-y-auto" ref={scrollRef}>
    <table className="w-full border-collapse">
      <thead className="bg-[var(--color-primary-lighter)] dark:bg-[#091510]  sticky top-0 ">
        <tr>
          <th className="w-8 px-3 py-3 border-b border-gray-200 dark:border-[#091510]/90">
            {/* <input 
              id="sel-all-th" 
              type="checkbox" 
              className="w-3.5 h-3.5 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)] dark:border-gray-600 dark:bg-gray-800 cursor-pointer"
              checked={currentRows.length > 0 && currentRows.every((r) => selectedPropertys.includes(r._id))} 
              onChange={handleSelectAll} 
            /> */}
          </th>
          <th className="w-10 px-2 py-3 text-left text-[11px] font-bold text-[var(--color-primary-dark)] dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-[#091510]/90">
            S.No
          </th>
          <th className="px-3 py-3 text-left text-[11px] font-bold text-[var(--color-primary-dark)] dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-[#091510]/90 w-44">
            Property Name
          </th>
          <th className="px-3 py-3 text-left text-[11px] font-bold text-[var(--color-primary-dark)] dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-[#091510]/90 w-28">
            Type
          </th>
          <th className="px-3 py-3 text-left text-[11px] font-bold text-[var(--color-primary-dark)] dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-[#091510]/90 w-48">
            Address
          </th>
          <th className="px-3 py-3 text-center text-[11px] font-bold text-[var(--color-primary-dark)] dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-[#091510]/90 w-36">
            Contact
          </th>
          <th className="px-3 py-3 text-left text-[11px] font-bold text-[var(--color-primary-dark)] dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-[#091510]/90 w-40">
            Email
          </th>
          <th className="px-3 py-3 text-left text-[11px] font-bold text-[var(--color-primary-dark)] dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-[#091510]/90 w-24">
            Date
          </th>
          <th className="px-3 py-3 text-center text-[11px] font-bold text-[var(--color-primary-dark)] dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-[#091510]/90 w-28">
            Actions
          </th>
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-100 dark:divide-[#091510]/60">
        {propertyTableLoader ? (
          <tr>
            <td colSpan={9} className="py-16 bg-white dark:bg-[#0d1f14]">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-[var(--color-primary-light)] border-t-[var(--color-primary)] rounded-full animate-spin"></div>
                <p className="text-xs text-gray-500 dark:text-gray-500 font-medium">Loading properties...</p>
              </div>
            </td>
          </tr>
        ) : currentRows.length > 0 ? (
          currentRows.map((item, index) => {
            const isSel = selectedPropertys.includes(item._id);
            const rowNum = (currentTablePage - 1) * rowsPerTablePage + (index + 1);
            
            return (
              <tr 
                key={item._id} 
                className={`transition-colors duration-150 ${isSel ? "bg-[var(--color-primary-lighter)] dark:bg-[var(--color-primary-dark)]/20" : "bg-white dark:bg-[#091510]/90 hover:bg-gray-50 dark:hover:bg-[#091510]/80"}`}
              >
                {/* Checkbox */}
                <td className="px-3 py-3">
                  <input 
                    type="checkbox" 
                    checked={isSel} 
                    onChange={() => handleSelectRow(item._id)} 
                    className="w-3.5 h-3.5 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)] dark:border-gray-600 dark:bg-gray-800 cursor-pointer"
                  />
                </td>
                
                {/* Serial Number */}
                <td className="px-2 py-3">
                  <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-600 tabular-nums">
                    {rowNum}
                  </span>
                </td>
                
                {/* Property Name */}
                <td className="px-3 py-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-[12px] font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[160px]" title={item.Name}>
                      {item.Name}
                    </span>
                    {item.isFavourite && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-pink-500">
                        <MdFavorite size={10} /> Favorite
                      </span>
                    )}
                  </div>
                </td>
                
                {/* Property Type */}
                <td className="px-3 py-3">
                  <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-semibold bg-[var(--color-primary-lighter)] dark:bg-[var(--color-primary-dark)]/30 text-[var(--color-primary-darker)] dark:text-[var(--color-primary-light)] border border-[var(--color-primary-light)] dark:border-[var(--color-primary-dark)]/50">
                    {item.SubType || 'N/A'}
                  </span>
                </td>
                
                {/* Address */}
                <td className="px-3 py-3">
                  <p className="text-[11px] text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed" title={item.Description}>
                    {item.Description || '-'}
                  </p>
                </td>
                
                {/* Contact */}
                <td className="px-2 py-3">
                  {item.ContactNumber ? (
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-[11px] font-bold text-gray-800 dark:text-gray-200 tabular-nums">
                        {item.ContactNumber}
                      </span>
                      <div className="flex items-center gap-1">
                        <a
                          href={`tel:${item.ContactNumber}`}
                          className="p-1.5 rounded bg-[var(--color-primary-lighter)] dark:bg-[var(--color-primary-dark)]/30 text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] dark:hover:bg-[var(--color-primary-dark)]/50 transition-colors"
                          title="Call"
                        >
                          <FaPhone size={9} />
                        </a>
                        <button
                          onClick={() => { setSelectedPropertys([item._id]); setSelectUser(item._id); setIsMailAllOpen(true); fetchEmailTemplates(); }}
                          className="p-1.5 rounded bg-[var(--color-primary-lighter)] dark:bg-[var(--color-primary-dark)]/30 text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] dark:hover:bg-[var(--color-primary-dark)]/50 transition-colors"
                          title="Email"
                        >
                          <MdEmail size={10} />
                        </button>
                        <button
                          onClick={() => { setSelectedPropertys([item._id]); setSelectUser(item._id); setIsWhatsappAllOpen(true); fetchWhatsappTemplates(); }}
                          className="p-1.5 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                          title="WhatsApp"
                        >
                          <FaWhatsapp size={10} />
                        </button>
                      </div>
                      {duplicateContacts[item.ContactNumber] && (
                        <button
                          onClick={() => { setIsTableDialogOpen(true); handleTableDialogData(item.ContactNumber); }}
                          className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[9px] font-semibold hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
                        >
                          <FaEye size={8} /> View
                        </button>
                      )}
                    </div>
                  ) : (
                    <span className="text-[11px] text-gray-400 dark:text-gray-600">-</span>
                  )}
                </td>
                
                {/* Email */}
                <td className="px-3 py-3">
                  <span className="text-[11px] text-gray-600 dark:text-gray-400 truncate block max-w-[140px]" title={item.Email}>
                    {item.Email || '-'}
                  </span>
                </td>
                
                {/* Date */}
                <td className="px-3 py-3">
                  <span className="text-[11px] text-gray-500 dark:text-gray-500 font-medium whitespace-nowrap">
                    {item.Date}
                  </span>
                </td>
                
                {/* Actions */}
                <td className="px-2 py-3">
                  <div className="grid grid-cols-2 gap-1">
                    {/* <button
                      onClick={() => router.push(`/followups/property/add/${item._id}`)}
                      className="p-1.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-[var(--color-primary-lighter)] hover:text-[var(--color-primary)] dark:hover:bg-[var(--color-primary-dark)]/30 dark:hover:text-[var(--color-primary-light)] transition-colors"
                      title="Add Follow-up"
                    >
                      <MdAdd size={14} />
                    </button> */}
                    <button
                      onClick={() => router.push(`/property/edit/${item._id}`)}
                      className="p-1.5 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                      title="Edit"
                    >
                      <MdEdit size={13} />
                    </button>
                    <button
                      onClick={() => { setIsDeleteDialogOpen(true); setDialogType("delete"); setDialogData({ id: item._id, propertyName: item.Name, ContactNumber: item.ContactNumber }); }}
                      className="p-1.5 rounded bg-green-100 dark:bg-green-900/30 text-gray-600 dark:text-gray-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <MdDelete size={13} />
                    </button>
                    <button
                      onClick={() => handleFavouriteToggle(item._id, item.Name, item.ContactNumber, item.isFavourite ?? false)}
                      className={`p-1.5 rounded transition-colors ${item.isFavourite ? 'bg-green-100 dark:bg-green-900/30 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-pink-600 dark:text-pink-400' : 'bg-green-100 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-gray-400 hover:text-pink-500'}`}
                      title={item.isFavourite ? 'Remove Favorite' : 'Add Favorite'}
                    >
                      {item.isFavourite ? <MdFavorite size={13} /> : <MdFavoriteBorder size={13} />}
                    </button>
                    <button
                      onClick={() => handleChecked({ id: item?._id, isChecked: item?.isChecked })}
                      className={`p-1.5 rounded transition-colors ${item.isChecked ? 'bg-green-100 dark:bg-green-900/30 text-[var(--color-primary)] dark:bg-green-900/30 dark:hover:bg-green-900/50' : 'bg-green-100 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-gray-400 hover:text-[var(--color-primary)]'}`}
                      title={item.isChecked ? 'Checked' : 'Mark Checked'}
                    >
                      {item.isChecked ? <IoCheckmarkDoneOutline size={14} /> : <IoCheckmark size={14} />}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan={9} className="py-16 bg-white dark:bg-[#0B1120]">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <Building2 size={20} className="text-gray-400 dark:text-gray-600" />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-500 font-medium">No properties found</p>
                <p className="text-[11px] text-gray-400 dark:text-gray-600">Add a new property to get started</p>
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>

 
</div>

          {/* Pagination */}
          <div className="flex flex-wrap justify-between items-center px-6 py-4 gap-3 border-t border-[var(--color-primary-light)] dark:border-[#1a3a24] bg-[var(--color-primary-lighter)] dark:bg-[#091510]">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />
              <p className="text-sm font-medium text-[var(--color-secondary-darker)] dark:text-white">
                Page <span className="font-bold">{currentTablePage}</span> of <span className="font-bold">{totalPropertyPage}</span>
              </p>
              {totalPropertys > 0 && <span className="text-xs text-[#9CA3AF] dark:text-[#6b7280]">({totalPropertys} total)</span>}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setCurrentTablePage(1)} disabled={currentTablePage === 1} className={pagBtn}><ChevronsLeft size={15} /></button>
              <button onClick={() => setCurrentTablePage((prev) => Math.max(prev - 1, 1))} disabled={currentTablePage === 1} className={pagBtn}>Prev</button>
              <button
                onClick={async () => { if (currentTablePage < totalTablePages) { setCurrentTablePage(prev => prev + 1); return; } if (hasMorePropertys) { await fetchMore(); setCurrentTablePage(prev => prev + 1); } }}
                disabled={!hasMorePropertys && currentTablePage === totalTablePages}
                className={pagBtn}
              >Next</button>
              <button onClick={handleLastPage} disabled={currentTablePage === totalTablePages && !hasMorePropertys} className={pagBtn}><ChevronsRight size={15} /></button>
            </div>
          </div>

        </div>{/* /main card */}
      </div>
    </ProtectedRoute>
  );
}