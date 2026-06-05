// types/agaram.types.ts
import { ReactNode } from 'react';

// --- API 1: SignUpUser ---
export interface SignUpUserRequest {
  name: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  deviceType: string;
}
export interface SignUpUserResponse {
  id: string | null;
  success: boolean;
  message: string;
  validationErrors: string[] | null;
}

// --- API 2: SendWebOtp ---
export interface SendOtpRequest {
  contactType: 'Email' | 'Mobile';
  contactValue: string;
}
export interface SendOtpResponse {
  success: boolean;
  message: string;
  validationErrors: string[] | null;
}

// --- API 3: ValidateWebOtp ---
export interface ValidateOtpRequest {
  contactType: 'Email' | 'Mobile';
  contactValue: string;
  otpHash: string;
  platform: string;
}
export interface ValidateOtpResponse {
  token: {
    refreshToken: {
      token: string;
      expiration: number;
    };
    token: string;
    expiration: number;
  } | null;
  userId: string;
  success: boolean;
  message: string;
  validationErrors: string[] | null;
}

// --- API 4: ReSendWebOtp ---
export interface ResendOtpRequest {
  contactType: 'Email' | 'Mobile';
  contactValue: string;
}
export interface ResendOtpResponse {
  success: boolean;
  message: string;
  validationErrors: string[] | null;
}

// --- API 5: VolunteerWebEnrollment ---
export interface VolunteerEnrollmentRequest {
  volunteer: {
    userld: string;               // Note: API uses 'userld' (typo)
    volunteerName: string;
    volunteerEmail: string;
    volunteerPhoneNumber: string;
    volunteerCountryCode: string;
    address: {
      addressLine: string;
      district: string;
      state: string;
      country: string;
      pincode: string;
    };
    availabilityld: number;        // Note: API uses 'availabilityld'
    availableHoursPerWeek: number;
    preferredLocationld: number;   // Note: API uses 'preferredLocationld'
    relevantSkills: string;
    volunteerExperience: string;
    isAttendedVolunteerTrainings: boolean;
    volunteerTrainingsDetails: string;
    isAgreeForTerms: boolean;
    preferredCategoryIds: number[];
    languagelds: number[];         // Note: API uses 'languagelds'
  };
}
export interface VolunteerEnrollmentResponse {
  success: boolean;
  message: string;
  validationErrors: string[] | null;
}

// --- API 6: GetVolunteerWebMasterData ---
interface MasterDataItem {
  id: number;
  name: string;
}
export interface VolunteerMasterDataResponse {
  languages: MasterDataItem[];
  preferredCategories: MasterDataItem[];
  availabilities: MasterDataItem[];
  preferredLocations: MasterDataItem[];
}

// --- API 7 & 8: Payment Gateway Credentials ---
export interface PaymentGatewayCredentials {
  gatewayName: string;
  keyId: string;
  keySecret: string;
}

// --- API 9: GetDonationCategoriesList ---
export interface DonationCategory {
  maxQuantity: number;
  subscribeMinYear: number;
  subscribeMaxYear: number;
  description: ReactNode;
  categoryId: number;
  categoryName: string;
  subCategoryId: number;
  subCategoryName: string;
  amount: number;
  isCustomAllowed: boolean;
  isMonthly: boolean;
  icon: string;
  iconType: string;
  iconSize: string;
  iconColor: string;
  isQuantitySelection: boolean;
  isShowYear: boolean;
  isSubCategoryShow: boolean;
  buttonPerRow: number;
}
export interface DonationCategoriesResponse {
  oneTime: DonationCategory[];
  monthly: DonationCategory[];
}

// --- API 10: OneTimeWebPaymentOrderRequest ---
export interface OneTimeOrderRequest {
  ontimeDoantionRequest: {          // Note: API uses 'ontimeDoantionRequest' (typo)
    userId: string;
    donorName: string;
    donorMobileNumber: string;
    donorCountryCode: string;
    donorEmail: string;
    panCard: string;
    address: {
      addressLine: string;
      district: string;
      state: string;
      country: string;
      pincode: string;
    };
    categoryId: number;
    subCategoryId: number;
    amount: number;
    isAgaramAlumni: boolean;
    alumniVidhaiYear: number;
    alumniCollege: string;
    quantity: number;
    subscribeYear: number;
    platform: string;
  };
}

export interface OneTimeOrderResponse {
  success: boolean;
  message: string;
  validationErrors: string[] | null;
  oneTimeResponse: {
    razorpayOrderId: string;
    idempotencyKey: string;
    orderstatus: string;
    donationId: string;
  };
}

// --- API 11: VerifiyOneTimeWebPaymentOrderRequest ---
export interface VerifyOneTimeOrderRequest {
  verifyOneTimeRequest: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    idempotencyKey: string;
    userId: string;
  };
}

export interface VerifyOneTimeOrderResponse {
  success: boolean;
  message: string;
  validationErrors: string[] | null;
}

// --- API 12: RecurringPaymentWebOrderRequest ---
export interface RecurringOrderRequest {
  recurringPaymentRequest: {
    userId: string;
    donorName: string;
    donorMobileNumber: string;
    donorCountryCode: string;
    donorEmail: string;
    panCard: string;
    address: {
      addressLine: string;
      district: string;
      state: string;
      country: string;
      pincode: string;
    };
    categoryId: number;
    subCategoryId: number;
    amount: number;
    isAgaramAlumni: boolean;
    alumniVidhaiYear: number;
    alumniCollege: string;
    platform: string;
    durationMonths: number;
    quantity: number;
    subscribeYear: number;
  };
}

export interface RecurringOrderResponse {
  success: boolean;
  message: string;
  validationErrors: string[] | null;
  recurringResponse: {
    razorpaySubscriptionId: string;
    razorpayOrderId?: string;
    idempotencyKey: string;
    orderstatus: string;
    donationId: string;
  };
}

// --- API 13: VerifiyRecurringWebPaymentOrderRequest ---
export interface VerifyRecurringOrderRequest {
  verifyRecurringRequest: {
    razorpaySubscriptionId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    idempotencyKey: string;
    userId: string;
  };
}

export interface VerifyRecurringOrderResponse {
  success: boolean;
  message: string;
  validationErrors: string[] | null;
}

// --- API 14: GetWebPaymentTransactionListByUserIdAsync ---
export interface TransactionListRequest {
  paymentListRequest: {
    pageIndex: number;
    pageSize: number;
    sortingColumnId: number; // Usually 0 for default
    sortingTypeId: number;   // Usually 0 for default (e.g. Descending)
    userId: string;
  }
}

export interface TransactionItem {
  transactionId?: string;
  orderId?: string;
  // Amount — API may use different field names
  amount?: number;
  donationAmount?: number;
  totalAmount?: number;
  paymentAmount?: number;
  // Date & Status
  paymentDate?: string;
  paymentStatus?: string;
  // Payment info
  paymentMethod?: string;
  paymentMode?: string;
  currencyCode?: string;
  // Donor info
  donorName?: string;
  fullName?: string;
  panCard?: string;
  panNumber?: string;
  email?: string;
  phoneNumber?: string;
  // Donation category
  donationCategory?: string;
  donationCategoryName?: string;
  categoryName?: string;
  purpose?: string;
  // Allow any extra fields from the API
  [key: string]: unknown;
}

export interface TransactionListResponse {
  success: boolean;
  message?: string;
  validationErrors?: string[] | null;
  data?: {
    items?: TransactionItem[];
    totalCount?: number;
  } | TransactionItem[];
}

// --- API 15: GetWebPaymentDetailsByTransactionIdAsync ---
export interface PaymentDetailsResponse {
  success: boolean;
  message: string;
  validationErrors: string[] | null;
  data?: {
    transactionId: string;
    orderId: string;
    paymentId: string;
    amount: number;
    currency: string;
    status: string;
    paymentMethod: string;
    createdAt: string;
    donorDetails?: {
      name: string;
      email: string;
      phone: string;
    };
    // Add any other fields returned by your API
  };
}

// --- API 16: GetWebDonationReceiptByTransactionIdAsync ---
export interface DonationReceiptResponse {
  success: boolean;
  message: string;
  validationErrors: string[] | null;
  data?: {
    receiptUrl?: string;      // URL to download PDF receipt
    receiptNumber?: string;
    transactionId?: string;
    generatedAt?: string;
    // Alternatively, if the API returns the PDF as base64:
    // pdfBase64?: string;
  };
}

// --- API 17: Revoke Token ---
export interface RevokeTokenRequest {
  email: string;
  token: string;
}
export interface RevokeTokenResponse {
  success: boolean;
  message: string;
  validationErrors: string[] | null;
}

// --- API 18: GetUserProfile ---
export interface UserProfileResponse {
  fullName: string;
  email: string;
  phoneNumber: string;
  address?: string;
}

// --- Token Management Types ---
export interface TokenDetails {
  token: string;
  expiration: number;
}

export interface AuthTokenData {
  token: string;       // Access Token
  expiration: number;
  refreshToken: TokenDetails;
}

export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  validationErrors: string[];
  token: AuthTokenData;
}

export interface RefreshTokenRequest {
  accessToken: string;
  refreshToken: string;
}