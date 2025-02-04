"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/client_app";
import { useAuthStore } from "@/hooks/useAuthStore";

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, initializeAuthState } = useAuthStore();
  const [showDialog, setShowDialog] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/reading", label: "Reading Test" },
    { href: "/dashboard", label: "Progress Dashboard" },
  ];

  useEffect(() => {
    initializeAuthState();
  }, [initializeAuthState]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setShowDialog(false);
      router.push("/login");
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => router.push("/")}>
          <div className="flex items-center space-x-2">
            <Image
              src="/logo.svg" // Replace with your logo path
              alt="ReadAssist Logo"
              width={32}
              height={32}
            />
            <span className="text-lg font-bold text-gray-800">LearnEase</span>
          </div>
        </button>

        {/* Navigation Links */}
        {isAuthenticated && (
          <div>
            <div className="hidden md:flex space-x-6">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium ${
                    pathname === link.href
                      ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex items-center space-x-4">
              {/* <button className="text-gray-600 hover:text-blue-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11 19a8 8 0 100-16 8 8 0 000 16zm10-2l-4.35-4.35"
            />
          </svg> */}
              {/* </button> */}
              {/* <Image
          src="/profile.jpg" // Replace with your profile image path
          alt="Profile"
          width={32}
          height={32}
          className="rounded-full cursor-pointer"
        /> */}
              {showDialog && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="bg-white p-6 rounded-md shadow-md">
                    <p className="mb-4">Are you sure you want to logout?</p>
                    <div className="flex justify-end gap-4">
                      <button
                        onClick={() => setShowDialog(false)}
                        className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleLogout}
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {isAuthenticated && (
          <div>
            <button
              onClick={() => setShowDialog(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
