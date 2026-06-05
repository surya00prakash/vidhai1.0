'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useAuthApi } from '@/hooks/useAuthApi';
import { apiClient } from '@/services/apiClient';
import { useRazorpay, RazorpayOptions } from '@/hooks/useRazorpay';
import * as T from '@/types/agaram.types';

// HeroUI Imports
import {
  Button,
  Card,
  CardBody,
  Input,
  Tabs,
  Tab,
  Checkbox,
  Divider,
  Skeleton,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  CardFooter,
  Select,
  SelectItem,
} from "@heroui/react";

// Icons
import {
  GraduationCap,
  Lightbulb,
  User,
  Target,
  Users,
  ArrowRight,
} from 'lucide-react';
import ForeignDonorForm from '@/components/join-us/ForeignDonorForm';
import KnowMoreModal from '@/components/donations/KnowMoreModal';
import { LuMapPin } from 'react-icons/lu';

// --- HELPERS ---
const logError = (msg: string, error: any) => {
  if (process.env.NODE_ENV === 'development') {
  }
};

const getCategoryIcon = (categoryName: string) => {
  const lower = categoryName.toLowerCase();
  if (lower.includes('academic')) return <GraduationCap size={20} />;
  if (lower.includes('learning')) return <Lightbulb size={20} />;
  if (lower.includes('individual')) return <User size={20} />;
  if (lower.includes('corpus')) return <Target size={20} />;
  if (lower.includes('collective')) return <Users size={20} />;
  return <GraduationCap size={20} />;
};

// --- TYPES ---
type GroupedCategories = Record<string, T.DonationCategory[]>;

// Define a local extended type to handle 'notes' safely
type ExtendedRazorpayOptions = RazorpayOptions & {
  notes?: Record<string, string>;
};

interface DonationFormData {
  name: string;
  email: string;
  mobile: string;
  pan: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  isAlumni: boolean;
  alumniYear: string;
  alumniCollege: string;
}

const INITIAL_FORM_DATA: DonationFormData = {
  name: '',
  email: '',
  mobile: '',
  pan: '',
  address: '',
  city: '',
  state: '',
  country: 'India',
  pincode: '',
  isAlumni: false,
  alumniYear: '',
  alumniCollege: '',
};

const DEFAULT_MAX_QUANTITY = 10;
const DEFAULT_MIN_QUANTITY = 1;

// --- COMPONENT ---
export default function DonationPage() {
  const { auth, isLoading: isAuthLoading } = useAuth();
  const authenticatedFetch = useAuthApi();
  const router = useRouter();
  const isRazorpayLoaded = useRazorpay();
  const alertModal = useDisclosure();

  // --- STATE ---
  const [oneTimeCreds, setOneTimeCreds] = useState<T.PaymentGatewayCredentials | null>(null);
  const [recurringCreds, setRecurringCreds] = useState<T.PaymentGatewayCredentials | null>(null);
  const [rawOneTimeCategories, setRawOneTimeCategories] = useState<T.DonationCategory[]>([]);
  const [rawRecurringCategories, setRawRecurringCategories] = useState<T.DonationCategory[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const [selectedTab, setSelectedTab] = useState<"once" | "monthly" | "foreign">("once");
  const [selectedItemOnce, setSelectedItemOnce] = useState<T.DonationCategory | null>(null);
  const [selectedItemMonthly, setSelectedItemMonthly] = useState<T.DonationCategory | null>(null);

  const [customAmount, setCustomAmount] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [subscribeYear, setSubscribeYear] = useState(1);
  const [durationMonths, setDurationMonths] = useState(12);

  const [formData, setFormData] = useState<DonationFormData>(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [isProcessing, setIsProcessing] = useState(false);
  const [isKnowMoreOpen, setIsKnowMoreOpen] = useState(false);
  const [message, setMessage] = useState('');

  // --- MEMOIZED LOGIC ---

  const activeCategories = useMemo(() => {
    return selectedTab === 'monthly' ? rawRecurringCategories : rawOneTimeCategories;
  }, [selectedTab, rawRecurringCategories, rawOneTimeCategories]);

  const groupedCategories = useMemo(() => {
    return activeCategories.reduce((acc, item) => {
      if (!acc[item.categoryName]) acc[item.categoryName] = [];
      acc[item.categoryName].push(item);
      return acc;
    }, {} as GroupedCategories);
  }, [activeCategories]);

  const selectedItem = selectedTab === 'monthly' ? selectedItemMonthly : selectedItemOnce;

  const finalAmount = useMemo(() => {
    if (customAmount && selectedTab === 'once') return Number(customAmount) || 0;
    if (!selectedItem) return 0;

    if (selectedItem.isQuantitySelection && selectedTab === 'once') {
      return (selectedItem.amount || 0) * (quantity || 1);
    }
    if (selectedItem.isShowYear && selectedTab === 'once') {
      return (selectedItem.amount || 0) * (subscribeYear || 1);
    }

    return selectedItem.amount || 0;
  }, [customAmount, selectedItem, quantity, subscribeYear, selectedTab]);

  // Calculate Alumni Years List (Optimized)
  const alumniYearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const startYear = 2010;
    return Array.from(
      { length: currentYear - startYear + 1 },
      (_, i) => String(currentYear - i)
    );
  }, []);

  // --- HANDLERS ---

  const handleInputChange = (field: keyof DonationFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when typing
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleAmountClick = useCallback((item: T.DonationCategory) => {
    if (selectedTab === 'monthly') {
      setSelectedItemMonthly(item);
    } else {
      setSelectedItemOnce(item);
      setCustomAmount('');
      setQuantity(1);
      setSubscribeYear(1);
    }
    // Clear amount error
    setFormErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.amount;
      return newErrors;
    });
  }, [selectedTab]);

  const handleCustomAmountChange = (val: string) => {
    setCustomAmount(val);
    setQuantity(1);
    setSubscribeYear(1);

    const customItem = rawOneTimeCategories.find(item => item.isCustomAllowed);
    setSelectedItemOnce(customItem || null);
  };

  const handleQuantityChange = (delta: number, item?: T.DonationCategory) => {
    setQuantity(prev => {
      const maxQ = item?.maxQuantity ?? selectedItem?.maxQuantity ?? DEFAULT_MAX_QUANTITY;
      const minQ = DEFAULT_MIN_QUANTITY;
      const newValue = prev + delta;
      return Math.min(Math.max(newValue, minQ), maxQ);
    });
  };


  // --- DATA FETCHING ---

  useEffect(() => {
    // Don't run logic until auth state is known
    if (isAuthLoading) return;

    if (!auth.userId) {
      router.replace('/login'); // Use replace to prevent history stacking
      return;
    }

    let isMounted = true;

    const initData = async () => {
      setDataLoading(true);
      try {
        const [catData, oneTimeCredsData, recurringCredsData] = await Promise.all([
          authenticatedFetch(token => apiClient.getDonationCategories(token)),
          authenticatedFetch(token => apiClient.getOneTimePaymentCredentials(token)),
          authenticatedFetch(token => apiClient.getRecurringPaymentCredentials(token)),
        ]);

        if (!isMounted) return;

        setOneTimeCreds(oneTimeCredsData);
        setRecurringCreds(recurringCredsData);
        setRawOneTimeCategories(catData.oneTime || []);
        setRawRecurringCategories(catData.monthly || []);

        // Fetch Profile Data
        try {
          const profileData = await authenticatedFetch(token => apiClient.getUserProfile(auth.userId!, token));

          if (isMounted && profileData) {
            setFormData(prev => ({
              ...prev,
              name: profileData.fullName || '',
              email: profileData.email || '',
              mobile: profileData.phoneNumber ? profileData.phoneNumber.replace('+91', '') : '',
            }));
          }
        } catch (profileError) {
          logError("Profile pre-fill failed", profileError);
        }

      } catch (error: any) {
        logError('Failed to load donation data', error);
        if (isMounted) {
          setMessage('Could not load donation info. Please refresh the page.');
        }
      } finally {
        if (isMounted) setDataLoading(false);
      }
    };

    initData();

    return () => { isMounted = false; };
  }, [isAuthLoading, auth.userId, router, authenticatedFetch]);

  // --- VALIDATION ---

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    const { name, mobile, pan, address, city, state, country, pincode, isAlumni, alumniYear, alumniCollege } = formData;

    if (!name.match(/^[a-zA-Z\s]+$/)) errors.name = 'Name can only contain letters and spaces.';
    if (!mobile.match(/^[0-9]{6,15}$/)) errors.mobile = 'Invalid mobile. Digits only.';
    if (!pan.match(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i)) errors.pan = 'Invalid PAN format.';
    if (address.length < 1) errors.address = 'Address is required.';
    if (!city.match(/^[a-zA-Z\s]+$/)) errors.city = 'City required.';
    if (!state.match(/^[a-zA-Z\s]+$/)) errors.state = 'State required.';
    if (!country.match(/^[a-zA-Z\s]+$/)) errors.country = 'Country required.';
    if (!pincode.match(/^[0-9]{6}$/)) errors.pincode = 'Pincode must be 6 digits.';

    if (finalAmount < 100) {
      errors.amount = 'Donation must be at least ₹100.';
      alertModal.onOpen();
    }
    if (!selectedItem) errors.amount = 'Please select a donation option.';

    if (isAlumni) {
      if (!alumniYear) errors.alumniYear = 'Please select a year.';
      if (!alumniCollege || !alumniCollege.match(/^[a-zA-Z\s]+$/)) errors.alumniCollege = 'College name required.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // --- PAYMENTS ---

  const handlePayment = async () => {
    setMessage('');
    if (!validateForm()) {
      setMessage('Please fill all the required fields correctly.');
      document.getElementById('donor-details-form')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (!isRazorpayLoaded) {
      setMessage('Payment gateway is loading. Please wait.');
      return;
    }

    setIsProcessing(true);
    setMessage('Processing...');

    try {
      if (selectedTab === 'monthly') {
        await handleRecurringPayment();
      } else {
        await handleOneTimePayment();
      }
    } catch (error: any) {
      const msg = error instanceof Error ? error.message : 'Transaction failed. Please try again.';
      setMessage(msg);
      setIsProcessing(false);
    }
  };

  const handleOneTimePayment = async () => {
    if (!oneTimeCreds?.keyId) throw new Error("Payment credentials missing.");

    // 1. Create Order via AuthHook
    const orderData = await authenticatedFetch(token => apiClient.createOneTimeOrder({
      ontimeDoantionRequest: {
        userId: auth.userId!,
        donorName: formData.name,
        donorMobileNumber: formData.mobile,
        donorCountryCode: '+91',
        donorEmail: formData.email,
        panCard: formData.pan.toUpperCase(),
        address: {
          addressLine: formData.address,
          district: formData.city,
          state: formData.state,
          country: formData.country,
          pincode: formData.pincode,
        },
        categoryId: selectedItem!.categoryId,
        subCategoryId: selectedItem!.subCategoryId,
        amount: finalAmount,
        isAgaramAlumni: formData.isAlumni,
        alumniVidhaiYear: formData.isAlumni ? Number(formData.alumniYear) : 1900,
        alumniCollege: formData.isAlumni ? formData.alumniCollege.replace(/[^a-zA-Z\s]/g, '') : 'NotApplicable',
        quantity: selectedItem!.isQuantitySelection ? quantity : 1,
        subscribeYear: selectedItem!.isShowYear ? subscribeYear : 1,
        platform: 'web',
      },
    }, token));

    if (!orderData.success) throw new Error(orderData.validationErrors?.join(', ') || orderData.message);

    const { razorpayOrderId, idempotencyKey } = orderData.oneTimeResponse;

    // --- ONE TIME NOTES (Strictly UserId and Source only) ---
    const notesPayload: Record<string, string> = {
      UserId: String(auth.userId || ''),
      DonationSource: "Website"
    };

    // >>> DEBUGGING LOG <<<

    // 2. Open Razorpay
    const options: any = { // Cast to 'any' to avoid strict type conflicts
      key: oneTimeCreds.keyId,
      amount: finalAmount * 100,
      currency: 'INR',
      name: 'Agaram Foundation',
      description: selectedItem!.categoryName,
      order_id: razorpayOrderId,
      notes: notesPayload, // Attach notes
      handler: async (response: any) => {
        setMessage('Verifying payment...');

        try {
          const verifyData = await authenticatedFetch(token => apiClient.verifyOneTimeOrder({
            verifyOneTimeRequest: {
              razorpayOrderId: response.razorpay_order_id!,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              idempotencyKey,
              userId: auth.userId!,
            },
          }, token));

          if (verifyData.success) {
            const params = new URLSearchParams({
              status: "success",
              name: formData.name,
              email: formData.email,
              amount: finalAmount.toString(),
            });
            router.push(`/donate/response?${params.toString()}`);
          } else {
            setMessage(`Verification failed: ${verifyData.message}`);
            setIsProcessing(false);
          }
        } catch (verifyError: any) {
          setMessage(`Verification error: ${verifyError.message}`);
          setIsProcessing(false);
        }
      },
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: `+91${formData.mobile}`,
      },
      theme: { color: '#06b6d4' },
      modal: { ondismiss: () => { setIsProcessing(false); setMessage('Payment Cancelled'); } }
    };

    // Log full options

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleRecurringPayment = async () => {
    if (!recurringCreds?.keyId) throw new Error("Recurring credentials missing.");

    // 1. Create Order
    const response = await authenticatedFetch(token => apiClient.createRecurringOrder({
      recurringPaymentRequest: {
        userId: auth.userId!,
        donorName: formData.name,
        donorMobileNumber: formData.mobile,
        donorCountryCode: '+91',
        donorEmail: formData.email,
        panCard: formData.pan.toUpperCase(),
        address: {
          addressLine: formData.address,
          district: formData.city,
          state: formData.state,
          country: formData.country,
          pincode: formData.pincode
        },
        categoryId: selectedItem!.categoryId,
        subCategoryId: selectedItem!.subCategoryId,
        amount: selectedItem!.amount,
        isAgaramAlumni: formData.isAlumni,
        alumniVidhaiYear: formData.isAlumni ? Number(formData.alumniYear) : 0,
        alumniCollege: formData.isAlumni ? formData.alumniCollege : 'NotApplicable',
        platform: 'web',
        durationMonths: durationMonths,
        quantity: 1,
        subscribeYear: 1
      }
    }, token));

    if (!response.success) throw new Error(response.validationErrors?.join(', ') || response.message);

    // --- EXTRACT donationId ---
    const { razorpaySubscriptionId, idempotencyKey, donationId } = response.recurringResponse;

    // --- RECURRING NOTES (Includes DonationId) ---
    const notesPayload: Record<string, string> = {
      DonationId: String(donationId || ''),
      UserId: String(auth.userId || ''),
      DonationSource: "Website"
    };

    // >>> DEBUGGING LOG <<<

    // 2. Open Razorpay
    const options: any = { // Cast to 'any' to avoid strict type conflicts
      key: recurringCreds.keyId,
      subscription_id: razorpaySubscriptionId,
      name: 'Agaram Foundation',
      description: `Monthly Donation: ${selectedItem!.categoryName}`,
      currency: 'INR',
      notes: notesPayload, // Attach notes
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: `+91${formData.mobile}`
      },
      theme: { color: '#06b6d4' },
      handler: async (rzpResponse: any) => {
        setMessage('Verifying subscription...');
        try {
          const verifyRes = await authenticatedFetch(token => apiClient.verifyRecurringOrder({
            verifyRecurringRequest: {
              razorpaySubscriptionId: rzpResponse.razorpay_subscription_id!,
              razorpayPaymentId: rzpResponse.razorpay_payment_id,
              razorpaySignature: rzpResponse.razorpay_signature,
              userId: auth.userId!,
              idempotencyKey
            }
          }, token));

          if (verifyRes.success) {
            const params = new URLSearchParams({
              status: "success",
              name: formData.name,
              email: formData.email,
              amount: selectedItem!.amount.toString(),
              subId: rzpResponse.razorpay_subscription_id ?? "",
              duration: String(durationMonths)
            });
            router.push(`/donate/response?${params.toString()}`);
          } else {
            setMessage('Verification failed: ' + verifyRes.message);
            setIsProcessing(false);
          }
        } catch (verifyError: any) {
          setMessage('Verification error: ' + verifyError.message);
          setIsProcessing(false);
        }
      },
      modal: { ondismiss: () => { setIsProcessing(false); setMessage('Payment Cancelled'); } }
    };

    // Log full options

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // --- RENDER ---

  if (dataLoading || isAuthLoading) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-12 space-y-8">
        <Skeleton className="rounded-lg w-1/3 h-12" />
        <div className="space-y-4">
          <Skeleton className="rounded-lg w-full h-48" />
          <Skeleton className="rounded-lg w-full h-48" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32">
      <div className="m-1 bg-white p-5 md:p-10 shadow-md rounded-lg max-w-5xl mx-auto mt-8">

        {/* Header */}
        <div className="mb-4">
          <h1 className="text-xl font-semibold text-gray-900">Sponsor a Future</h1>
          <small className="text-gray-500">Extend the power of education to every corner of society.</small>
        </div>

        {/* Know More Button */}
        <div className="text-sm text-default-600 font-medium mb-3">
          <Button
            size="sm"
            color="primary"
            variant="flat"
            className="font-semibold rounded-lg"
            endContent={<ArrowRight size={16} />}
            onPress={() => setIsKnowMoreOpen(true)}
          >
            Know More About Donations
          </Button>
        </div>

        {/* Tabs */}
        <Tabs
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(key as "once" | "monthly" | "foreign")}
          size="md"
          color="primary"
          radius="md"
          variant="solid"
          fullWidth
          className="!mb-0 !pb-0 [&>*]:!mb-0"
          classNames={{
            tabList: "bg-gray-100 p-1 w-full",
            cursor: "bg-primary",
            tabContent: "group-data-[selected=true]:text-white text-gray-600 font-medium"
          }}
        >
          <Tab key="once" title="One Time"> </Tab>
          <Tab key="monthly" title="Every Month"> </Tab>
          <Tab key="foreign" title="Foreign Donor"> </Tab>
        </Tabs>

        {/* SHARED CATEGORY RENDERER */}
        {selectedTab !== 'foreign' ? (
          <div className="mt-3 animate-fade-in">
            <p className="text-md text-default-600 font-medium mb-6">
              {selectedTab === 'once'
                ? "Make a one-time donation to support underprivileged students. Your gift can shape their future."
                : "Empower underprivileged students through monthly donations. Fund tuition, food, hostel, and mentorship."}
            </p>

            <div className="space-y-8">
              {Object.entries(groupedCategories).map(([categoryName, items]) => (
                <div key={categoryName} className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-800">
                    <span className="text-xl">{getCategoryIcon(categoryName)}</span>
                    <div><h3 className="text-md font-semibold">{categoryName}</h3></div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((item, index) => {
                      const isCustom = item.isCustomAllowed && selectedTab === 'once';
                      const isSelected = selectedItem === item && (!isCustom || !customAmount);
                      const active = isSelected || (isCustom && !!customAmount);
                      const hasDistinctTitle = item.subCategoryName &&
                        item.subCategoryName.toLowerCase() !== `₹${item.amount}`.toLowerCase() &&
                        item.subCategoryName.trim() !== '';

                      return (
                        <Card
                          key={index}
                          isPressable={!isCustom}
                          onPress={() => !isCustom && handleAmountClick(item)}
                          className={`border transition-all duration-200 shadow-sm hover:shadow-md h-full
                                        ${active ? 'border-primary border-1' : 'border-gray-200 bg-white'}`}
                          radius="sm"
                          shadow="none"
                        >
                          <CardBody className={`p-0 ${isCustom ? 'p-4' : ''}`}>
                            {isCustom ? (
                              <div className="flex items-center gap-3 h-full">
                                <div className={`flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center ${active ? 'border-primary' : 'border-gray-300'}`}>
                                  {active && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                                </div>
                                <Input
                                  type="number"
                                  placeholder="Enter Amount (₹)"
                                  value={customAmount}
                                  onValueChange={handleCustomAmountChange}
                                  variant="flat"
                                  classNames={{
                                    input: "text-medium font-normal bg-transparent",
                                    inputWrapper: "bg-transparent shadow-none px-0 h-auto group-data-[focus=true]:bg-transparent"
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="flex flex-col h-full">
                                {hasDistinctTitle && (
                                  <>
                                    <div className="px-4 py-3 flex-1">
                                      <p className="text-gray-700 text-sm font-medium leading-tight">{item.subCategoryName}</p>
                                    </div>
                                    <Divider className="bg-gray-100" />
                                  </>
                                )}
                                <div className={`flex items-center gap-3 ${hasDistinctTitle ? 'px-4 py-3 bg-gray-50/50' : 'px-5 py-4'}`}>
                                  <div className={`flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center ${active ? 'border-primary' : 'border-gray-300'}`}>
                                    {active && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                                  </div>
                                  <span className="text-md font-semibold text-gray-900">₹{item.amount}/-</span>
                                  {selectedTab === 'monthly' && <span className="text-xs text-gray-500 ml-auto">/month</span>}
                                </div>
                              </div>
                            )}
                          </CardBody>

                          {/* Quantity & Year Selectors */}
                          {isSelected && !customAmount && selectedTab === 'once' && (item.isQuantitySelection || item.isShowYear) && (
                            <CardFooter className="pt-0 pb-4 px-4 block">
                              <div className="mt-2 rounded-lg p-3 gap-3">
                                {item.isQuantitySelection && (
                                  <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-md px-2 py-1">
                                    <button
                                      type="button"
                                      onClick={(e) => { e.stopPropagation(); handleQuantityChange(-1, item); }}
                                      className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 active:scale-95 disabled:opacity-40"
                                      disabled={quantity <= DEFAULT_MIN_QUANTITY}
                                    >
                                      −
                                    </button>
                                    <div className="w-10 text-center font-medium">{quantity}</div>
                                    <button
                                      type="button"
                                      onClick={(e) => { e.stopPropagation(); handleQuantityChange(1, item); }}
                                      className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 active:scale-95 disabled:opacity-40"
                                      disabled={quantity >= (item?.maxQuantity ?? DEFAULT_MAX_QUANTITY)}
                                    >
                                      +
                                    </button>
                                  </div>
                                )}

                                {item.isShowYear && (
                                  <div className="mt-2 w-full">
                                    <Select
                                      label="Duration (Years)"
                                      selectedKeys={[String(subscribeYear)]}
                                      onSelectionChange={(keys) => {
                                        const key = Array.from(keys)[0];
                                        if (key) setSubscribeYear(Number(key));
                                      }}
                                      size="sm"
                                      variant="bordered"
                                      radius="sm"
                                      className="max-w-[220px]"
                                    >
                                      {Array.from({ length: (item.subscribeMaxYear || 5) - (item.subscribeMinYear || 1) + 1 }, (_, i) => i + (item.subscribeMinYear || 1)).map(y => (
                                        <SelectItem key={String(y)} textValue={String(y)}>{y} {y === 1 ? 'Year' : 'Years'}</SelectItem>
                                      ))}
                                    </Select>
                                  </div>
                                )}
                              </div>
                            </CardFooter>
                          )}
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <Divider className="my-8" />

            {/* Donor Details Section */}
            <section id="donor-details-form" className="space-y-4">

              {/* Duration Selector for Monthly */}
              {selectedTab === 'monthly' && selectedItem && (
                <Card className="shadow-none border-none" radius="sm">
                  <CardBody className="p-6">
                    <div className="flex items-center gap-2 text-gray-800 border-b border-gray-100 pb-2 mb-4">
                      <Target size={20} className="text-primary" />
                      <h3 className="text-lg font-semibold">Duration (Months)</h3>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">
                      Select how long you&apos;d like your monthly donation of <span className="font-semibold text-primary">₹{selectedItem.amount?.toLocaleString('en-IN')}/month</span> to continue.
                    </p>
                    <Select
                      label="Duration"
                      placeholder="Select duration"
                      selectedKeys={[String(durationMonths)]}
                      onSelectionChange={(keys) => {
                        const key = Array.from(keys)[0];
                        if (key) setDurationMonths(Number(key));
                      }}
                      size="sm"
                      variant="bordered"
                      radius="sm"
                      className="max-w-[220px]"
                      isRequired
                    >
                      {[12, 24, 36, 48, 60, 72, 84, 100].map(m => (
                        <SelectItem key={String(m)} textValue={`${m} months`}>{m} months</SelectItem>
                      ))}
                    </Select>
                  </CardBody>
                </Card>
              )}

              {/* 1. Personal Details Card */}
              <Card className="shadow-none border-none" radius="sm">
                <CardBody className="p-6 pb-2">
                  <div className="flex items-center gap-2 text-gray-800 border-b border-gray-100 pb-2">
                    <User size={20} className="text-primary" />
                    <h3 className="text-lg font-semibold">Personal Details</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input
                      label="Full Name"
                      value={formData.name}
                      onValueChange={(v) => handleInputChange('name', v)}
                      isInvalid={!!formErrors.name}
                      errorMessage={formErrors.name}
                      variant="bordered"
                      size="sm"
                      isRequired
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={formData.email}
                      onValueChange={(v) => handleInputChange('email', v)}
                      variant="bordered"
                      size="sm"
                      isRequired
                    />
                    <Input
                      label="Mobile Number"
                      startContent={<span className="text-xs text-gray-500">+91</span>}
                      value={formData.mobile}
                      onValueChange={(v) => handleInputChange('mobile', v)}
                      isInvalid={!!formErrors.mobile}
                      errorMessage={formErrors.mobile}
                      variant="bordered"
                      size="sm"
                      isRequired
                    />
                    <Input
                      label="PAN Card"
                      value={formData.pan}
                      onValueChange={(v) => handleInputChange('pan', v.toUpperCase())}
                      isInvalid={!!formErrors.pan}
                      errorMessage={formErrors.pan}
                      variant="bordered"
                      size="sm"
                      isRequired
                    />
                  </div>

                  {/* Alumni Section - Kept inside Personal Details as it relates to the person */}
                  <div className="mt-6 pt-4 border-t border-dashed border-gray-200">
                    <Checkbox
                      isSelected={formData.isAlumni}
                      onValueChange={(v) => handleInputChange('isAlumni', v)}
                    >
                      <span className="text-sm font-medium text-gray-700">Are you an Agaram Alumni?</span>
                    </Checkbox>

                    {formData.isAlumni && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 bg-gray-50 p-4 rounded-lg animate-appearance-in">
                        <Select
                          label="Agaram Vidhai Year"
                          placeholder="Select Year"
                          variant="bordered"
                          size="sm"
                          selectedKeys={formData.alumniYear ? [formData.alumniYear] : []}
                          onSelectionChange={(keys) => {
                            const selectedValue = Array.from(keys)[0] as string;
                            handleInputChange('alumniYear', selectedValue || '');
                          }}
                          isInvalid={!!formErrors.alumniYear}
                          errorMessage={formErrors.alumniYear}
                          classNames={{ trigger: "bg-white" }}
                        >
                          {alumniYearOptions.map((year) => (
                            <SelectItem key={year} textValue={year}>{year}</SelectItem>
                          ))}
                        </Select>
                        <Input
                          label="College Name"
                          value={formData.alumniCollege}
                          onValueChange={(v) => handleInputChange('alumniCollege', v)}
                          isInvalid={!!formErrors.alumniCollege}
                          errorMessage={formErrors.alumniCollege}
                          variant="bordered"
                          size="sm"
                          classNames={{ inputWrapper: "bg-white" }}
                        />
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>

              {/* 2. Address Details Card */}
              <Card className="shadow-none border-none" radius="sm">
                <CardBody className="p-6">
                  <div className="flex items-center gap-2 mb-5 text-gray-800 pb-2">
                    <LuMapPin size={20} className="text-primary" />
                    <h3 className="text-lg font-semibold">Address Details</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                      <Input
                        label="Address (No, Street, Area)"
                        value={formData.address}
                        onValueChange={(v) => handleInputChange('address', v)}
                        isInvalid={!!formErrors.address}
                        errorMessage={formErrors.address}
                        variant="bordered"
                        size="sm"
                        isRequired
                      />
                    </div>
                    <Input
                      label="City / District"
                      value={formData.city}
                      onValueChange={(v) => handleInputChange('city', v)}
                      isInvalid={!!formErrors.city}
                      errorMessage={formErrors.city}
                      variant="bordered"
                      size="sm"
                      isRequired
                    />
                    <Input
                      label="State"
                      value={formData.state}
                      onValueChange={(v) => handleInputChange('state', v)}
                      isInvalid={!!formErrors.state}
                      errorMessage={formErrors.state}
                      variant="bordered"
                      size="sm"
                      isRequired
                    />
                    <Input
                      label="Country"
                      value={formData.country}
                      onValueChange={(v) => handleInputChange('country', v)}
                      isInvalid={!!formErrors.country}
                      errorMessage={formErrors.country}
                      variant="bordered"
                      size="sm"
                      isRequired
                    />
                    <Input
                      label="Pincode"
                      value={formData.pincode}
                      onValueChange={(v) => handleInputChange('pincode', v)}
                      isInvalid={!!formErrors.pincode}
                      errorMessage={formErrors.pincode}
                      variant="bordered"
                      size="sm"
                      maxLength={6}
                      isRequired
                    />
                  </div>
                </CardBody>
              </Card>

            </section>
          </div>
        ) : (
          <>
            <ForeignDonorForm />
          </>
        )}
      </div>

      {/* Sticky Footer Bar */}
      {selectedTab !== 'foreign' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] p-4 z-50">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">
                {selectedTab === 'monthly' ? 'Monthly Donation' : 'Total Donation Amount'}
              </p>
              <p className="text-3xl font-bold text-primary">
                ₹{finalAmount.toLocaleString('en-IN')}
                {selectedTab === 'monthly' && <span className="text-sm font-medium text-gray-500">/month</span>}
              </p>
              {selectedItem && (
                <p className="text-sm text-gray-700 mt-0.5 truncate">
                  {selectedItem?.categoryName}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              {message && (
                <span className={`hidden md:block text-sm font-medium ${message.includes('success') ? 'text-green-600' : 'text-primary-600'}`}>
                  {message}
                </span>
              )}
              <Button
                size="lg"
                color="primary"
                className="font-bold text-white px-8 shadow-lg"
                isLoading={isProcessing}
                radius='sm'
                onPress={handlePayment}
                isDisabled={!isRazorpayLoaded}
              >
                {isProcessing ? "Processing" : "Continue"}
              </Button>
            </div>
          </div>
          {message && (
            <div className="md:hidden text-center mt-2 text-xs font-medium text-red-500">{message}</div>
          )}
        </div>
      )}

      <KnowMoreModal isOpen={isKnowMoreOpen} onClose={() => setIsKnowMoreOpen(false)} />

      {/* Alert Modal */}
      <Modal isOpen={alertModal.isOpen} onClose={alertModal.onClose} size="sm">
        <ModalContent>
          <ModalHeader>Minimum Donation</ModalHeader>
          <ModalBody>
            <p>Minimum donation amount is ₹100.</p>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onPress={alertModal.onClose}>OK</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}