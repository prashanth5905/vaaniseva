import { useState } from "react";
import {
    ClipboardCheck,
    FileText,
    Landmark,
    ShieldCheck,
} from "lucide-react";
import { requestOTP, verifyOTP } from "../../services/authService";

export default function Login() {
    const [aadhaar, setAadhaar] = useState("");
    const [otp, setOtp] = useState("");
    const [verificationId, setVerificationId] = useState(null);
    const [phoneHint, setPhoneHint] = useState("");
    const [isRequesting, setIsRequesting] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [aadhaarError, setAadhaarError] = useState("");
    const [otpError, setOtpError] = useState("");
    const [generalError, setGeneralError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const validateAadhaar = () => {
        if (!aadhaar) {
            return "Please enter your Aadhaar number.";
        }

        if (!/^\d+$/.test(aadhaar)) {
            return "Aadhaar must contain only digits.";
        }

        if (aadhaar.length !== 12) {
            return "Aadhaar must be exactly 12 digits.";
        }

        return "";
    };

    const validateOtp = () => {
        if (!otp) {
            return "Please enter the OTP.";
        }

        if (!/^\d+$/.test(otp)) {
            return "OTP must contain only digits.";
        }

        if (otp.length !== 6) {
            return "OTP must be exactly 6 digits.";
        }

        return "";
    };

    const resetForm = () => {
        setVerificationId(null);
        setPhoneHint("");
        setOtp("");
        setAadhaarError("");
        setOtpError("");
        setGeneralError("");
        setSuccessMessage("");
    };

    const handleAadhaarChange = (event) => {
        const digitsOnly = event.target.value.replace(/\D/g, "").slice(0, 12);
        setAadhaar(digitsOnly);
        if (aadhaarError) setAadhaarError("");
        if (generalError) setGeneralError("");
    };

    const handleOtpChange = (event) => {
        const digitsOnly = event.target.value.replace(/\D/g, "").slice(0, 6);
        setOtp(digitsOnly);
        if (otpError) setOtpError("");
        if (generalError) setGeneralError("");
    };

    const handleRequestOTP = async () => {
        const error = validateAadhaar();
        if (error) {
            setAadhaarError(error);
            return;
        }

        setGeneralError("");
        setSuccessMessage("");
        setIsRequesting(true);

        try {
            const response = await requestOTP(aadhaar);
            setVerificationId(response.verification_id);
            setPhoneHint(response.phone_hint);
            setOtp("");
            setAadhaarError("");
            setOtpError("");
            setSuccessMessage(`OTP sent to ${response.phone_hint}`);
        } catch (error) {
            setGeneralError(
                error.response?.data?.detail ||
                "Failed to request OTP. Please try again."
            );
        } finally {
            setIsRequesting(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (!verificationId) {
            setGeneralError("Please request an OTP before verifying.");
            return;
        }

        const error = validateOtp();
        if (error) {
            setOtpError(error);
            return;
        }

        setGeneralError("");
        setSuccessMessage("");
        setIsVerifying(true);

        try {
            const response = await verifyOTP(verificationId, otp);
            localStorage.setItem("token", response.access_token);
            setSuccessMessage("Login successful. Redirecting...");
            window.location.href = "/chat";
        } catch (error) {
            setGeneralError(
                error.response?.data?.detail ||
                "OTP verification failed. Please try again."
            );
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 lg:flex lg:items-center lg:justify-center lg:p-10">
            <main className="grid w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-300/50 lg:grid-cols-[1.1fr_0.9fr]">
                <section className="relative overflow-hidden bg-blue-700 px-7 py-10 text-white sm:px-10 lg:px-14 lg:py-14">
                    <div className="absolute -left-20 -top-24 h-64 w-64 rounded-full bg-blue-500/60" />
                    <div className="absolute -bottom-28 -right-20 h-72 w-72 rounded-full border-[28px] border-blue-500/40" />

                    <div className="relative">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25">
                                <Landmark size={24} aria-hidden="true" />
                            </div>
                            <span className="text-xl font-bold tracking-tight">VaaniSeva</span>
                        </div>

                        <p className="mt-12 text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">
                            Government service portal
                        </p>
                        <h1 className="mt-3 max-w-md text-4xl font-bold leading-tight sm:text-5xl">
                            Public services, made simpler.
                        </h1>
                        <p className="mt-5 max-w-lg text-base leading-7 text-blue-100 sm:text-lg">
                            Apply for essential certificates, keep your documents organised,
                            and track every application in one place.
                        </p>

                        <div className="mt-10 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                            <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
                                <FileText size={20} aria-hidden="true" />
                                <p className="mt-3 text-sm font-semibold">Apply online</p>
                                <p className="mt-1 text-xs leading-5 text-blue-100">Choose the certificate you need.</p>
                            </div>
                            <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
                                <ClipboardCheck size={20} aria-hidden="true" />
                                <p className="mt-3 text-sm font-semibold">Track progress</p>
                                <p className="mt-1 text-xs leading-5 text-blue-100">See each application status.</p>
                            </div>
                            <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
                                <ShieldCheck size={20} aria-hidden="true" />
                                <p className="mt-3 text-sm font-semibold">Keep documents</p>
                                <p className="mt-1 text-xs leading-5 text-blue-100">Access uploaded files easily.</p>
                            </div>
                        </div>

                        <div className="mt-10 border-t border-white/20 pt-5 text-sm text-blue-100">
                            Income, Residence, Birth, and Community certificate services.
                        </div>
                    </div>
                </section>

                <section className="flex items-center px-6 py-10 sm:px-10 lg:px-12 lg:py-14">
                    <div className="w-full">
                        <p className="text-sm font-semibold text-blue-700">Secure sign in</p>
                        <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                            Verify your Aadhaar
                        </h2>
                        <p className="mt-3 text-sm leading-6 text-slate-600">
                            Enter your Aadhaar number to securely access your applications and documents.
                        </p>

                        <div className="mt-7 flex items-center gap-3 text-xs font-medium text-slate-500">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-700 text-white">1</span>
                            Aadhaar verification
                            <span className="h-px flex-1 bg-slate-200" />
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-500">2</span>
                            <span className="hidden sm:inline">Access services</span>
                        </div>

                        {generalError && (
                            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                                {generalError}
                            </div>
                        )}

                        {successMessage && (
                            <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                                {successMessage}
                            </div>
                        )}

                        <div className="mt-7">
                            <label className="block text-sm font-semibold text-slate-800">
                                Aadhaar Number
                            </label>
                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength={12}
                                placeholder="Enter 12-digit Aadhaar"
                                value={aadhaar}
                                onChange={handleAadhaarChange}
                                disabled={!!verificationId}
                                className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                            />
                            {aadhaarError && (
                                <p className="mt-2 text-sm text-red-600">{aadhaarError}</p>
                            )}
                        </div>

                        {verificationId && (
                            <div className="mt-6">
                                <label className="block text-sm font-semibold text-slate-800">
                                    One-Time Password
                                </label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={6}
                                    placeholder="Enter 6-digit OTP"
                                    value={otp}
                                    onChange={handleOtpChange}
                                    className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100"
                                />
                                {otpError && (
                                    <p className="mt-2 text-sm text-red-600">{otpError}</p>
                                )}
                            </div>
                        )}

                        {!verificationId ? (
                            <button
                                type="button"
                                onClick={handleRequestOTP}
                                disabled={isRequesting}
                                className="mt-6 w-full rounded-xl bg-blue-700 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-slate-400"
                            >
                                {isRequesting ? "Sending OTP..." : "Request OTP"}
                            </button>
                        ) : (
                            <div className="space-y-3">
                                <button
                                    type="button"
                                    onClick={handleVerifyOTP}
                                    disabled={isVerifying}
                                    className="mt-6 w-full rounded-xl bg-green-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-slate-400"
                                >
                                    {isVerifying ? "Verifying..." : "Verify OTP"}
                                </button>

                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <button
                                        type="button"
                                        onClick={handleRequestOTP}
                                        disabled={isRequesting || isVerifying}
                                        className="w-full rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:bg-slate-200"
                                    >
                                        {isRequesting ? "Resending..." : "Resend OTP"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        disabled={isRequesting || isVerifying}
                                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 disabled:cursor-not-allowed"
                                    >
                                        Change Aadhaar
                                    </button>
                                </div>
                            </div>
                        )}

                        <p className="mt-6 flex items-start gap-2 text-xs leading-5 text-slate-500">
                            <ShieldCheck className="mt-0.5 shrink-0 text-blue-700" size={16} aria-hidden="true" />
                            Your Aadhaar number is used only for secure verification in this portal.
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
}
