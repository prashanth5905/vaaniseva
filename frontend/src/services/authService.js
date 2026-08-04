import api from "../api/axios";

export async function requestOTP(aadhaarNumber) {
    const response = await api.post("/otp/request", {
        aadhaar_number: aadhaarNumber,
    });

    return response.data;
}

export async function verifyOTP(verificationId, otp) {
    const response = await api.post("/otp/verify", {
        verification_id: verificationId,
        otp,
    });

    return response.data;
}