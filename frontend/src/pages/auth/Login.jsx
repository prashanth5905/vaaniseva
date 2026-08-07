import { useState } from "react";
import { requestOTP, verifyOTP } from "../../services/authService";

export default function Login() {
    const [aadhaar, setAadhaar] = useState("");
    const [otp, setOtp] = useState("");
    const [verificationId, setVerificationId] = useState(null);
    const [loading, setLoading] = useState(false);

    async function handleRequestOTP() {
        if (!aadhaar) {
            alert("Please enter your Aadhaar number.");
            return;
        }

        try {
            setLoading(true);

            const response = await requestOTP(aadhaar);

            console.log(response);

            setVerificationId(response.verification_id);

            alert(
                `OTP sent successfully!\nPhone: ${response.phone_hint}`
            );

        } catch (error) {
            alert(
                error.response?.data?.detail ||
                "Failed to request OTP."
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleVerifyOTP() {
        if (!otp) {
            alert("Please enter OTP.");
            return;
        }

        try {
            setLoading(true);

            const response = await verifyOTP(
                verificationId,
                otp
            );

            console.log(response);

            localStorage.setItem(
                "token",
                response.access_token
            );

            alert("Login successful!");

            window.location.href = "/chat";

        } catch (error) {
            alert(
                error.response?.data?.detail ||
                "OTP verification failed."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

                <h1 className="text-3xl font-bold text-center text-blue-600">
                    VaaniSeva
                </h1>

                <p className="text-center text-gray-500 mt-2">
                    Government Service Portal
                </p>

                <input
                    type="text"
                    placeholder="Enter Aadhaar Number"
                    value={aadhaar}
                    onChange={(e) => setAadhaar(e.target.value)}
                    className="w-full mt-8 border rounded-lg px-4 py-3"
                />

                {verificationId && (
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full mt-5 border rounded-lg px-4 py-3"
                    />
                )}

                <button
                    onClick={handleRequestOTP}
                    disabled={loading}
                    className="w-full mt-5 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                >
                    {loading ? "Requesting..." : "Request OTP"}
                </button>

                {verificationId && (
                    <button
                        onClick={handleVerifyOTP}
                        disabled={loading}
                        className="w-full mt-3 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                    >
                        {loading ? "Verifying..." : "Verify OTP"}
                    </button>
                )}

            </div>
        </div>
    );
}
