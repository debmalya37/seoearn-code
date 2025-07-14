'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useToast } from '@src/components/ui/use-toast';
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";

import {
  FiUser, FiMail, FiPhone, FiCalendar,
  FiMapPin, FiUserPlus, FiCreditCard, FiShield
} from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import profilepicDemo from "../../assets/rcb-pic-logo.jpeg";
import CountrySelect from "../../components/CountrySelect";
import Select from 'react-select';
import Sidebar from "@src/components/Sidebar";

export default function Profile() {
  const { data: session, status } = useSession();
  const { register, handleSubmit, setValue } = useForm();
  const [loading, setLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string|ArrayBuffer|null>(profilepicDemo);
  const [dob, setDob] = useState<Date|null>(null);
  const [age, setAge] = useState<number|null>(null);
  const [gender, setGender] = useState<string|null>(null);
  const [country, setCountry] = useState<string|null>(null);
  const [countryCode, setCountryCode] = useState<string|null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(true);
const [showOTPInput, setShowOTPInput] = useState(false);
const [otpInput, setOtpInput] = useState("");
const [verifyingOTP, setVerifyingOTP] = useState(false);

  const [paymentId, setPaymentId] = useState<string>("");
  const [paymentPreference, setPaymentPreference] = useState<string>("");
  const [referralCode, setReferralCode] = useState<string|null>(null);
  const fileInputRef = useRef<HTMLInputElement|null>(null);
  const { toast } = useToast();
  
const [kycLoading, setKycLoading] = useState(false);
const [idFront, setIdFront] = useState<File | null>(null);
const [idBack,  setIdBack ] = useState<File | null>(null);
const [selfie,  setSelfie ] = useState<File | null>(null);
const [isHidden, setIsHidden] = useState<boolean>(false);


  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" }
  ];
  const countryCodeOptions = [
    { value: "1", label: "+1" }, { value: "91", label: "+91" }, { value: "44", label: "+44" }
  ];
  const paymentPreferenceOptions = [
    { value: "payeer", label: "Payeer" },
    // { value: "credit_card", label: "Credit Card" },
    // { value: "bank_transfer", label: "Bank Transfer" }
  ];

  const calculateAge = (d: Date) => {
    const diff = Date.now() - d.getTime();
    return Math.abs(new Date(diff).getUTCFullYear() - 1970);
  };

  function renderKycForm() {
    return (
      <form onSubmit={handleKycSubmit} className="space-y-4">
    <label className="flex flex-col">
      <span className="font-medium flex items-center">
        Front of Government ID <span className="text-red-500 ml-1">*</span>
      </span>
      <input
        type="file"
        accept="image/*"
        onChange={e => setIdFront(e.target.files?.[0] || null)}
        className="mt-1"
      />
    </label>
    <label className="flex flex-col">
      <span className="font-medium flex items-center">
        Back of Government ID (optional)
      </span>
      <input
        type="file"
        accept="image/*"
        onChange={e => setIdBack(e.target.files?.[0] || null)}
        className="mt-1"
      />
    </label>
    <label className="flex flex-col">
      <span className="font-medium flex items-center">
        Selfie Holding Your ID <span className="text-red-500 ml-1">*</span>
      </span>
      <input
        type="file"
        accept="image/*"
        onChange={e => setSelfie(e.target.files?.[0] || null)}
        className="mt-1"
      />
    </label>
    <p className="text-sm text-gray-500">
      All documents must be clear and unedited. We’ll review them within 24–48 hours.
    </p>
    <button
      type="submit"
      disabled={kycLoading}
      className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
    >
      {kycLoading ? 'Submitting…' : 'Submit for Review'}
    </button>
  </form>
    );
  }
  

  const [kycInfo, setKycInfo] = useState<{
       kycStatus: string;
       notes: string;
     }>({ kycStatus: "not_submitted", notes: "" });
     const [loadingKycInfo, setLoadingKycInfo] = useState(true);
    
      useEffect(() => {
        if (status !== "authenticated") return;
        fetch("/api/profile/kyc-status")
          .then((r) => r.json())
          .then((data) => {
            if (data.success) {
              setKycInfo({
                kycStatus: data.kycStatus,
                notes: data.notes,
              });
            }
          })
          .finally(() => setLoadingKycInfo(false));
      }, [status]);
 

  async function handleKycSubmit(e: React.FormEvent) {
    e.preventDefault();
  
    if (!idFront || !selfie) {
      toast({ title: 'ID front and selfie are required', variant: 'destructive' });
      return;
    }
  
    setKycLoading(true);
    try {
      const form = new FormData();
      form.append('idFront', idFront);
      if (idBack) form.append('idBack', idBack);
      form.append('selfie', selfie);
  
      const { data } = await axios.post('/api/profile/kyc', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
  
      if (data.success) {
        toast({ title: 'KYC submitted, awaiting review', variant: 'default' });
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setKycLoading(false);
    }
  }

  useEffect(() => {
    if (status !== "authenticated") return;
    setLoading(true);
    axios.get("/api/profile")
      .then(res => {
        const u = res.data.user;
        setValue("name", u.username);
        setValue("email", u.email);
        setValue("username", u.username);
        setValue("referralCode", u.referralCode);
        setProfilePicture(u.profilePicture || profilepicDemo);
        setPhoneNumber(u.phoneNumber || "");
        setCountryCode(u.countryCode || "");
        setGender(u.gender || "");
        setIsHidden(u.isHidden || false);

        setIsEmailVerified(u.isEmailVerified || false);
        setCountry(u.country || "");
        if (u.dob) {
          const d = new Date(u.dob);
          setDob(d);
          setAge(calculateAge(d));
        }
        setPaymentId(u.paymentId || "");
        setPaymentPreference(u.paymentPreference || "");
        setReferralCode(u.referralCode);
      })
      .finally(() => setLoading(false));
  }, [status, setValue]);

  const onProfileSubmit = async (data: any) => {
    setLoading(true);
    try {
      data.phoneNumber = `${countryCode}${phoneNumber}`;
      data.dob = dob;
      data.name = name;
      data.age = age;
      data.gender = gender;
      data.country = country;
      data.paymentId = paymentId;
      data.paymentPreference = paymentPreference;
      data.referralCode = referralCode;
      await axios.post("/api/profile", data);
      toast({ title: "Profile updated", variant: "default" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();
  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setProfilePicture(r.result);
    r.readAsDataURL(f);
  };

  if (status === "loading") return <div className="p-8">Loading…</div>;
  if (status === "unauthenticated") return <div className="p-8">Please log in.</div>;

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>

        {/* Personal Info Card */}
        <section className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>
          <div className="flex items-center space-x-6 mb-6">
            <div className="relative w-24 h-24">
              <Image
                src={profilePicture as string}
                alt="Profile"
                fill
                className="rounded-full object-cover"
              />
              <button
                type="button"
                onClick={triggerFileInput}
                className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 hover:bg-blue-700 shadow"
              >
                ✎
              </button>
              {/* <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handlePictureChange}
                className="hidden"
              /> */}
            </div>
            <div className="flex-1">
              <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex flex-col">
                    <span className="font-medium flex items-center">
                      <FiUser className="mr-2"/> Name
                    </span>
                    <input
                      {...register("username")}
                      disabled={!isEmailVerified}
                      className="mt-1 p-2 border rounded focus:ring"
                    />
                  </label>
                  <label className="flex flex-col">
                    <span className="font-medium flex items-center">
                      <FiMail className="mr-2"/> Email
                    </span>
                    <input
                      {...register("email")}
                      disabled
                      className="mt-1 p-2 border rounded focus:ring"
                    />
                  </label>
                  {!isEmailVerified && (
  <div className="mt-2">
    <button
      onClick={async () => {
        await axios.post("/api/email/send-otp");
        toast({ title: "OTP sent to your email" });
        setShowOTPInput(true);
      }}
      className="text-sm text-blue-100 hover:underline"
    >
      Verify Email to Enable Form
    </button>
    {showOTPInput && (
      <div className="mt-2 flex items-center space-x-2">
        <input
          type="text"
          value={otpInput}
          onChange={(e) => setOtpInput(e.target.value)}
          placeholder="Enter OTP"
          className="p-2 border rounded"
        />
        <button
          onClick={async () => {
            setVerifyingOTP(true);
            try {
              const res = await axios.post("/api/email/verify-otp", { otp: otpInput });
              if (res.data.success) {
                toast({ title: "Email verified" });
                setIsEmailVerified(true);
                setShowOTPInput(false);
              }
            } catch (e: any) {
              toast({ title: "Invalid OTP", description: e.message, variant: "destructive" });
            } finally {
              setVerifyingOTP(false);
            }
          }}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          {verifyingOTP ? "Verifying…" : "Verify"}
        </button>
      </div>
    )}
  </div>
)}

                  <label className="flex flex-col">
                    <span className="font-medium flex items-center">
                      <FiPhone className="mr-2"/> Phone
                    </span>
                    <div className="flex space-x-2">
                      <Select
                        options={countryCodeOptions}
                        value={countryCodeOptions.find(o=>o.value===countryCode)}
                        onChange={o=>setCountryCode(o?.value||null)}
                        className="flex-1"
                      />
                      <input
                        value={phoneNumber}
                        onChange={e=>setPhoneNumber(e.target.value)}
                        className="flex-2 mt-1 p-2 border rounded focus:ring w-full"
                      />
                    </div>
                  </label>
                  <label className="flex items-center mt-4">
  <input
    type="checkbox"
    checked={isHidden}
    onChange={(e) => setIsHidden(e.target.checked)}
    className="mr-2"
    disabled={!isEmailVerified}
  />
  <span className="text-sm">Hide my profile from public</span>
</label>

                  <label className="flex flex-col">
                    <span className="font-medium flex items-center">
                      <FiCalendar className="mr-2"/> DOB
                    </span>
                    <DatePicker
                      selected={dob}
                      onChange={d=>{ setDob(d); if(d) setAge(calculateAge(d)); }}
                      className="mt-1 p-2 border rounded focus:ring w-full"
                    />
                  </label>
                  <label className="flex flex-col">
                    <span className="font-medium flex items-center">
                      <FiUser className="mr-2"/> Gender
                    </span>
                    <Select
                      options={genderOptions}
                      value={genderOptions.find(o=>o.value===gender)}
                      onChange={o=>setGender(o?.value||null)}
                      className="mt-1"
                    />
                  </label>
                  <label className="flex flex-col">
                    <span className="font-medium flex items-center">
                      <FiMapPin className="mr-2"/> Country
                    </span>
                    <div className="mt-1">
                      <CountrySelect
                        value={country||""}
                        onChange={c=>setCountry(c||null)}
                      />
                    </div>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
                >
                  {loading ? "Saving…" : "Save Changes"}
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Billing & Referrals Card */}
        <section className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Billing & Referrals</h2>
          <p className="text-sm text-gray-500 mb-4">
  Your payment ID and preferred payout method must match your Payer/PayPal account exactly.
</p>
          <div className="space-y-4">
            <label className="flex flex-col">
              <span className="font-medium flex items-center">
                <FiCreditCard className="mr-2"/> Payment ID
              </span>
              <input
    value={paymentId}
    disabled={!isEmailVerified}
    onChange={e => setPaymentId(e.target.value)}
    className="mt-1 w-full p-2 border rounded focus:ring focus:border-indigo-500"
    placeholder="e.g. P1234567 or paypal@example.com"
  />
  {!paymentId.match(/^P\d{6,}|.+@.+\..+$/) && (
    <p className="text-sm text-red-600 mt-1">
      Must be a valid Payeer ID (P1234567) or email address.
    </p>
  )}
            </label>
            <label className="flex flex-col">
              <span className="font-medium flex items-center">
                <FiCreditCard className="mr-2"/> Preferred Method
              </span>
              <Select
                options={paymentPreferenceOptions}
                
                value={paymentPreferenceOptions.find(o=>o.value===paymentPreference)}
                onChange={o=>setPaymentPreference(o?.value||"")}
                className="mt-1"
              />
            </label>
            <label className="flex flex-col">
              <span className="font-medium flex items-center">
                <FiUserPlus className="mr-2"/> Referral Code
              </span>
              <div className="flex space-x-2">
                <input
                  value={referralCode||""}
                  disabled
                  className="flex-1 mt-1 p-2 border rounded focus:ring"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/signup?ref=${referralCode}`)
                    toast({ title: "Link copied!" })
                  }}
                  className="mt-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                >
                  Copy Link
                </button>
              </div>
            </label>
          </div>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
  <p className="text-yellow-800">
    <strong>Heads up:</strong> If your payment ID or method is incorrect, withdrawals will be delayed or may fail.
  </p>
</div>

        </section>

        {/* KYC Verification Card */}
        {/* KYC Verification Card */}
<section className="bg-white rounded-xl shadow p-6">
  <h2 className="text-2xl font-semibold mb-4 flex items-center">
    <FiShield className="mr-2"/> Identity Verification
  </h2>

  {loadingKycInfo ? (
    <p>Loading KYC status…</p>
  ) : kycInfo.kycStatus === "verified" ? (
    <div className="p-4 bg-green-50 border border-green-200 rounded">
      🎉 Your identity is <strong>verified</strong>.
    </div>
  ) : kycInfo.kycStatus === "pending" ? (
    <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
      ⏳ Your documents are under review.
    </div>
  ) : kycInfo.kycStatus === "rejected" ? (
    <div className="space-y-2">
      <div className="p-4 bg-red-50 border border-red-200 rounded">
        ❌ Your submission was rejected:
        <blockquote className="italic text-sm text-red-700 mt-2">
          {kycInfo.notes}
        </blockquote>
      </div>
      {/* Allow re‑submission */}
      {renderKycForm()}
    </div>
  ) : (
    // not_submitted
    renderKycForm()
  )}
</section>


      </main>
    </div>
  );
}
