"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { getUserFromToken, removeToken, getToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname(); //  re-runs effect on every route change
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token) {
      const userData = getUserFromToken();
      setUser(userData);
    } else {
      setUser(null); //  clear user if token is gone (e.g. after logout)
    }
    setIsLoading(false);
  }, [pathname]); //  re-check auth on every page navigation

  const handleLogout = () => {
    removeToken();
    setUser(null);
    router.push("/sign-in");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b z-20 text-black">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center">
          <h1>EVENTBOOK</h1>
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="w-24 h-8 bg-gray-100 animate-pulse rounded" />
          ) : user ? (
            <>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">{user.email}</span>
                {user.isAdmin && (
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
                    Admin
                  </span>
                )}
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="text-sm"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/sign-in" className="text-sm border px-3 py-1 rounded hover:bg-gray-50">
                Sign In
              </Link>
              <Link href="/sign-up" className="text-sm border px-3 py-1 rounded hover:bg-gray-50">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}