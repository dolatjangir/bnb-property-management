"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, X, Building2, MapPin, User, DollarSign, Image as ImageIcon, 
  Layers, ChevronRight, Save
} from "lucide-react";
import SingleSelect from "@/app/component/SingleSelect";
import DateSelector from "@/app/component/DateSelector";
import toast, { Toaster } from "react-hot-toast";
import { getPropertyById, updateProperty } from "@/store/property";
import { propertyAllDataInterface } from "@/store/property.interface";
import { handleFieldOptions } from "@/app/utils/handleFieldOptions";
import { getCampaign } from "@/store/masters/campaign/campaign";
import { getTypesByCampaign } from "@/store/masters/types/types";
import { getLocationByCity } from "@/store/masters/location/location";
import { getCity } from "@/store/masters/city/city";
import { getFacilities } from "@/store/masters/facilities/facilities";
import { getSubtypeByCampaignAndType } from "@/store/masters/subtype/subtype";
import { handleFieldOptionsObject } from "@/app/utils/handleFieldOptionsObject";
import ObjectSelect from "@/app/component/ObjectSelect";
import InputField from "@/app/component/datafields/InputField";
import TextareaField from "@/app/component/datafields/TextareaField";
import { trimCountryCodeHelper } from "@/app/utils/trimCountryCodeHelper";
import { getsubLocationByCityLoc } from "@/store/masters/sublocation/sublocation";
import { getReferences } from "@/store/masters/references/references";
import { getPrice } from "@/store/masters/price/price";
import { usePropertyFieldLabel } from "@/context/property/PropertyFieldLabelContext";
import { getPropertyFields } from "@/store/masters/propertyfields/propertyfields";

interface ErrorInterface {
  [key: string]: string;
}

type CustomFieldsType = {
  [key: string]: string;
};

// ─── Section Header ───────────────────────────────────────────────────────────
const SectionHeader = ({
  icon, title, subtitle, step,
}: {
  icon: React.ReactNode; title: string; subtitle: string; step: number;
}) => (
  <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
    <div className="relative flex-shrink-0">
      <div
        className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shadow-md"
        style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary-darker))" }}
      >
        <span className="text-white">{icon}</span>
      </div>
      <div
        className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[8px] sm:text-[9px] font-bold text-white shadow-sm"
        style={{ background: "var(--color-accent)" }}
      >
        {step}
      </div>
    </div>
    <div className="flex-1 min-w-0">
      <h2 className="section-title text-sm sm:text-[15px] font-bold tracking-wide leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
        {title}
      </h2>
      <p className="section-subtitle text-[11px] sm:text-xs mt-0.5 leading-relaxed">{subtitle}</p>
    </div>
    <div className="section-divider flex-shrink-0 h-px flex-1 hidden md:block" style={{ maxWidth: "120px" }} />
  </div>
);

// ─── Section Card ─────────────────────────────────────────────────────────────
const SectionCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`section-card relative rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 ${className}`}>
    <div className="section-card-topbar absolute top-0 left-4 right-4 sm:left-8 sm:right-8 h-[2px] sm:h-[3px] rounded-b-full" />
    {children}
  </div>
);

// ─── File Upload ──────────────────────────────────────────────────────────────
const FileUpload: React.FC<{
  label: string;
  multiple?: boolean;
  previews?: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove?: (index: number) => void;
}> = ({ label, multiple, previews = [], onChange, onRemove }) => (
  <div className="flex flex-col gap-2 sm:gap-3 w-full">
    <label className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest" style={{ color: "var(--color-primary)" }}>
      {label}
    </label>
    <div className="upload-zone relative flex flex-col items-center justify-center gap-1.5 h-28 sm:h-32 rounded-xl cursor-pointer transition-all duration-300 px-4">
      <div className="upload-icon-wrap w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-1">
        <ImageIcon size={16} className="sm:w-[18px] sm:h-[18px]" style={{ color: "var(--color-primary)" }} />
      </div>
      <span className="upload-label text-[11px] sm:text-xs font-semibold text-center">
        {multiple ? "Click to upload images" : "Click to upload file"}
      </span>
      <span className="upload-hint text-[9px] sm:text-[10px] text-center">PNG, JPG, PDF supported</span>
      <input type="file" multiple={multiple} onChange={onChange} className="absolute inset-0 opacity-0 cursor-pointer" />
    </div>
    {previews.length > 0 && (
      <div className="flex flex-wrap gap-2 sm:gap-3 mt-2 sm:mt-3">
        {previews.map((src, index) => (
          <div key={index} className="relative group">
            <img
              src={src}
              alt={`preview-${index}`}
              className="preview-img w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg sm:rounded-xl shadow-sm"
            />
            {onRemove && (
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 w-5 h-5 text-white rounded-full flex items-center justify-center shadow opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all active:scale-90"
                style={{ background: "var(--color-destructive)" }}
              >
                <X size={10} />
              </button>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
);

export default function PropertyEdit() {
  const { id } = useParams();
  const router = useRouter();
  const { getLabel } = usePropertyFieldLabel();

  const [propertyData, setPropertyData] = useState<propertyAllDataInterface>({
    Campaign: { id: "", name: "" },
    PropertyType: { id: "", name: "" },
    propertyName: "",
    PropertySubtype: { id: "", name: "" },
    ContactNumber: "",
    City: { id: "", name: "" },
    Location: { id: "", name: "" },
    SubLocation: { id: "", name: "" },
    Area: "",
    Address: "",
    Email: "",
    Facilities: "",
    ReferenceId: "",
    PropertyId: "",
    PropertyDate: "",
    PropertyYear: "",
    Other: "",
    Description: "",
    Video: "",
    GoogleMap: "",
    Verified: "",
    Price: "",
    URL: "",
    PropertyImage: [],
    SitePlan: {} as File,
  });

  const [fieldOptions, setFieldOptions] = useState<Record<string, any[]>>({});
  const [customFields, setCustomFields] = useState<CustomFieldsType>({});
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [sitePlanPreview, setSitePlanPreview] = useState<string>("");
  const [errors, setErrors] = useState<ErrorInterface>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [removedPropertyImages, setRemovedPropertyImages] = useState<string[]>([]);
  const [removedSitePlans, setRemovedSitePlans] = useState<string[]>([]);

  const getPropertyFieldsFunc = async () => {
    const data = await getPropertyFields();
    const activeFields = data.filter((e: any) => e.Status === "Active");
    const fieldsObj: CustomFieldsType = {};
    activeFields.forEach((field: any) => { fieldsObj[field.Name] = ""; });
    return fieldsObj;
  };

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await getPropertyById(id as string);
        if (!data) { toast.error("Property not found"); return; }

        setPropertyData({
          ...data,
          Campaign: { id: data?.Campaign?._id || "", name: data?.Campaign?.Name || "" },
          PropertyType: { id: data?.PropertyType?._id || "", name: data?.PropertyType?.Name || "" },
          PropertySubtype: { id: data?.PropertySubType?._id || "", name: data?.PropertySubType?.Name || "" },
          City: { id: data?.City?._id || "", name: data.City?.Name || "" },
          Location: { id: data.Location?._id || "", name: data.Location?.Name || "" },
          SubLocation: { id: data.SubLocation?._id || "", name: data.SubLocation?.Name || "" },
          PropertyDate: data?.PropertyDate,
          PropertyImage: [],
          SitePlan: {} as File,
        });

        const propertyFields = await getPropertyFieldsFunc();
        setCustomFields({ ...propertyFields, ...data.PropertyFields });
        setImagePreviews(Array.isArray(data.PropertyImage) ? data.PropertyImage : []);
        setSitePlanPreview(data.SitePlan?.[0] || "");
      } catch (error) {
        toast.error("Error fetching property");
        console.error("Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProperty();
  }, [id]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setPropertyData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }, []
  );

  const handleCustomInputChange = (key: string, value: string) => {
    setCustomFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleSelectChange = useCallback((label: string, selected: string) => {
    setPropertyData((prev) => ({ ...prev, [label]: selected }));
    setErrors((prev) => ({ ...prev, [label]: "" }));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const files = e.target.files;
    if (!files) return;
    if (field === "PropertyImage") {
      const newFiles = Array.from(files);
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setPropertyData((prev) => ({ ...prev, PropertyImage: [...prev.PropertyImage, ...newFiles] }));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    } else if (field === "SitePlan") {
      const file = files[0];
      setPropertyData((prev) => ({ ...prev, SitePlan: file }));
      setSitePlanPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = (index: number) => {
    setPropertyData((prev) => ({
      ...prev,
      PropertyImage: prev.PropertyImage.filter((_, i) => i !== index),
    }));
    setImagePreviews((prev) => {
      const removedUrl = prev[index];
      if (removedUrl?.startsWith("http")) {
        setRemovedPropertyImages((prevDel) => {
          if (!prevDel.includes(removedUrl)) return [...prevDel, removedUrl];
          return prevDel;
        });
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleRemoveSitePlan = () => {
    if (sitePlanPreview?.length > 0 && sitePlanPreview?.startsWith("http")) {
      setRemovedSitePlans((prev) => [...prev, sitePlanPreview]);
    }
    setPropertyData((prev) => ({ ...prev, SitePlan: {} as File }));
    setSitePlanPreview("");
  };

  const validateForm = () => {
    const newErrors: ErrorInterface = {};
    if (!propertyData?.propertyName?.trim()) newErrors.propertyName = "Property Name is required";
    if (propertyData?.Email?.trim() && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(propertyData.Email))
      newErrors.Email = "Invalid email format";
    if (!propertyData?.ContactNumber?.trim()) newErrors.ContactNumber = "Contact No is required";
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }

    setSaving(true);
    const formData = new FormData();
    if (propertyData.Campaign) formData.append("Campaign", propertyData.Campaign?.name);
    if (propertyData.PropertyType) formData.append("PropertyType", propertyData.PropertyType?.name);
    if (propertyData.propertyName) formData.append("propertyName", propertyData.propertyName);
    if (propertyData.PropertySubtype) formData.append("PropertySubType", propertyData.PropertySubtype?.name);
    if (propertyData.ContactNumber) formData.append("ContactNumber", trimCountryCodeHelper(propertyData.ContactNumber));
    if (propertyData.City) formData.append("City", propertyData.City?.name);
    if (propertyData.Location) formData.append("Location", propertyData.Location?.name);
    if (propertyData.SubLocation) formData.append("SubLocation", propertyData.SubLocation?.name);
    if (propertyData.Area) formData.append("Area", propertyData.Area);
    if (propertyData.Address) formData.append("Adderess", propertyData.Address);
    if (propertyData.Email) formData.append("Email", propertyData.Email);
    if (propertyData.Facilities) formData.append("Facillities", propertyData.Facilities);
    if (propertyData.ReferenceId) formData.append("ReferenceId", propertyData.ReferenceId);
    if (propertyData.PropertyId) formData.append("PropertyId", propertyData.PropertyId);
    if (propertyData.PropertyDate) formData.append("PropertyDate", propertyData.PropertyDate);
    if (propertyData.PropertyYear) formData.append("PropertyYear", propertyData.PropertyYear);
    if (propertyData.Price) formData.append("Price", propertyData.Price);
    if (propertyData.URL) formData.append("URL", propertyData.URL);
    if (propertyData.Other) formData.append("Other", propertyData.Other);
    if (propertyData.Description) formData.append("Description", propertyData.Description);
    if (propertyData.Video) formData.append("Video", propertyData.Video);
    if (propertyData.GoogleMap) formData.append("GoogleMap", propertyData.GoogleMap);
    if (propertyData.Verified) formData.append("Verified", propertyData.Verified);
    if (Array.isArray(propertyData.PropertyImage)) {
      propertyData.PropertyImage.forEach((file) => formData.append("PropertyImage", file));
    }
    if (propertyData.SitePlan && (propertyData.SitePlan as any).name) {
      formData.append("SitePlan", propertyData.SitePlan);
    }
    formData.append("removedPropertyImages", JSON.stringify(removedPropertyImages));
    formData.append("removedSitePlans", JSON.stringify(removedSitePlans));
    formData.append("PropertyFields", JSON.stringify(customFields));

    const result = await updateProperty(id as string, formData);
    setSaving(false);
    if (result) {
      toast.success("Property updated successfully!");
      router.push("/property");
    } else {
      toast.error("Update failed");
    }
  };

  const objectFields = [
    { key: "Campaign", fetchFn: getCampaign },
    { key: "PropertyType", staticData: [] },
    { key: "PropertySubtype", staticData: [] },
    { key: "City", fetchFn: getCity },
    { key: "Location", staticData: [] },
    { key: "SubLocation", staticData: [] },
  ];

  const arrayFields = [
    { key: "Verified", staticData: ["yes", "no"] },
    { key: "Gender", staticData: ["male", "female", "other"] },
    { key: "Facilities", fetchFn: getFacilities },
    { key: "ReferenceId", fetchFn: getReferences },
    { key: "Price", fetchFn: getPrice },
  ];

  useEffect(() => {
    const loadFieldOptions = async () => {
      await handleFieldOptionsObject(objectFields, setFieldOptions);
      await handleFieldOptions(arrayFields, setFieldOptions);
    };
    loadFieldOptions();
  }, []);

  useEffect(() => {
    if (propertyData.Campaign.id) fetchPropertyType(propertyData.Campaign.id);
    else setFieldOptions((prev) => ({ ...prev, PropertyType: [] }));
    if (propertyData.Campaign.id && propertyData.PropertyType.id)
      fetchPropertySubType(propertyData.Campaign.id, propertyData.PropertyType.id);
    else setFieldOptions((prev) => ({ ...prev, PropertySubtype: [] }));
    if (propertyData.City.id) fetchLocation(propertyData.City.id);
    else setFieldOptions((prev) => ({ ...prev, Location: [] }));
    if (propertyData.City.id && propertyData.Location.id)
      fetchSubLocation(propertyData.City.id, propertyData.Location.id);
    else setFieldOptions((prev) => ({ ...prev, SubLocation: [] }));
  }, [propertyData.Campaign.id, propertyData.PropertyType.id, propertyData.City.id, propertyData.Location.id]);

  const fetchPropertyType = async (campaignId: string) => {
    try { const res = await getTypesByCampaign(campaignId); setFieldOptions((prev) => ({ ...prev, PropertyType: res || [] })); }
    catch { setFieldOptions((prev) => ({ ...prev, PropertyType: [] })); }
  };
  const fetchLocation = async (cityId: string) => {
    try { const res = await getLocationByCity(cityId); setFieldOptions((prev) => ({ ...prev, Location: res || [] })); }
    catch { setFieldOptions((prev) => ({ ...prev, Location: [] })); }
  };
  const fetchSubLocation = async (cityId: string, locationId: string) => {
    try { const res = await getsubLocationByCityLoc(cityId, locationId); setFieldOptions((prev) => ({ ...prev, SubLocation: res || [] })); }
    catch { setFieldOptions((prev) => ({ ...prev, SubLocation: [] })); }
  };
  const fetchPropertySubType = async (campaignId: string, propertytypeId: string) => {
    try { const res = await getSubtypeByCampaignAndType(campaignId, propertytypeId); setFieldOptions((prev) => ({ ...prev, PropertySubtype: res || [] })); }
    catch { setFieldOptions((prev) => ({ ...prev, PropertySubtype: [] })); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center page-bg px-4">
      <div className="text-center">
        <div className="w-10 h-10 sm:w-12 sm:h-12 border-[3px] border-[var(--color-primary-light)] border-t-[var(--color-primary)] rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[var(--color-primary)] font-semibold font-['DM_Sans'] text-sm sm:text-base">Loading property...</p>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        .playfair { font-family: 'Playfair Display', serif; }

        /* ── Light Mode Base ───────────────────────────────────────────── */
        .page-bg {
          background-color: var(--color-primary-lighter);
          background-image:
            radial-gradient(circle at 8% 15%, rgba(0,104,56,0.05) 0%, transparent 35%),
            radial-gradient(circle at 92% 85%, rgba(52,211,153,0.07) 0%, transparent 35%),
            radial-gradient(circle at 50% 50%, rgba(209,242,225,0.4) 0%, transparent 70%);
        }

        .top-nav {
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--color-primary-light);
          box-shadow: 0 1px 12px rgba(0,104,56,0.06);
        }

        .hero-banner {
          background: linear-gradient(135deg, var(--color-primary-darker) 0%, var(--color-primary) 55%, var(--color-secondary) 100%);
          position: relative;
          overflow: hidden;
        }
        .hero-banner::before {
          content: '';
          position: absolute;
          top: -80px; right: -80px;
          width: 320px; height: 320px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(52,211,153,0.15), transparent 70%);
          pointer-events: none;
        }
        .hero-banner::after {
          content: '';
          position: absolute;
          bottom: -60px; left: -30px;
          width: 240px; height: 240px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.06), transparent 70%);
          pointer-events: none;
        }

        .progress-bar { background: var(--color-primary-dark); }

        /* ── Section Card ─────────────────────────────────────────────── */
        .section-card {
          background: #ffffff;
          border: 1px solid var(--color-primary-light);
          box-shadow: 0 2px 12px rgba(0,104,56,0.06);
        }
        .section-card-topbar {
          background: linear-gradient(90deg, var(--color-primary), var(--color-accent), transparent);
        }

        /* ── Section Header texts ─────────────────────────────────────── */
        .section-title    { color: var(--color-secondary-darker); }
        .section-subtitle { color: var(--color-gray); }
        .section-divider  {
          height: 1px;
          background: linear-gradient(90deg, var(--color-primary-light), transparent);
        }

        /* ── Footer action bar ────────────────────────────────────────── */
        .footer-bar {
          background: #ffffff;
          border: 1px solid var(--color-primary-light);
          box-shadow: 0 2px 12px rgba(0,104,56,0.06);
        }
        .footer-note { color: var(--color-gray); }

        /* ── Upload Zone ──────────────────────────────────────────────── */
        .upload-zone {
          border: 2px dashed var(--color-primary-light);
          background: var(--color-primary-lighter);
        }
        .upload-zone:hover {
          border-color: var(--color-primary) !important;
          background: rgba(209,242,225,0.6) !important;
        }
        .upload-icon-wrap { background: var(--color-primary-light); }
        .upload-label     { color: var(--color-primary-dark); }
        .upload-hint      { color: var(--color-gray); }
        .preview-img      { border: 2px solid var(--color-primary-light); }

        /* ── Buttons ──────────────────────────────────────────────────── */
        .step-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 3px 10px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          background: rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.9);
          border: 1px solid rgba(255,255,255,0.2);
          backdrop-filter: blur(8px);
        }
        @media (min-width: 640px) {
          .step-pill { padding: 4px 14px; font-size: 11px; }
        }

        .save-btn {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, var(--color-primary), var(--color-secondary-darker));
          color: #fff;
          font-weight: 600;
          border-radius: 10px;
          transition: all 0.25s ease;
          box-shadow: 0 3px 14px rgba(0,104,56,0.28);
        }
        .save-btn:hover {
          box-shadow: 0 6px 22px rgba(0,104,56,0.4);
          transform: translateY(-1px);
        }
        .save-btn:active { transform: translateY(0px); }
        .save-btn::after {
          content: '';
          position: absolute;
          top: 0; left: -100%; width: 55%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
          transition: left 0.45s;
        }
        .save-btn:hover::after { left: 130%; }

        .discard-btn {
          background: #fff;
          border: 1.5px solid var(--color-primary-light);
          color: var(--color-primary-dark);
          font-weight: 500;
          border-radius: 10px;
          transition: all 0.2s;
        }
        .discard-btn:hover {
          border-color: var(--color-primary);
          background: var(--color-primary-lighter);
          color: var(--color-primary);
        }

        .nav-back-btn {
          color: var(--color-primary);
          font-weight: 500;
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
          padding: 6px 10px;
          border-radius: 8px;
        }
        .nav-back-btn:hover {
          background: var(--color-primary-lighter);
          gap: 10px;
        }
        @media (min-width: 640px) {
          .nav-back-btn { font-size: 14px; }
        }

        .nav-brand-text { color: var(--color-secondary-darker); }
        .progress-item  { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.75); }

        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }


        /* ════════════════════════════════════════════════════════════════
           DARK MODE OVERRIDES
           ════════════════════════════════════════════════════════════════ */

        .dark .page-bg {
          background-color: #080f0b;
          background-image:
            radial-gradient(circle at 8% 15%,  rgba(0,104,56,0.12) 0%, transparent 35%),
            radial-gradient(circle at 92% 85%, rgba(0,104,56,0.08) 0%, transparent 35%),
            radial-gradient(circle at 50% 50%,  rgba(0,60,30,0.25) 0%, transparent 70%);
        }

        /* ── Top Nav ── */
        .dark .top-nav {
          background: rgba(8,15,11,0.97);
          border-bottom-color: #1a3828;
          box-shadow: 0 1px 12px rgba(0,0,0,0.4);
        }
        .dark .nav-back-btn {
          color: #6ee7a0;
        }
        .dark .nav-back-btn:hover {
          background: rgba(0,104,56,0.2);
          color: #a7f3ca;
        }
        .dark .nav-brand-text {
          color: #a7f3ca;
        }

        /* ── Progress bar ── */
        .dark .progress-bar { background: #030a06; }
        .dark .progress-item {
          background: rgba(0,104,56,0.25);
          color: rgba(180,230,200,0.8);
        }

        /* ── Section Cards ── */
        .dark .section-card {
          background: #0c1d14;
          border-color: #1a3828;
          box-shadow: 0 2px 18px rgba(0,0,0,0.35);
        }
        .dark .section-card-topbar {
          background: linear-gradient(90deg, var(--color-primary), rgba(52,211,153,0.6), transparent);
        }

        /* ── Section Header texts ── */
        .dark .section-title    { color: #c8edda; }
        .dark .section-subtitle { color: #6aaa86; }
        .dark .section-divider  { background: linear-gradient(90deg, #1a3828, transparent); }

        /* ── Footer bar ── */
        .dark .footer-bar {
          background: #0c1d14;
          border-color: #1a3828;
          box-shadow: 0 2px 18px rgba(0,0,0,0.35);
        }
        .dark .footer-note { color: #6aaa86; }

        /* ── Upload Zone ── */
        .dark .upload-zone {
          border-color: #1a3828;
          background: #091410;
        }
        .dark .upload-zone:hover {
          border-color: var(--color-primary) !important;
          background: rgba(0,104,56,0.15) !important;
        }
        .dark .upload-icon-wrap { background: rgba(0,104,56,0.25); }
        .dark .upload-label     { color: #a7f3ca; }
        .dark .upload-hint      { color: #5a8a6e; }
        .dark .preview-img      { border-color: #1a3828; }

        /* ── Discard button ── */
        .dark .discard-btn {
          background: #0c1d14;
          border-color: #1a3828;
          color: #a7f3ca;
        }
        .dark .discard-btn:hover {
          border-color: var(--color-primary);
          background: rgba(0,104,56,0.2);
          color: #c8edda;
        }

        /* ── Save btn shadow boost in dark ── */
        .dark .save-btn {
          box-shadow: 0 3px 14px rgba(0,104,56,0.45);
        }
        .dark .save-btn:hover {
          box-shadow: 0 6px 24px rgba(0,104,56,0.6);
        }
      `}</style>

      <div className="min-h-screen page-bg">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#fff",
              color: "var(--color-secondary-darker)",
              border: "1px solid var(--color-primary-light)",
              borderRadius: "12px",
              boxShadow: "0 4px 24px rgba(0,104,56,0.12)",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px",
              maxWidth: "90vw",
            },
          }}
        />

        {/* ── Sticky Top Nav ── */}
        <div className="sticky top-0 z-50 top-nav">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between">
            <button onClick={() => router.push("/property")} className="nav-back-btn">
              <ArrowLeft size={14} className="sm:w-[15px] sm:h-[15px]" />
              <span className="hidden sm:inline">Back to Properties</span>
              <span className="sm:hidden">Back</span>
            </button>

            <div className="flex items-center gap-2 sm:gap-2.5">
              <div
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center shadow-sm"
                style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary-darker))" }}
              >
                <Building2 size={13} className="sm:w-[15px] sm:h-[15px] text-white" />
              </div>
              <span className="nav-brand-text font-bold text-xs sm:text-sm hidden sm:inline">
                Property Manager
              </span>
            </div>

            <button
              onClick={handleSubmit}
              disabled={saving}
              className="save-btn flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm disabled:opacity-60"
            >
              {saving
                ? <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <Save size={12} className="sm:w-[13px] sm:h-[13px]" />
              }
              <span className="hidden sm:inline">{saving ? "Updating..." : "Update Property"}</span>
              <span className="sm:hidden">{saving ? "..." : "Save"}</span>
            </button>
          </div>
        </div>

        {/* ── Hero Banner ── */}
        <div className="hero-banner">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
              <div className="min-w-0">
                <div className="step-pill mb-3 sm:mb-4">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--color-accent)" }} />
                  Hotel Management System
                </div>
                <h1 className="playfair text-2xl sm:text-4xl font-bold text-white leading-tight">
                  Edit{" "}
                  <span style={{ color: "var(--color-accent)" }}>Property</span>
                </h1>
                <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm max-w-md" style={{ color: "rgba(255,255,255,0.6)" }}>
                  Modify the details below to update this property listing in your management system.
                </p>
              </div>
              <div className="hidden sm:flex flex-col gap-2.5 flex-shrink-0">
                <div
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium"
                  style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.12)" }}
                >
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--color-accent)" }} />
                  Editing Mode
                </div>
                <div
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium"
                  style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.12)" }}
                >
                  <Building2 size={11} />
                  6 sections to review
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Section Progress Strip ── */}
        <div className="progress-bar overflow-x-auto scrollbar-hide">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3 flex items-center gap-3 sm:gap-5 min-w-max">
            {[
              { label: "Campaign",   icon: <Building2 size={10} /> },
              { label: "Identity",   icon: <User size={10} /> },
              { label: "Location",   icon: <MapPin size={10} /> },
              { label: "Pricing",    icon: <DollarSign size={10} /> },
              { label: "Media",      icon: <ImageIcon size={10} /> },
              { label: "Additional", icon: <Layers size={10} /> },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                <div className="progress-item flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-semibold">
                  {item.icon}
                  <span className="hidden sm:inline">{item.label}</span>
                </div>
                {i < 5 && <ChevronRight size={10} style={{ color: "rgba(255,255,255,0.25)", flexShrink: 0 }} />}
              </div>
            ))}
          </div>
        </div>

        {/* ── Form Body ── */}
        <form onSubmit={(e) => e.preventDefault()} className="max-w-7xl mx-auto px-3 sm:px-6 py-5 sm:py-8 space-y-4 sm:space-y-6">

          {/* Section 1 — Campaign */}
          <SectionCard>
            <SectionHeader icon={<Building2 size={14} className="sm:w-4 sm:h-4" />} title="Campaign & Classification" subtitle="Assign a campaign and categorize this property" step={1} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <ObjectSelect
                options={Array.isArray(fieldOptions?.Campaign) ? fieldOptions.Campaign : []}
                label={getLabel("Campaign", "Campaign")}
                value={propertyData.Campaign.id}
                getLabel={(item) => item?.Name || ""}
                getId={(item) => item?._id || ""}
                onChange={(selectedId) => {
                  const selectedObj = fieldOptions.Campaign.find((i) => i._id === selectedId);
                  if (selectedObj) setPropertyData((prev) => ({ ...prev, Campaign: { id: selectedObj._id, name: selectedObj.Name }, PropertyType: { id: "", name: "" } }));
                }}
                error={errors.Campaign}
              />
              <ObjectSelect
                options={Array.isArray(fieldOptions?.PropertyType) ? fieldOptions.PropertyType : []}
                label={getLabel("PropertyType", "Property Type")}
                value={propertyData.PropertyType.id}
                getLabel={(item) => item?.Name || ""}
                getId={(item) => item?._id || ""}
                onChange={(selectedId) => {
                  const selectedObj = fieldOptions.PropertyType.find((i) => i._id === selectedId);
                  if (selectedObj) setPropertyData((prev) => ({ ...prev, PropertyType: { id: selectedObj._id, name: selectedObj.Name }, PropertySubtype: { id: "", name: "" } }));
                }}
                error={errors.PropertyType}
              />
              <ObjectSelect
                options={Array.isArray(fieldOptions?.PropertySubtype) ? fieldOptions.PropertySubtype : []}
                label={getLabel("PropertySubType", "Property Subtype")}
                value={propertyData.PropertySubtype.id}
                getLabel={(item) => item?.Name || ""}
                getId={(item) => item?._id || ""}
                onChange={(selectedId) => {
                  const selectedObj = fieldOptions.PropertySubtype.find((i) => i._id === selectedId);
                  if (selectedObj) setPropertyData((prev) => ({ ...prev, PropertySubtype: { id: selectedObj._id, name: selectedObj.Name } }));
                }}
                error={errors.PropertySubtype}
              />
            </div>
          </SectionCard>

          {/* Section 2 — Identity */}
          <SectionCard>
            <SectionHeader icon={<User size={14} className="sm:w-4 sm:h-4" />} title="Property Identity" subtitle="Name, contact, and primary identifiers" step={2} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <InputField label={getLabel("propertyName", "Property Name")} name="propertyName" value={propertyData.propertyName} onChange={handleInputChange} error={errors.propertyName} />
              <InputField label={getLabel("ContactNumber", "Contact No")} name="ContactNumber" value={propertyData.ContactNumber} onChange={handleInputChange} error={errors.ContactNumber} />
              <InputField label={getLabel("Email", "Email")} name="Email" value={propertyData.Email} onChange={handleInputChange} error={errors.Email} />
              <InputField label={getLabel("PropertyId", "Property ID")} name="PropertyId" value={propertyData.PropertyId} onChange={handleInputChange} />
              <SingleSelect options={Array.isArray(fieldOptions?.ReferenceId) ? fieldOptions.ReferenceId : []} label={getLabel("ReferenceId", "Reference Id")} value={propertyData.ReferenceId} onChange={(v) => handleSelectChange("ReferenceId", v)} />
              <SingleSelect options={Array.isArray(fieldOptions?.Verified) ? fieldOptions.Verified : []} label={getLabel("Verified", "Verified")} value={propertyData.Verified} onChange={(v) => handleSelectChange("Verified", v)} />
            </div>
          </SectionCard>

          {/* Section 3 — Location */}
          <SectionCard>
            <SectionHeader icon={<MapPin size={14} className="sm:w-4 sm:h-4" />} title="Location Details" subtitle="Where is this property situated?" step={3} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <ObjectSelect
                options={Array.isArray(fieldOptions?.City) ? fieldOptions.City : []}
                label={getLabel("City", "City")}
                value={propertyData.City.id}
                getLabel={(item) => item?.Name || ""}
                getId={(item) => item?._id || ""}
                onChange={(selectedId) => {
                  const selectedObj = fieldOptions.City.find((i) => i._id === selectedId);
                  if (selectedObj) setPropertyData((prev) => ({ ...prev, City: { id: selectedObj._id, name: selectedObj.Name }, Location: { id: "", name: "" }, SubLocation: { id: "", name: "" } }));
                }}
                error={errors.City}
              />
              <ObjectSelect
                options={Array.isArray(fieldOptions?.Location) ? fieldOptions.Location : []}
                label={getLabel("Location", "Location")}
                value={propertyData.Location.id}
                getLabel={(item) => item?.Name || ""}
                getId={(item) => item?._id || ""}
                onChange={(selectedId) => {
                  const selectedObj = fieldOptions.Location.find((i) => i._id === selectedId);
                  if (selectedObj) setPropertyData((prev) => ({ ...prev, Location: { id: selectedObj._id, name: selectedObj.Name }, SubLocation: { id: "", name: "" } }));
                }}
                error={errors.Location}
              />
              <ObjectSelect
                options={Array.isArray(fieldOptions?.SubLocation) ? fieldOptions.SubLocation : []}
                label={getLabel("SubLocation", "Sub Location")}
                value={propertyData.SubLocation.id}
                getLabel={(item) => item?.Name || ""}
                getId={(item) => item?._id || ""}
                onChange={(selectedId) => {
                  const selectedObj = fieldOptions.SubLocation.find((i) => i._id === selectedId);
                  if (selectedObj) setPropertyData((prev) => ({ ...prev, SubLocation: { id: selectedObj._id, name: selectedObj.Name } }));
                }}
                error={errors.SubLocation}
              />
              <InputField label={getLabel("Area", "Area")} name="Area" value={propertyData.Area} onChange={handleInputChange} />
              <InputField className="sm:col-span-2 lg:col-span-1" label={getLabel("Address", "Address")} name="Address" value={propertyData.Address} onChange={handleInputChange} />
              <InputField label={getLabel("GoogleMap", "Google Map")} name="GoogleMap" value={propertyData.GoogleMap} onChange={handleInputChange} />
            </div>
          </SectionCard>

          {/* Section 4 — Pricing */}
          <SectionCard>
            <SectionHeader icon={<DollarSign size={14} className="sm:w-4 sm:h-4" />} title="Pricing & Property Details" subtitle="Rates, dates, and additional attributes" step={4} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <SingleSelect options={Array.isArray(fieldOptions?.Price) ? fieldOptions.Price : []} label={getLabel("Price", "Price")} value={propertyData.Price} onChange={(v) => handleSelectChange("Price", v)} />
              <SingleSelect options={Array.isArray(fieldOptions?.Facilities) ? fieldOptions.Facilities : []} label={getLabel("Facillities", "Facilities")} value={propertyData.Facilities} onChange={(v) => handleSelectChange("Facilities", v)} />
              <InputField label={getLabel("PropertyYear", "Property Year")} name="PropertyYear" value={propertyData.PropertyYear} onChange={handleInputChange} />
              <DateSelector label={getLabel("PropertyDate", "Property Date")} value={propertyData.PropertyDate} onChange={(val) => handleSelectChange("PropertyDate", val)} />
              <InputField label={getLabel("URL", "URL")} name="URL" value={propertyData.URL ?? ""} onChange={handleInputChange} />
              <InputField label={getLabel("Video", "Video")} name="Video" value={propertyData.Video} onChange={handleInputChange} />
              <InputField label={getLabel("Other", "Others")} name="Other" value={propertyData.Other} onChange={handleInputChange} />
              <div className="sm:col-span-2 lg:col-span-3">
                <TextareaField label={getLabel("Description", "Description")} name="Description" value={propertyData.Description} onChange={handleInputChange} />
              </div>
            </div>
          </SectionCard>

          {/* Section 5 — Media */}
          <SectionCard>
            <SectionHeader icon={<ImageIcon size={14} className="sm:w-4 sm:h-4" />} title="Media & Visuals" subtitle="Upload property images and site plans" step={5} />
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
              <FileUpload label={getLabel("PropertyImage", "Property Images")} multiple previews={imagePreviews} onChange={(e) => handleFileChange(e, "PropertyImage")} onRemove={handleRemoveImage} />
              <FileUpload label={getLabel("SitePlan", "Site Plan")} previews={sitePlanPreview ? [sitePlanPreview] : []} onChange={(e) => handleFileChange(e, "SitePlan")} onRemove={handleRemoveSitePlan} />
            </div>
          </SectionCard>

          {/* Section 6 — Additional */}
          {Object.keys(customFields).length > 0 && (
            <SectionCard>
              <SectionHeader icon={<Layers size={14} className="sm:w-4 sm:h-4" />} title="Additional Information" subtitle="Dynamic fields configured for your organization" step={6} />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {Object.keys(customFields).map((key) => (
                  <InputField
                    key={key}
                    label={key}
                    name={key}
                    value={customFields[key]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                      handleCustomInputChange(key, e.target.value)
                    }
                  />
                ))}
              </div>
            </SectionCard>
          )}

          {/* ── Footer Actions ── */}
          <div className="footer-bar flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 sm:gap-0 py-4 sm:py-5 px-4 sm:px-8 rounded-xl sm:rounded-2xl">
            <p className="footer-note text-[11px] sm:text-xs text-center sm:text-left">
              <span style={{ color: "var(--color-destructive)", fontWeight: 700 }}>* </span>
              Required fields must be filled before saving
            </p>
            <div className="flex items-center gap-2 sm:gap-3 justify-center sm:justify-end">
              <button
                type="button"
                onClick={() => router.push("/property")}
                className="discard-btn px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm flex-1 sm:flex-none"
              >
                Discard
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={saving}
                className="save-btn flex items-center justify-center gap-1.5 sm:gap-2 px-5 sm:px-8 py-2 sm:py-2.5 text-xs sm:text-sm disabled:opacity-60 flex-1 sm:flex-none"
              >
                {saving
                  ? <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <ChevronRight size={12} className="sm:w-[14px] sm:h-[14px]" />
                }
                <span className="hidden sm:inline">{saving ? "Updating Property..." : "Update Property"}</span>
                <span className="sm:hidden">{saving ? "Updating..." : "Update"}</span>
              </button>
            </div>
          </div>

        </form>
      </div>
    </>
  );
}