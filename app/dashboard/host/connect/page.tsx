"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { CheckCircle, XCircle, Loader2, AlertCircle } from "lucide-react";
import Container from "@/components/Container";

interface ConnectStatus {
  connected: boolean;
  accountId: string | null;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
  requirements?: {
    currentlyDue: string[];
    pendingVerification: string[];
  };
}

export default function ConnectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<ConnectStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboarding, setIsOnboarding] = useState(false);

  const success = searchParams?.get("success");
  const refresh = searchParams?.get("refresh");

  useEffect(() => {
    if (success) {
      toast.success("Stripe account connected successfully!");
      // Remove query params
      router.replace("/dashboard/host/connect");
    } else if (refresh) {
      toast.info("Please complete the onboarding process");
      router.replace("/dashboard/host/connect");
    }

    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/connect/status");

      if (!res.ok) {
        throw new Error("Failed to fetch status");
      }

      const data = await res.json();
      setStatus(data);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to fetch connection status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnboard = async () => {
    setIsOnboarding(true);

    try {
      const res = await fetch("/api/connect/onboard", {
        method: "POST",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create onboarding link");
      }

      const data = await res.json();

      // Redirect to Stripe onboarding
      window.location.href = data.url;
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to start onboarding");
      setIsOnboarding(false);
    }
  };

  if (isLoading) {
    return (
      <Container>
        <div className="max-w-2xl mx-auto py-16 text-center">
          <Loader2 className="animate-spin h-12 w-12 mx-auto text-blue-600 mb-4" />
          <p className="text-gray-600">Loading connection status...</p>
        </div>
      </Container>
    );
  }

  const isFullyConnected =
    status?.connected &&
    status?.chargesEnabled &&
    status?.payoutsEnabled &&
    status?.detailsSubmitted;

  return (
    <Container>
      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Stripe Connect
        </h1>
        <p className="text-gray-600 mb-8">
          Connect your Stripe account to receive payouts
        </p>

        {/* Status Card */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-8 mb-6">
          {!status?.connected ? (
            <div className="text-center">
              <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Not Connected
              </h2>
              <p className="text-gray-600 mb-6">
                Connect your Stripe account to start receiving payouts from
                bookings
              </p>
              <button
                onClick={handleOnboard}
                disabled={isOnboarding}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isOnboarding ? "Redirecting..." : "Connect Stripe Account"}
              </button>
            </div>
          ) : isFullyConnected ? (
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Connected & Ready
              </h2>
              <p className="text-gray-600 mb-4">
                Your Stripe account is fully connected and ready to receive
                payouts
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-green-900">
                  <strong>Account ID:</strong> {status.accountId}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  <span>Charges Enabled</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  <span>Payouts Enabled</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  <span>Details Submitted</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Setup Incomplete
              </h2>
              <p className="text-gray-600 mb-6">
                Your Stripe account needs additional setup
              </p>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm font-semibold text-yellow-900 mb-2">
                  Status:
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    {status.chargesEnabled ? (
                      <CheckCircle size={16} className="text-green-600" />
                    ) : (
                      <XCircle size={16} className="text-red-600" />
                    )}
                    <span>Charges Enabled</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {status.payoutsEnabled ? (
                      <CheckCircle size={16} className="text-green-600" />
                    ) : (
                      <XCircle size={16} className="text-red-600" />
                    )}
                    <span>Payouts Enabled</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {status.detailsSubmitted ? (
                      <CheckCircle size={16} className="text-green-600" />
                    ) : (
                      <XCircle size={16} className="text-red-600" />
                    )}
                    <span>Details Submitted</span>
                  </div>
                </div>

                {status.requirements?.currentlyDue &&
                  status.requirements.currentlyDue.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-yellow-300">
                      <p className="text-sm font-semibold text-yellow-900 mb-2">
                        Required Actions:
                      </p>
                      <ul className="list-disc list-inside text-sm text-yellow-800">
                        {status.requirements.currentlyDue.map((req, i) => (
                          <li key={i}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>

              <button
                onClick={handleOnboard}
                disabled={isOnboarding}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isOnboarding ? "Redirecting..." : "Complete Setup"}
              </button>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            About Stripe Connect
          </h3>
          <ul className="space-y-2 text-sm text-blue-900">
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>
                Stripe Connect allows you to receive payouts directly to your
                bank account
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>Platform fee: 10% of each booking</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>
                Payouts are processed automatically after bookings are completed
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>Secure and compliant with international standards</span>
            </li>
          </ul>
        </div>
      </div>
    </Container>
  );
}
