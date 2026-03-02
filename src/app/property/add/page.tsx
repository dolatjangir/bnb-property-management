'use client'

import { useState, useCallback, useEffect } from "react";
import SingleSelect from "@/app/component/SingleSelect";
import DateSelector from "@/app/component/DateSelector";
import toast, { Toaster } from "react-hot-toast";
import { ArrowLeft, X, Building2, MapPin, User, DollarSign, Image as ImageIcon, Layers, ChevronRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { addProperty, getFilteredProperty } from "@/store/property";
import { propertyAllDataInterface } from "@/store/property.interface";
import { getCampaign } from "@/store/masters/campaign/campaign";
import { getTypesByCampaign } from "@/store/masters/types/types";
import { getCity } from "@/store/masters/city/city";
import { getLocationByCity } from "@/store/masters/location/location";
import { handleFieldOptions } from "@/app/utils/handleFieldOptions";
import { getSubtypeByCampaignAndType } from "@/store/masters/subtype/subtype";
import { getFacilities } from "@/store/masters/facilities/facilities";
import { handleFieldOptionsObject } from "@/app/utils/handleFieldOptionsObject";
import ObjectSelect from "@/app/component/ObjectSelect";
import InputField from "@/app/component/datafields/InputField";
import TextareaField from "@/app/component/datafields/TextareaField";
import { trimCountryCodeHelper } from "@/app/utils/trimCountryCodeHelper";
import { getsubLocationByCityLoc } from "@/store/masters/sublocation/sublocation";
import { getReferences } from "@/store/masters/references/references";
import { getPrice } from "@/store/masters/price/price";
import { getPropertyFields } from "@/store/masters/propertyfields/propertyfields";
import { usePropertyFieldLabel } from "@/context/property/PropertyFieldLabelContext";

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
  <div className="flex items-center gap-4 mb-8">
    <div className="relative flex-shrink-0">
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shadow-md"
        style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary-darker))" }}
      >
        <span className="text-white">{icon}</span>
      </div>
      <div
        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shadow-sm"
        style={{ background: "var(--color-accent)" }}
      >
        {step}
      </div>
    </div>
    <div className="flex-1">
      <h2 className="text-[15px] font-bold tracking-wide" style={{ color: "var(--color-secondary-darker)", fontFamily: "'Playfair Display', serif" }}>
        {title}
      </h2>
      <p className="text-xs mt-0.5" style={{ color: "var(--color-gray)" }}>{subtitle}</p>
    </div>
    <div className="flex-shrink-0 h-px flex-1 hidden md:block" style={{ background: "linear-gradient(90deg, var(--color-primary-light), transparent)", maxWidth: "120px" }} />
  </div>
);

// ─── Section Card ─────────────────────────────────────────────────────────────
const SectionCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div
    className={`relative rounded-2xl p-8 max-sm:p-5 ${className}`}
    style={{ background: "#ffffff", border: "1px solid var(--color-primary-light)", boxShadow: "0 2px 12px rgba(0,104,56,0.06)" }}
  >
    <div className="absolute top-0 left-8 right-8 h-[3px] rounded-b-full" style={{ background: "linear-gradient(90deg, var(--color-primary), var(--color-accent), transparent)" }} />
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
  <div className="flex flex-col gap-3 flex-1 min-w-[200px]">
    <label className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "var(--color-primary)" }}>
      {label}
    </label>
    <div
      className="upload-zone relative flex flex-col items-center justify-center gap-1.5 h-32 rounded-xl cursor-pointer transition-all duration-300"
      style={{ border: "2px dashed var(--color-primary-light)", background: "var(--color-primary-lighter)" }}
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-1" style={{ background: "var(--color-primary-light)" }}>
        <ImageIcon size={18} style={{ color: "var(--color-primary)" }} />
      </div>
      <span className="text-xs font-semibold" style={{ color: "var(--color-primary-dark)" }}>
        {multiple ? "Click to upload images" : "Click to upload file"}
      </span>
      <span className="text-[10px]" style={{ color: "var(--color-gray)" }}>PNG, JPG, PDF supported</span>
      <input type="file" multiple={multiple} onChange={onChange} className="absolute inset-0 opacity-0 cursor-pointer" />
    </div>
    {previews.length > 0 && (
      <div className="flex flex-wrap gap-3 mt-1">
        {previews.map((src, index) => (
          <div key={index} className="relative group">
            <img src={src} alt={`preview-${index}`} className="w-20 h-20 object-cover rounded-xl shadow-sm" style={{ border: "2px solid var(--color-primary-light)" }} />
            {onRemove && (
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="absolute -top-2 -right-2 w-5 h-5 text-white rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-all"
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

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PropertyAdd() {
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
    Price: "",
    URL: "",
    Description: "",
    Video: "",
    GoogleMap: "",
    Verified: "",
    PropertyImage: [],
    SitePlan: {} as File,
  });
  const [fieldOptions, setFieldOptions] = useState<Record<string, any[]>>({});
  const [customFields, setCustomFields] = useState<CustomFieldsType>({});
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [sitePlanPreview, setSitePlanPreview] = useState<string>("");
  const [errors, setErrors] = useState<ErrorInterface>({});
  const [saving, setSaving] = useState(false);
  const { getLabel } = usePropertyFieldLabel();
  const router = useRouter();

  const getPropertyFieldsFunc = async () => {
    const data = await getPropertyFields();
    const activeFields = data.filter((e: any) => e.Status === "Active");
    const fieldsObj: CustomFieldsType = {};
    activeFields.forEach((field: any) => { fieldsObj[field.Name] = ""; });
    setCustomFields(fieldsObj);
  };

  useEffect(() => { getPropertyFieldsFunc(); }, []);

  const handleContactExist = async (contactNo: string) => {
    const duplicate = await isContactNoExist(contactNo);
    if (duplicate) return;
  };

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      if (name === "ContactNumber") handleContactExist(value);
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
    setPropertyData((prev) => ({ ...prev, PropertyImage: prev.PropertyImage.filter((_, i) => i !== index) }));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveSitePlan = () => {
    setPropertyData((prev) => ({ ...prev, SitePlan: {} as File }));
    setSitePlanPreview("");
  };

  const validateForm = () => {
    const newErrors: ErrorInterface = {};
    if (!propertyData.Campaign?.name.trim()) newErrors.Campaign = "Campaign is required";
    if (!propertyData.propertyName.trim()) newErrors.propertyName = "Property Name is required";
    if (propertyData.Email.trim() && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(propertyData.Email))
      newErrors.Email = "Invalid email format";
    if (!propertyData.ContactNumber.trim()) newErrors.ContactNumber = "Contact No is required";
    if (propertyData.ContactNumber && propertyData.ContactNumber.trim().length < 10)
      newErrors.ContactNumber = "Contact No should atlest be 10 digit";
    return newErrors;
  };

  const isContactNoExist = async (contactNo: string) => {
    if (contactNo.trim().length > 0 && contactNo.trim().length < 10) {
      setErrors((prev) => ({ ...prev, ContactNumber: "Contact No should at least 10 digits" }));
      return true;
    }
    if (contactNo.trim().length === 0) return false;
    const res = await getFilteredProperty(`Keyword=${contactNo}`);
    const isExist = res.length;
    if (isExist && isExist > 0) {
      setErrors((prev) => ({ ...prev, ContactNumber: "Contact No already exists" }));
      return true;
    }
    return false;
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    setSaving(true);
    const formData = new FormData();
    if (propertyData.Campaign) formData.append("Campaign", propertyData.Campaign.name);
    if (propertyData.PropertyType) formData.append("PropertyType", propertyData.PropertyType.name);
    if (propertyData.propertyName) formData.append("propertyName", propertyData.propertyName);
    if (propertyData.PropertySubtype) formData.append("PropertySubType", propertyData.PropertySubtype?.name);
    if (propertyData.ContactNumber) formData.append("ContactNumber", trimCountryCodeHelper(propertyData.ContactNumber));
    if (propertyData.City) formData.append("City", propertyData.City.name);
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
    formData.append("updatedAt", new Date().toISOString());
    if (Array.isArray(propertyData.PropertyImage)) {
      propertyData.PropertyImage.forEach((file) => formData.append("PropertyImage", file));
    }
    if (propertyData.SitePlan && (propertyData.SitePlan as any).name) {
      formData.append("SitePlan", propertyData.SitePlan);
    }
    formData.append("PropertyFields", JSON.stringify(customFields));
    const result = await addProperty(formData);
    setSaving(false);
    if (result) {
      toast.success("Property added successfully!");
      router.push("/property");
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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        .playfair { font-family: 'Playfair Display', serif; }

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

        .progress-bar {
          background: var(--color-primary-dark);
        }

        .step-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 14px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          background: rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.9);
          border: 1px solid rgba(255,255,255,0.2);
          backdrop-filter: blur(8px);
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

        .back-btn {
          color: rgba(255,255,255,0.8);
          font-weight: 500;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
        }
        .back-btn:hover { color: #fff; gap: 10px; }

        .nav-back-btn {
          color: var(--color-primary);
          font-weight: 500;
          font-size: 14px;
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

        .upload-zone:hover {
          border-color: var(--color-primary) !important;
          background: rgba(209,242,225,0.6) !important;
        }

        .section-step-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 10px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          background: var(--color-primary-lighter);
          color: var(--color-primary);
          border: 1px solid var(--color-primary-light);
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
            },
          }}
        />

        {/* ── Sticky Top Nav ── */}
        <div className="sticky top-0 z-50 top-nav">
          <div className="max-w-7xl mx-auto px-2 sm:px-6 py-3 flex items-center justify-between">
            <button onClick={() => router.push("/property")} className="nav-back-btn">
              <ArrowLeft size={15}  className="hidden sm:block"/>
              <span className="hidden sm:block">Back to Properties</span>
               <span className="save-btn flex  items-center justify-center gap-1 p-2 sm:hidden"><ArrowLeft size={15} />Back </span>

            </button>

            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shadow-sm"
                style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary-darker))" }}
              >
                <Building2 size={15} className="text-white" />
              </div>
              <span className="font-bold text-sm hidden sm:block" style={{ color: "var(--color-secondary-darker)" }}>
                Property Manager
              </span>
            </div>

            <button
              onClick={handleSubmit}
              disabled={saving}
              className="save-btn hidden sm:flex items-center gap-2 px-5 py-2.5 text-sm disabled:opacity-60"
            >
              {saving
                ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <Sparkles size={13} />
              }
              {saving ? "Saving..." : "Save Property"}
            </button>
            {/* for mobile screen */}
              <button
              onClick={handleSubmit}
              disabled={saving}
              className="save-btn flex sm:hidden items-center justify-center gap-2 px-5 py-2.5 text-sm disabled:opacity-60"
            >
              {saving
                ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <Sparkles size={13} />
              }
              {saving ? "Saving..." : "Save "}
            </button>
          </div>
        </div>

        {/* ── Hero Banner ── */}
        <div className="hero-banner">
          <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">
            <div className="flex items-center justify-between gap-6">
              <div>
                <div className="step-pill mb-4">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--color-accent)" }} />
                  Hotel Management System
                </div>
                <h1 className="playfair text-4xl max-sm:text-2xl font-bold text-white leading-tight">
                  Register New{" "}
                  <span style={{ color: "var(--color-accent)" }}>Property</span>
                </h1>
                <p className="mt-2 text-sm max-w-md" style={{ color: "rgba(255,255,255,0.6)" }}>
                  Complete the form below to add a new property listing to your management system.
                </p>
              </div>
              <div className="max-sm:hidden flex flex-col gap-2.5 flex-shrink-0">
                <div
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium"
                  style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.12)" }}
                >
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--color-accent)" }} />
                  Draft in progress
                </div>
                <div
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium"
                  style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.12)" }}
                >
                  <Building2 size={11} />
                  6 sections to complete
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Section Progress Strip ── */}
        <div className="progress-bar">
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-5 overflow-x-auto scrollbar-hide">
            {[
              { label: "Campaign", icon: <Building2 size={10} /> },
              { label: "Identity", icon: <User size={10} /> },
              { label: "Location", icon: <MapPin size={10} /> },
              { label: "Pricing", icon: <DollarSign size={10} /> },
              { label: "Media", icon: <ImageIcon size={10} /> },
              { label: "Additional", icon: <Layers size={10} /> },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 flex-shrink-0">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold" style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.75)" }}>
                  {item.icon}
                  {item.label}
                </div>
                {i < 5 && <ChevronRight size={10} style={{ color: "rgba(255,255,255,0.25)", flexShrink: 0 }} />}
              </div>
            ))}
          </div>
        </div>

        {/* ── Form Body ── */}
        <form onSubmit={(e) => e.preventDefault()} className="max-w-7xl mx-auto px-6 py-8 space-y-6">

          {/* Section 1 — Campaign */}
          <SectionCard>
            <SectionHeader icon={<Building2 size={16} />} title="Campaign & Classification" subtitle="Assign a campaign and categorize this property" step={1} />
            <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-1">
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
            <SectionHeader icon={<User size={16} />} title="Property Identity" subtitle="Name, contact, and primary identifiers" step={2} />
            <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-1">
              <InputField label={getLabel("propertyName", "Property Name")} name="propertyName" value={propertyData.propertyName} onChange={handleInputChange} error={errors.propertyName} />
              <InputField label={getLabel("ContactNumber", "Contact No")} name="ContactNumber" value={propertyData.ContactNumber} onChange={handleInputChange} error={errors.ContactNumber} />
              <InputField className="max-sm:hidden" label={getLabel("Email", "Email")} name="Email" value={propertyData.Email} onChange={handleInputChange} error={errors.Email} />
              <InputField className="max-sm:hidden" label={getLabel("PropertyId", "Property ID")} name="PropertyId" value={propertyData.PropertyId} onChange={handleInputChange} />
              <SingleSelect className="max-sm:hidden" options={Array.isArray(fieldOptions?.ReferenceId) ? fieldOptions.ReferenceId : []} label={getLabel("ReferenceId", "Reference Id")} value={propertyData.ReferenceId} onChange={(v) => handleSelectChange("ReferenceId", v)} />
              <SingleSelect className="max-sm:hidden" options={Array.isArray(fieldOptions?.Verified) ? fieldOptions.Verified : []} label={getLabel("Verified", "Verified")} value={propertyData.Verified} onChange={(v) => handleSelectChange("Verified", v)} />
            </div>
          </SectionCard>

          {/* Section 3 — Location */}
          <SectionCard>
            <SectionHeader icon={<MapPin size={16} />} title="Location Details" subtitle="Where is this property situated?" step={3} />
            <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-1">
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
              <InputField className="max-sm:hidden" label={getLabel("Area", "Area")} name="Area" value={propertyData.Area} onChange={handleInputChange} />
              <InputField className="max-sm:hidden col-span-2 max-lg:col-span-1" label={getLabel("Address", "Address")} name="Address" value={propertyData.Address} onChange={handleInputChange} />
              <InputField className="max-sm:hidden" label={getLabel("GoogleMap", "Google Map")} name="GoogleMap" value={propertyData.GoogleMap} onChange={handleInputChange} />
            </div>
          </SectionCard>

          {/* Section 4 — Pricing */}
          <SectionCard>
            <SectionHeader icon={<DollarSign size={16} />} title="Pricing & Property Details" subtitle="Rates, dates, and additional attributes" step={4} />
            <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-1">
              <SingleSelect className="max-sm:hidden" options={Array.isArray(fieldOptions?.Price) ? fieldOptions.Price : []} label={getLabel("Price", "Price")} value={propertyData.Price} onChange={(v) => handleSelectChange("Price", v)} />
              <SingleSelect className="max-sm:hidden" options={Array.isArray(fieldOptions?.Facilities) ? fieldOptions.Facilities : []} label={getLabel("Facillities", "Facilities")} value={propertyData.Facilities} onChange={(v) => handleSelectChange("Facilities", v)} />
              <InputField className="max-sm:hidden" label={getLabel("PropertyYear", "Property Year")} name="PropertyYear" value={propertyData.PropertyYear} onChange={handleInputChange} />
              <div className="max-sm:hidden">
                <DateSelector label={getLabel("PropertyDate", "Property Date")} value={propertyData.PropertyDate} onChange={(val) => handleSelectChange("PropertyDate", val)} />
              </div>
              <InputField className="max-sm:hidden" label={getLabel("URL", "URL")} name="URL" value={propertyData.URL ?? ""} onChange={handleInputChange} />
              <InputField className="max-sm:hidden" label={getLabel("Video", "Video")} name="Video" value={propertyData.Video} onChange={handleInputChange} />
              <InputField className="max-sm:hidden" label={getLabel("Other", "Others")} name="Others" value={propertyData.Other} onChange={handleInputChange} />
              <TextareaField label={getLabel("Description", "Description")} name="Description" value={propertyData.Description} onChange={handleInputChange} />
            </div>
          </SectionCard>

          {/* Section 5 — Media */}
          <SectionCard>
            <SectionHeader icon={<ImageIcon size={16} />} title="Media & Visuals" subtitle="Upload property images and site plans" step={5} />
            <div className="flex flex-wrap gap-8">
              <FileUpload label={getLabel("PropertyImage", "Property Images")} multiple previews={imagePreviews} onChange={(e) => handleFileChange(e, "PropertyImage")} onRemove={handleRemoveImage} />
              <FileUpload label={getLabel("SitePlan", "Site Plan")} previews={sitePlanPreview ? [sitePlanPreview] : []} onChange={(e) => handleFileChange(e, "SitePlan")} onRemove={handleRemoveSitePlan} />
            </div>
          </SectionCard>

          {/* Section 6 — Additional */}
          {Object.keys(customFields).length > 0 && (
            <SectionCard>
              <SectionHeader icon={<Layers size={16} />} title="Additional Information" subtitle="Dynamic fields configured for your organization" step={6} />
              <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-1">
                {Object.keys(customFields).map((key) => (
                  <InputField
                    key={key}
                    className="max-sm:hidden"
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
          <div
            className="flex items-center justify-between py-5 px-8 rounded-2xl max-sm:flex-col max-sm:gap-4 max-sm:px-5"
            style={{ background: "#fff", border: "1px solid var(--color-primary-light)", boxShadow: "0 2px 12px rgba(0,104,56,0.06)" }}
          >
            <p className="text-xs" style={{ color: "var(--color-gray)" }}>
              <span style={{ color: "var(--color-destructive)", fontWeight: 700 }}>* </span>
              Required fields must be filled before saving
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.push("/property")}
                className="discard-btn px-6 py-2.5 text-sm"
              >
                Discard
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={saving}
                className="save-btn hidden sm:flex items-center gap-2 px-8 py-2.5 text-sm disabled:opacity-60"
              >
                {saving
                  ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <ChevronRight size={14} />
                }
                {saving ? "Saving Property..." : "Save Property"}
              </button>
              {/* for mobile screen */}
                <button
                type="button"
                onClick={handleSubmit}
                disabled={saving}
                className="save-btn flex sm:hidden items-center gap-2 px-8 py-2.5 text-sm disabled:opacity-60"
              >
                {saving
                  ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <ChevronRight size={14} />
                }
                {saving ? "Saving Property..." : "Save "}
              </button>
            </div>
          </div>

        </form>
      </div>
    </>
  );
}