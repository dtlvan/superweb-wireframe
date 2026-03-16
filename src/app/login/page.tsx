"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Phone, ArrowLeft, Loader2 } from "lucide-react";
import { login } from "@/lib/auth-store";

type Step = "phone" | "otp" | "verifying";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-focus first OTP input
  useEffect(() => {
    if (step === "otp") {
      otpRefs.current[0]?.focus();
    }
  }, [step]);

  function formatPhone(value: string) {
    // Only keep digits
    const digits = value.replace(/\D/g, "");
    return digits.slice(0, 10);
  }

  async function handlePhoneSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (phone.length < 9) {
      setError("Vui lòng nhập số điện thoại hợp lệ");
      return;
    }

    setIsSubmitting(true);
    // Simulate sending OTP
    await new Promise((r) => setTimeout(r, 1200));
    setIsSubmitting(false);
    setStep("otp");
  }

  function handleOtpChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");

    // Auto-advance to next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits entered
    if (value && index === 5 && newOtp.every((d) => d !== "")) {
      handleOtpSubmit(newOtp.join(""));
    }
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }

  function handleOtpPaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);

    if (pasted.length === 6) {
      handleOtpSubmit(pasted);
    } else {
      otpRefs.current[pasted.length]?.focus();
    }
  }

  async function handleOtpSubmit(code: string) {
    setStep("verifying");
    setError("");

    // Simulate verification
    await new Promise((r) => setTimeout(r, 1500));

    // Accept any 6-digit code for wireframe
    login(phone);
    router.push("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden">
      {/* V-ID watermark pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 15L30 40H25L15 15H20ZM30 15L35 28L40 15H35L30 15Z' fill='%23EA0029'/%3E%3C/svg%3E")`,
        backgroundSize: "80px 80px",
      }} />

      <div className="w-full max-w-md px-4 relative z-10">
        {/* V-ID Logo */}
        <div className="flex items-center justify-center mb-8">
          <img src="/vid-logo.svg" alt="V-ID" className="h-12" />
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {step === "phone" && (
            <>
              <h1 className="text-2xl font-bold text-center text-gray-900 mb-8">
                Đăng nhập
              </h1>

              <form onSubmit={handlePhoneSubmit}>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Số điện thoại
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <Phone size={18} />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(formatPhone(e.target.value));
                      setError("");
                    }}
                    placeholder="Nhập tại đây"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#EA0029] focus:ring-2 focus:ring-[#EA0029]/10 transition-all text-[15px]"
                    autoFocus
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-500 mt-2">{error}</p>
                )}

                <p className="text-sm text-gray-500 mt-3">
                  Chúng tôi sẽ gửi mã xác minh qua SMS
                </p>

                <button
                  type="submit"
                  disabled={isSubmitting || !phone}
                  className="w-full mt-6 py-3.5 rounded-xl bg-gray-900 text-white font-semibold text-[15px] hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Đang gửi mã...
                    </>
                  ) : (
                    "Tiếp tục"
                  )}
                </button>
              </form>

              <p className="text-xs text-gray-500 mt-5 text-center leading-relaxed">
                Bằng cách nhấn vào Tiếp tục, bạn đồng ý với{" "}
                <a href="#" className="text-blue-600 underline">Điều khoản Dịch vụ</a>{" "}
                và{" "}
                <a href="#" className="text-blue-600 underline">Chính sách Bảo vệ dữ liệu cá nhân</a>.
              </p>

              <div className="mt-6 text-center">
                <button
                  onClick={() => router.back()}
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors inline-flex items-center gap-1.5"
                >
                  <ArrowLeft size={14} />
                  Quay lại
                </button>
              </div>
            </>
          )}

          {(step === "otp" || step === "verifying") && (
            <>
              <button
                onClick={() => { setStep("phone"); setOtp(["", "", "", "", "", ""]); setError(""); }}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6"
              >
                <ArrowLeft size={16} />
                Quay lại
              </button>

              <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
                Nhập mã xác minh
              </h1>
              <p className="text-sm text-gray-500 text-center mb-8">
                Mã OTP đã được gửi đến{" "}
                <span className="font-semibold text-gray-900">{phone}</span>
              </p>

              {/* OTP inputs */}
              <div className="flex justify-center gap-3 mb-6" onPaste={handleOtpPaste}>
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => { otpRefs.current[idx] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    disabled={step === "verifying"}
                    className="w-12 h-14 text-center text-xl font-bold text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-[#EA0029] focus:ring-2 focus:ring-[#EA0029]/10 transition-all disabled:opacity-50"
                  />
                ))}
              </div>

              {error && (
                <p className="text-sm text-red-500 text-center mb-4">{error}</p>
              )}

              {step === "verifying" && (
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Loader2 size={16} className="animate-spin" />
                  Đang xác minh...
                </div>
              )}

              {step === "otp" && (
                <p className="text-sm text-gray-500 text-center">
                  Không nhận được mã?{" "}
                  <button className="text-[#EA0029] font-medium hover:underline">
                    Gửi lại
                  </button>
                </p>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-400 text-center mt-6">
          V-App Superweb &copy; 2026
        </p>
      </div>
    </div>
  );
}
