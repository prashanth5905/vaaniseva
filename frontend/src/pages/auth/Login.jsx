import { useState } from "react";
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
        <div className="flex items-center justify-center min-h-screen bg-slate-100 px-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-center text-blue-600">
                    VaaniSeva
                </h1>

                <p className="text-center text-gray-500 mt-2">
                    Government Service Portal
                </p>

                {generalError && (
                    <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {generalError}
                    </div>
                )}

                {successMessage && (
                    <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                        {successMessage}
                    </div>
                )}

                <div className="mt-8">
                    <label className="block text-sm font-medium text-gray-700">
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
                        className="w-full mt-2 rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-slate-100"
                    />
                    {aadhaarError && (
                        <p className="mt-2 text-sm text-red-600">{aadhaarError}</p>
                    )}
                </div>

                {verificationId && (
                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700">
                            One-Time Password
                        </label>
                        <input
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChange={handleOtpChange}
                            className="w-full mt-2 rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
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
                        className="w-full mt-6 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                    >
                        {isRequesting ? "Sending OTP..." : "Request OTP"}
                    </button>
                ) : (
                    <div className="space-y-3">
                        <button
                            type="button"
                            onClick={handleVerifyOTP}
                            disabled={isVerifying}
                            className="w-full mt-6 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-400"
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
            </div>
        </div>
    );
}
