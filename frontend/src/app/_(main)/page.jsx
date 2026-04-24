"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserFromToken, getToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default function MainPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = getToken();
      
      if (!token) {
        setIsLoggedIn(false);
        setIsLoading(false);
        return;
      }

      const userData = getUserFromToken();
      if (!userData) {
        setIsLoggedIn(false);
        setIsLoading(false);
        return;
      }

      setIsLoggedIn(true);
      router.replace("/dashboard");
    };

    checkAuth();
  }, [router]);

  // Still loading auth check
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // Not logged in — show landing page
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-xl">
          <h1 className="text-4xl font-bold mb-4">Discover Events</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Browse and explore upcoming events near you.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => router.push("/dashboard")}>
              Explore Events
            </Button>
            <Button variant="outline" onClick={() => router.push("/sign-in")}>
              Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Logged in — show redirect screen while useEffect fires
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg text-muted-foreground">Redirecting to dashboard...</p>
    </div>
  );
}