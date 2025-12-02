"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

import { KeyRound, CheckCircle, AlertTriangle } from "lucide-react";

import { initializeApp } from "firebase/app";
import { getAuth, confirmPasswordReset } from "firebase/auth";

function ResetPasswordInner() {
  const searchParams = useSearchParams();
  const oobCode = searchParams.get("oobCode") || "";
  const router = useRouter();

  const [auth, setAuth] = useState(null);

  useEffect(() => {
    try {
      const firebaseConfig = JSON.parse(
        typeof __firebase_config !== "undefined" ? __firebase_config : "{}"
      );

      const app = initializeApp(firebaseConfig);
      setAuth(getAuth(app));
    } catch (err) {
      console.error("Firebase init failed:", err);
    }
  }, []);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (!oobCode) {
      setMessage("Invalid or missing password reset link.");
    } else {
      setIsVerified(true);
    }
  }, [oobCode]);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    if (!oobCode) {
      setMessage("Error: Reset code is missing.");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      setIsLoading(false);
      return;
    }

    if (password !== confirm) {
      setMessage("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    if (!auth) {
      setMessage("Firebase is not ready yet. Try again.");
      setIsLoading(false);
      return;
    }

    try {
      await confirmPasswordReset(auth, oobCode, password);

      setMessage("Password reset successful! Redirecting to login...");
      setTimeout(() => router.push("/login"), 1500);
    } catch (error) {
      console.error("Password reset failed:", error);

      let errorMessage =
        "Password reset failed. The link may have expired or been used.";

      if (error.code === "auth/invalid-action-code") {
        errorMessage = "The reset link is invalid or expired.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password is too weak.";
      } else if (error.code === "auth/expired-action-code") {
        errorMessage = "The link has expired.";
      }

      setMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  const isFormDisabled = isLoading || !isVerified;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-xl space-y-6">
        <div className="text-center">
          <KeyRound className="w-12 h-12 mx-auto text-blue-600" />
          <h2 className="mt-4 text-3xl font-bold">Set New Password</h2>
        </div>

        {message && (
          <div
            className={`p-3 text-sm rounded flex items-center ${
              message.includes("successful")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.includes("successful") ? (
              <CheckCircle className="w-4 h-4 mr-2" />
            ) : (
              <AlertTriangle className="w-4 h-4 mr-2" />
            )}
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            className="w-full border p-2 rounded"
            placeholder="New password"
            value={password}
            disabled={isFormDisabled}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            className="w-full border p-2 rounded"
            placeholder="Confirm password"
            value={confirm}
            disabled={isFormDisabled}
            onChange={(e) => setConfirm(e.target.value)}
          />

          <button
            className={`w-full py-2 rounded text-white ${
              isFormDisabled ? "bg-gray-400" : "bg-green-600"
            }`}
            disabled={isFormDisabled}
          >
            {isLoading ? "Saving..." : "Save New Password"}
          </button>
        </form>

        <div className="text-center">
          <Link href="/login" className="text-blue-600">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordInner />
    </Suspense>
  );
}
