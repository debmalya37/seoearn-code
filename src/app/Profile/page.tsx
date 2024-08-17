"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { FiUser, FiMail, FiPhone, FiCalendar, FiMapPin, FiUserPlus, FiCreditCard } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import profilepicDemo from "../../assets/rcb-pic-logo.jpeg";
import CountrySelect from "../../components/CountrySelect";
import Select from 'react-select';

const Profile = () => {
  const { data: session, status } = useSession();
  const { register, handleSubmit, setValue, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | ArrayBuffer | null>(profilepicDemo);
  const [dob, setDob] = useState<Date | null>(null);
  const [age, setAge] = useState<number | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  const [country, setCountry] = useState<string | null>(null);
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [paymentId, setPaymentId] = useState<string>("");
  const [paymentPreference, setPaymentPreference] = useState<string>("");
  // const [username, setUsername] = useState<string>("");
  const [referralCode, setReferralCode] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" }
  ];

  const countryCodeOptions = [
    { value: "1", label: "+1" },
    { value: "91", label: "+91" },
    { value: "44", label: "+44" },
    // Add more country codes as needed
  ];

  const paymentPreferenceOptions = [
    { value: "paypal", label: "PayPal" },
    { value: "credit_card", label: "Credit Card" },
    { value: "bank_transfer", label: "Bank Transfer" }
    // Add more payment preferences as needed
  ];

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/profile`);
      setValue("Profile", response.data.loading);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [setValue]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("/api/profile");
        if (response.status === 200) {
          const user = response.data.user;
          const parsedDob = new Date(user.dob); // Ensure the date is properly parsed
          setValue("name", user.name);
          setValue("email", user.email);
          setValue("username", user.username);
          setValue("phoneNumber", user.phoneNumber);
          setValue("country", user.country);
          setValue("gender", user.gender);
          setDob(isNaN(parsedDob.getTime()) ? null : parsedDob); // Handle invalid dates
          setAge(isNaN(parsedDob.getTime()) ? null : calculateAge(parsedDob));
          setValue("profilePicture", user.profilePicture);
          setValue("referralCode", user.referralCode);
          setValue("paymentId", user.paymentId || "");
          setValue("paymentPreference", user.paymentPreference || "");
          setReferralCode(user.referralCode);
          setProfilePicture(user.profilePicture || profilepicDemo);
          setPaymentId(user.paymentId || "");
          setPaymentPreference(user.paymentPreference || "");
          setPhoneNumber(user.phoneNumber || "");
          setCountryCode(user.countryCode || "");
          setGender(user.gender || "");
          setCountry(user.country || "");
          // const newReferralCode = generateReferralCode(user.username, user.phoneNumber);
          // setReferralCode(newReferralCode);
          // setValue("referralCode", newReferralCode);
        } else {
          setError("Failed to fetch user data");
        }
      } catch (error) {
        console.error(error);
        setError("Failed to fetch user data");
      }
    };
  
    if (session) {
      fetchUserProfile();
    }
  }, [setValue, session]);

  const calculateAge = (dob: Date) => {
    const ageDifMs = Date.now() - dob.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      data.phoneNumber = `${countryCode}${phoneNumber}`;
      data.paymentId = paymentId;
      data.paymentPreference = paymentPreference;
      data.age = age;
      data.gender = gender;
      data.countryCode = countryCode;
      data.dob = dob;
      data.country = country;
      data.referralCode = referralCode;
      
      const response = await axios.post("/api/profile", data);

      if (response.status !== 200) {
        throw new Error(`Error: ${response.statusText}`);
      }

      setSuccess("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const copyReferralLink = () => {
    if (referralCode) {
      const referralLink = `${window.location.origin}/sign-in?ref=${referralCode}`;
      navigator.clipboard.writeText(referralLink).then(
        () => {
          setSuccess("Referral link copied to clipboard");
        },
        (err) => {
          setError("Failed to copy referral link");
        }
      );
    }
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return <p>Please log in to view your profile.</p>;
  }

  return (
    <div className="flex flex-col items-center mt-0 bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-400">
      <div className="bg-gradient-to-r from-green-200 via-orange-100 to-green-100 rounded-lg shadow-2xl p-8 w-full max-w-4xl mt-10 mb-5">
        <h1 className="text-3xl font-bold mb-8 text-center">User Profile</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2">
                <span className="text-gray-800 flex items-center">
                  <FiUser className="mr-2" />
                  Name
                </span>
                <input
                  type="text"
                  className="form-input mt-1 block w-full"
                  {...register("name")}
                  disabled
                />
              </label>
              <label className="block mb-2">
                <span className="text-gray-800 flex items-center">
                  <FiMail className="mr-2" />
                  Email
                </span>
                <input
                  type="email"
                  className="form-input mt-1 block w-full"
                  {...register("email")}
                  disabled
                />
              </label>
              <label className="block mb-2">
                <span className="text-gray-800 flex items-center">
                  <FiUser className="mr-2" />
                  Username
                </span>
                <input
                  type="text"
                  className="form-input mt-1 block w-full"
                  {...register("username")}
                  disabled
                />
              </label>
              <label className="block mb-2">
                <span className="text-gray-800 flex items-center">
                  <FiPhone className="mr-2" />
                  Phone Number
                </span>
                <div className="flex">
                  <Select
                    className="w-20 mr-2"
                    options={countryCodeOptions}
                    value={countryCodeOptions.find(option => option.value === countryCode)}
                    onChange={(selectedOption) => setCountryCode(selectedOption?.value || null)}
                  />
                  <input
                    type="text"
                    className="form-input mt-1 block w-full"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              </label>
              <label className="block mb-2">
                <span className="text-gray-800 flex items-center">
                  <FiCalendar className="mr-2" />
                  Date of Birth
                </span>
                <DatePicker
                  selected={dob}
                  onChange={(date: Date | null) => {
                    if (date) {
                      setDob(date);
                      setAge(calculateAge(date));
                    } else {
                      setDob(null);
                      setAge(null);
                    }
                  }}
                  dateFormat="dd/MM/yyyy"
                  className="form-input mt-1 block w-full"
                />
              </label>
              <label className="block mb-2">
                <span className="text-gray-800 flex items-center">
                  <FiUser className="mr-2" />
                  Gender
                </span>
                <Select
                  options={genderOptions}
                  value={genderOptions.find(option => option.value === gender)}
                  onChange={(selectedOption) => setGender(selectedOption?.value || null)}
                />
              </label>
              <label className="block mb-2">
                <span className="text-gray-800 flex items-center">
                  <FiMapPin className="mr-2" />
                  Country
                </span>
                <CountrySelect
                  value={country || ""}
                  onChange={(selectedCountry) => setCountry(selectedCountry || null)}
                />
              </label>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-indigo-500">
                <Image
                  src={profilePicture as string}
                  alt="Profile Picture"
                  layout="fill"
                  objectFit="cover"
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleProfilePictureChange}
                  className="hidden"
                  accept="image/*"
                />
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="absolute inset-0 bg-black bg-opacity-50 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300"
                >
                  Change Picture
                </button>
              </div>
              <div className="text-center mt-4">
                <label className="block mb-2">
                  <span className="text-gray-800 flex items-center">
                    <FiUserPlus className="mr-2" />
                    Referral Code
                  </span>
                  <div className="flex">
                  <input
                      type="text"
                      className="form-input mt-1 block w-full"
                      {...register("referralCode")}
                      value={referralCode || ""}
                      disabled
                    />
                    <button
                      type="button"
                      className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                      onClick={copyReferralLink}
                    >
                      Copy Link
                    </button>
                  </div>
                </label>
                <label className="block mb-2">
                  <span className="text-gray-800 flex items-center">
                    <FiCreditCard className="mr-2" />
                    Payment ID
                  </span>
                  <input
                    type="text"
                    className="form-input mt-1 block w-full"
                    value={paymentId}
                    onChange={(e) => setPaymentId(e.target.value)}
                  />
                </label>
                <label className="block mb-2">
                  <span className="text-gray-800 flex items-center">
                    <FiCreditCard className="mr-2" />
                    Payment Preference
                  </span>
                  <Select
                  options={paymentPreferenceOptions}
                  value={paymentPreferenceOptions.find(option => option.value === paymentPreference)}
                  onChange={(selectedOption) => setPaymentPreference(selectedOption?.value || "")}
                  className="form-input mt-1 block w-full"
                  placeholder="Select payment preference"
                />
                </label>
              </div>
            </div>
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="bg-indigo-500 text-white px-6 py-2 rounded-md hover:bg-indigo-600 transition duration-300"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </form>
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        {success && <p className="text-green-500 mt-4 text-center">{success}</p>}
      </div>
    </div>
  );
};

export default Profile;
