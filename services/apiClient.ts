import * as T from '@/types/agaram.types';

const API_BASE_URL = '/api-proxy';
const REQUEST_TIMEOUT_MS = 30_000; // 30 seconds

const logDebug = (label: string, data: unknown) => {
  if (process.env.NODE_ENV === 'development') {
  }
};

async function handleResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    if (response.status === 204) return {} as T;
    return response.json();
  }

  const errorText = await response.text();
  let errorMessage = `API Error: ${response.status}`;

  try {
    const e = JSON.parse(errorText);
    errorMessage = e.message || e.title || errorMessage;

    if (e.errors && typeof e.errors === 'object') {
      const details = Object.values(e.errors).flat().join(', ');
      if (details) errorMessage = details;
    }
  } catch {
    logDebug('Non-JSON Error Response', errorText);
    errorMessage = `Server Error (${response.status}). Please try again later.`;
  }

  throw new Error(errorMessage);
}

// Shared fetch wrapper with timeout via AbortController
async function request<TResponse>(
  url: string,
  options: RequestInit,
): Promise<TResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return handleResponse<TResponse>(response);
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('Request timed out. Please check your connection and try again.');
    }
    logDebug(`${options.method} ${url} Failed`, error);
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function post<TRequest, TResponse>(
  endpoint: string,
  body: TRequest,
  token?: string,
): Promise<TResponse> {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  return request<TResponse>(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
}

async function getProtected<TResponse>(
  endpoint: string,
  token: string,
): Promise<TResponse> {
  return request<TResponse>(`${API_BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
}

async function getById<TResponse>(
  endpoint: string,
  id: string,
  token: string,
): Promise<TResponse> {
  return getProtected<TResponse>(`${endpoint}/${id}`, token);
}

// --- API CLIENT EXPORT ---

export const apiClient = {
  // --- Auth ---
  signUpUser: (data: T.SignUpUserRequest) =>
    post<T.SignUpUserRequest, T.SignUpUserResponse>('/web/api/v1/Web/SignUpWebUser', data),

  sendWebOtp: (data: T.SendOtpRequest) => 
    post<T.SendOtpRequest, T.SendOtpResponse>('/web/api/v1/Web/SendWebOtp', data),

  validateWebOtp: (data: T.ValidateOtpRequest) => 
    post<T.ValidateOtpRequest, T.ValidateOtpResponse>('/web/api/v1/Web/ValidateWebOtp', data),

  resendWebOtp: (data: T.ResendOtpRequest) => 
    post<T.ResendOtpRequest, T.ResendOtpResponse>('/web/api/v1/Web/ReSendWebOtp', data),

  // --- Volunteer ---
  volunteerEnrollment: (data: T.VolunteerEnrollmentRequest, token: string) => 
    post<T.VolunteerEnrollmentRequest, T.VolunteerEnrollmentResponse>('/web/api/v1/Web/VolunteerWebEnrollment', data, token),

  // --- Token Management ---
  refreshToken: (data: T.RefreshTokenRequest) => 
    post<T.RefreshTokenRequest, T.RefreshTokenResponse>('/web/api/v1/Web/WebToken/Refresh', data),

  revokeToken: (data: T.RevokeTokenRequest) => 
    post<T.RevokeTokenRequest, T.RevokeTokenResponse>('/web/api/v1/Web/WebToken/Revoke', data),

  // --- Data Fetching ---
  getVolunteerMasterData: (token: string) => 
    getProtected<T.VolunteerMasterDataResponse>('/web/api/v1/Web/GetVolunteerWebMasterData', token),

  getOneTimePaymentCredentials: (token: string) => 
    getProtected<T.PaymentGatewayCredentials>('/web/api/v1/Web/GetWebOneTimePaymentGatewayCredentialAsync', token),

  getRecurringPaymentCredentials: (token: string) => 
    getProtected<T.PaymentGatewayCredentials>('/web/api/v1/Web/GetWebRecurringPaymentGatewayCredentialAsync', token),

  getDonationCategories: (token: string) => 
    getProtected<T.DonationCategoriesResponse>('/web/api/v1/Web/GetWebDonationCategoriesListAsync', token),

  getUserProfile: (userId: string, token: string) => 
    getById<T.UserProfileResponse>('/web/api/v1/Web/GetWebUserProfileBasedOnUserIdAsync', userId, token),

  // --- Payment Details ---
  getPaymentDetailsByTransactionId: (transactionId: string, token: string) => 
    getById<T.PaymentDetailsResponse>('/web/api/v1/Web/GetWebPaymentDetailsByTransactionIdAsync', transactionId, token),

  getDonationReceiptByTransactionId: (transactionId: string, token: string) => 
    getById<T.DonationReceiptResponse>('/web/api/v1/Web/GetWebDonationReceiptByTransactionIdAsync', transactionId, token),

  // --- Orders ---
  createOneTimeOrder: (data: T.OneTimeOrderRequest, token: string) => 
    post<T.OneTimeOrderRequest, T.OneTimeOrderResponse>('/web/api/v1/Web/OneTimeWebPaymentOrderRequest', data, token),

  verifyOneTimeOrder: (data: T.VerifyOneTimeOrderRequest, token: string) => 
    post<T.VerifyOneTimeOrderRequest, T.VerifyOneTimeOrderResponse>('/web/api/v1/Web/VerifiyOneTimeWebPaymentOrderRequest', data, token),

  createRecurringOrder: (data: T.RecurringOrderRequest, token: string) => 
    post<T.RecurringOrderRequest, T.RecurringOrderResponse>('/web/api/v1/Web/RecurringPaymentWebOrderRequest', data, token),

  verifyRecurringOrder: (data: T.VerifyRecurringOrderRequest, token: string) => 
    post<T.VerifyRecurringOrderRequest, T.VerifyRecurringOrderResponse>('/web/api/v1/Web/VerifiyRecurringWebPaymentOrderRequest', data, token),

  // --- Transactions ---
  getTransactions: (data: T.TransactionListRequest, token: string) =>
    post<T.TransactionListRequest, T.TransactionListResponse>('/web/api/v1/Web/GetWebPaymentTransactionListByUserIdAsync', data, token),
};