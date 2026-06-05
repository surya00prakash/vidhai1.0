'use client';

import React, { useState, useMemo, useEffect, useCallback, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/services/apiClient';
import { SendOtpResponse, ValidateOtpResponse, ResendOtpResponse } from '@/types/agaram.types';

// HeroUI Imports
import {
  Tabs,
  Tab,
  Input,
  Button,
  Link,
  Spinner,
  InputOtp,
} from "@heroui/react";

// Icons
import {
  Mail,
  User,
  Phone,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

// --- UTILS FOR PRODUCTION SAFETY ---
const logDebug = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
  }
};

// --- 1. AUTH CONTENT COMPONENT ---
// This component holds all the logic that uses searchParams and client-side state.
function AuthContent() {
  const [selectedTab, setSelectedTab] = useState<string | number>("login");
  const [sharedEmail, setSharedEmail] = useState('');

  const { auth, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Determine where to go (Default to /profile if no returnUrl is found)
  const returnUrl = searchParams.get('returnUrl');
  const redirectDestination = returnUrl || '/profile';

  // Redirect Logic (If user is ALREADY logged in)
  useEffect(() => {
    if (!isLoading && auth.accessToken) {
      router.replace(redirectDestination);
    }
  }, [isLoading, auth.accessToken, router, redirectDestination]);

  // Loading State (Session Check)
  if (isLoading || auth.accessToken) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <Spinner size="lg" color="primary" label="Verifying session..." />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* LEFT SIDE: BRANDING */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary items-center justify-center overflow-hidden">
        <div className="relative z-10 p-12 text-white max-w-lg">
          <h1 className="text-4xl font-bold leading-tight mb-6">
            Empowering through education and creating lasting change
          </h1>
          <p className="text-lg text-white/80 leading-relaxed">
            "Education is the most powerful weapon which you can use to change the world."
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: FORMS */}
      <div className="flex-1 flex items-start sm:items-center justify-center px-5 py-8 sm:p-6 lg:p-12 relative bg-white overflow-y-auto">
        <div className="w-full max-w-[420px] space-y-5 animate-appearance-in">

          {/* Mobile logo — hidden on desktop where left panel shows */}
          <div className="flex flex-col items-center gap-1 lg:hidden mb-2">
            <img src="/assets/images/logo/agaram_logo.png" alt="Agaram Foundation" className="h-16 w-16 object-contain" />
            <span className="text-xs text-gray-400 tracking-wide">Agaram Foundation</span>
          </div>

          <div className="text-center space-y-1 mb-4">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
              {selectedTab === "login" ? "Welcome Back!" : "Create an account"}
            </h2>
            <p className="text-gray-500 text-sm sm:text-base">
              {selectedTab === "login"
                ? "Login to your Agaram account."
                : "Become a part of Agaram Family today!"}
            </p>
          </div>

          <Tabs
            fullWidth
            size="lg"
            aria-label="Auth Options"
            selectedKey={selectedTab}
            onSelectionChange={setSelectedTab}
            color="primary"
            variant="bordered"
            radius="sm"
            classNames={{
              tabList: "p-1 bg-gray-100/50 border border-gray-200",
              cursor: "bg-white shadow-sm border border-gray-100",
              tab: "font-medium text-gray-600 h-10",
              tabContent: "group-data-[selected=true]:text-gray-900"
            }}
          >
            <Tab key="login" title="Login">
              <div className="pt-4">
                <LoginForm
                  initialEmail={sharedEmail}
                  onSwitchToSignup={() => setSelectedTab("signup")}
                />
              </div>
            </Tab>
            <Tab key="signup" title="Sign Up">
              <div className="pt-4">
                <SignUpForm
                  onSuccess={(email) => {
                    setSharedEmail(email);
                    setSelectedTab("login");
                  }}
                />
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

// --- 2. MAIN PAGE EXPORT (SUSPENSE WRAPPER) ---
// This ensures useSearchParams is only called inside a suspended boundary.
export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center bg-white">
          <Spinner size="lg" color="primary" label="Loading..." />
        </div>
      }
    >
      <AuthContent />
    </Suspense>
  );
}

// --- LOGIN FORM ---
function LoginForm({ initialEmail, onSwitchToSignup }: { initialEmail: string, onSwitchToSignup: () => void }) {
  const [contactValue, setContactValue] = useState(initialEmail || '');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const resendCountdownRef = useRef(0);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  // Determine destination logic
  const returnUrl = searchParams.get('returnUrl');
  const redirectDestination = returnUrl || '/profile';

  // Cleanup countdown on unmount
  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  // Start countdown timer with configurable duration
  const startResendTimer = useCallback((seconds = 30) => {
    resendCountdownRef.current = seconds;
    setResendCountdown(seconds);
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      resendCountdownRef.current -= 1;
      const next = resendCountdownRef.current;
      if (next <= 0) {
        if (countdownRef.current) clearInterval(countdownRef.current);
        resendCountdownRef.current = 0;
        setResendCountdown(0);
      } else {
        setResendCountdown(next);
      }
    }, 1000);
  }, []);

  // Resend OTP handler
  const handleResendOtp = useCallback(async () => {
    // Use ref to avoid stale closure
    if (resendCountdownRef.current > 0 || isResending) return;

    setIsResending(true);
    setMessage('');
    setStatus('idle');

    try {
      const data: ResendOtpResponse = await apiClient.resendWebOtp({
        contactType: 'Email',
        contactValue: contactValue,
      });

      if (data.success) {
        setStatus('success');
        setMessage('New OTP sent! Check your inbox.');
        setOtp('');
        startResendTimer(30);
      } else {
        const errorMsg = data.validationErrors?.[0] || data.message || 'Failed to resend OTP.';
        setStatus('error');
        setMessage(errorMsg);
        // Extract seconds from API message like "Please wait 10 seconds..."
        const waitMatch = errorMsg.match(/wait\s+(\d+)\s+second/i);
        const waitSeconds = waitMatch ? parseInt(waitMatch[1], 10) : 15;
        startResendTimer(waitSeconds);
      }
    } catch {
      setStatus('error');
      setMessage('Unable to resend OTP. Please try again.');
      startResendTimer(10);
    } finally {
      setIsResending(false);
    }
  }, [isResending, contactValue, startResendTimer]);

  const isEmailInvalid = useMemo(() => {
    if (contactValue === "") return false;
    return !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(contactValue);
  }, [contactValue]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEmailInvalid) return;

    setIsLoading(true);
    setMessage('');
    setStatus('idle');

    try {
      const data: SendOtpResponse = await apiClient.sendWebOtp({
        contactType: 'Email',
        contactValue: contactValue,
      });

      if (data.success) {
        setStatus('success');
        setMessage('OTP Sent! Check your inbox.');
        setShowOtpForm(true);
        startResendTimer();
        logDebug('OTP Sent successfully');
      } else {
        setStatus('error');
        setMessage(data.validationErrors?.[0] || 'Failed to send OTP. Please check email.');
      }
    } catch (error) {
      setStatus('error');
      logDebug('Send OTP Error', error);
      setMessage('Unable to connect. Please check your network.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidateOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const data: ValidateOtpResponse = await apiClient.validateWebOtp({
        contactType: 'Email',
        contactValue: contactValue,
        otpHash: otp,
        platform: 'web',
      });

      if (data.success && data.token && data.userId) {
        setStatus('success');
        setMessage('Verified successfully! Redirecting...');

        login({
          token: data.token.token,
          refreshToken: data.token.refreshToken.token,
          userId: data.userId,
          email: contactValue,
        });

        router.push(redirectDestination);

      } else {
        setStatus('error');
        setMessage(data.validationErrors?.[0] || data.message || 'Invalid OTP.');
      }
    } catch (error) {
      setStatus('error');
      logDebug('OTP Validation Error', error);
      setMessage('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {!showOtpForm ? (
        <form onSubmit={handleSendOtp} className="space-y-5">
          <Input
            label="Email Address"
            placeholder="Enter Your Registered Email"
            type="email"
            variant="bordered"
            radius="sm"
            size="lg"
            labelPlacement="outside"
            startContent={<Mail className="text-default-400 pointer-events-none flex-shrink-0" size={20} />}
            value={contactValue}
            onValueChange={setContactValue}
            isInvalid={isEmailInvalid}
            errorMessage={isEmailInvalid && "Please enter a valid email address"}
            classNames={{ inputWrapper: "bg-white hover:bg-gray-50 transition-colors" }}
            isRequired
          />
          <Button
            type="submit"
            color="primary"
            size="lg"
            radius="sm"
            fullWidth
            isLoading={isLoading}
            className="font-semibold shadow-lg text-white shadow-primary/20"
            isDisabled={isEmailInvalid || !contactValue}
            endContent={!isLoading && <ArrowRight size={18} />}
          >
            Continue with Email
          </Button>
        </form>
      ) : (
        <form onSubmit={handleValidateOtp} className="space-y-5">
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-1.5 bg-white rounded-full text-primary shrink-0">
                <Mail size={15} />
              </div>
              <div className="text-sm min-w-0">
                <p className="text-gray-500 text-xs">OTP sent to</p>
                <p className="font-semibold text-gray-900 truncate">{contactValue}</p>
              </div>
            </div>
            <Button size="sm" variant="light" color="primary" onPress={() => {
              setShowOtpForm(false);
              setOtp('');
              setResendCountdown(0);
              resendCountdownRef.current = 0;
              if (countdownRef.current) clearInterval(countdownRef.current);
              setMessage('');
              setStatus('idle');
            }}>
              Edit
            </Button>
          </div>
          <br />
          <div className="flex flex-col items-center space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Enter 6-Digit Code
            </label>

            <InputOtp
              length={6}
              value={otp}
              onValueChange={setOtp}
              variant="bordered"
              radius="sm"
              size="lg"
              isRequired
              errorMessage={status === 'error' ? "Invalid OTP" : undefined}
              isInvalid={status === 'error'}
              classNames={{
                segmentWrapper: "gap-1.5 sm:gap-2",
                segment: "w-9 h-11 sm:w-10 sm:h-12 font-bold text-base sm:text-lg",
              }}
            />

            {/* Helper text */}
            <p className="text-xs text-gray-400">
              Paste allowed (Ctrl+V)
            </p>
          </div>

          {/* Resend OTP */}
          <div className="flex items-center justify-center gap-2">
            <p className="text-sm text-gray-500">
              Didn&apos;t receive the code?
            </p>
            {resendCountdown > 0 ? (
              <span className="text-sm font-medium text-gray-400">
                Resend in {resendCountdown}s
              </span>
            ) : (
              <Button
                size="sm"
                variant="light"
                color="primary"
                onPress={handleResendOtp}
                isLoading={isResending}
                startContent={!isResending && <RefreshCw size={14} />}
                className="font-semibold text-sm min-w-0 px-2"
              >
                Resend OTP
              </Button>
            )}
          </div>

          <Button
            type="submit"
            color="primary"
            size="lg"
            radius="sm"
            fullWidth
            isLoading={isLoading}
            className="font-semibold shadow-lg shadow-primary/20"
          >
            Verify & Login
          </Button>
        </form>
      )}

      {status !== 'idle' && message && (
        <div className={`flex items-center gap-2 p-3 rounded-md text-sm font-medium animate-appearance-in ${status === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
          {status === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {message}
        </div>
      )}

      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-gray-200"></div>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>

      <p className="text-center text-sm text-gray-500">
        Don't have an account? <Link as="button" onPress={onSwitchToSignup} className="text-primary font-semibold cursor-pointer ms-1">Register</Link>
      </p>
    </div>
  );
}

// --- SIGN UP FORM ---
function SignUpForm({ onSuccess }: { onSuccess: (email: string) => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setStatus('idle');

    try {
      const response = await apiClient.signUpUser({
        name: name,
        email: email,
        phoneNumber: phone,
        countryCode: countryCode,
        deviceType: "2",
      });

      if (response.success) {
        setStatus('success');
        setMessage('Account created! Redirecting to login...');
        setTimeout(() => onSuccess(email), 2000);
      } else {
        setStatus('error');
        // Sanitize validation errors
        const errorMsg = response.validationErrors?.[0] || response.message || 'Signup failed. Please check your inputs.';
        setMessage(errorMsg);
      }
    } catch (error) {
      setStatus('error');
      logDebug('Signup Error', error);
      setMessage('Unable to create account. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-4 animate-fade-in">
      <Input
        label="Full Name"
        placeholder="John Doe"
        variant="bordered"
        radius="sm"
        labelPlacement="outside"
        startContent={<User className="text-default-400" size={18} />}
        value={name}
        onValueChange={setName}
        isRequired
        classNames={{ inputWrapper: "bg-white" }}
      />
      <Input
        label="Email"
        placeholder="john@company.com"
        type="email"
        variant="bordered"
        radius="sm"
        labelPlacement="outside"
        startContent={<Mail className="text-default-400" size={18} />}
        value={email}
        onValueChange={setEmail}
        isRequired
        classNames={{ inputWrapper: "bg-white mt-4" }}
      />

      <div className="grid grid-cols-4 gap-3">
        <div className="col-span-1">
          <Input
            label="Code"
            value={countryCode}
            onValueChange={setCountryCode}
            variant="bordered"
            radius="sm"
            labelPlacement="outside"
            isRequired
            classNames={{ inputWrapper: "bg-white text-center" }}
          />
        </div>
        <div className="col-span-3">
          <Input
            label="Phone Number"
            placeholder="9876543210"
            type="tel"
            variant="bordered"
            radius="sm"
            labelPlacement="outside"
            startContent={<Phone className="text-default-400" size={18} />}
            value={phone}
            onValueChange={setPhone}
            isRequired
            classNames={{ inputWrapper: "bg-white" }}
          />
        </div>
      </div>

      {message && (
        <div className={`flex items-center gap-2 p-3 rounded-md text-sm font-medium ${status === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
          {status === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {message}
        </div>
      )}

      <div className="pt-2">
        <Button
          type="submit"
          color="primary"
          size="lg"
          radius="sm"
          fullWidth
          isLoading={isLoading}
          className="font-semibold shadow-lg shadow-primary/20"
        >
          Create Account
        </Button>
      </div>
    </form>
  );
}