"use client";

import React, { useEffect } from "react";
import SignupForm from "@/components/SignupForm";
import { useSignupStore } from "@/hooks/useSignupStore";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase/client_app";
import { doc, setDoc } from "firebase/firestore";

const SignupPage: React.FC = () => {
  const {
    name,
    email,
    password,
    confirmPassword,
    setName,
    setEmail,
    setPassword,
    setConfirmPassword,
    setError,
    reset,
  } = useSignupStore();

  const [createUserWithEmailAndPassword, , loading, authError] =
    useCreateUserWithEmailAndPassword(auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        email,
        password
      );
      const userId = userCredential?.user?.uid;

      if (userId) {
        await setDoc(doc(db, "users", userId), {
          name,
          email,
          createdAt: new Date(),
        });
      }

      reset();
      console.log("User registered successfully!");
    } catch (err: any) {
      console.error("Error registering user:", err);
      setError(err.message);
    }
  };

  useEffect(() => {
    // Prevent "back" navigation to this page
    if (window.history) {
      window.history.replaceState(null, "", window.location.href);
    }
  }, []);

  return (
    <SignupForm
      name={name}
      email={email}
      password={password}
      confirmPassword={confirmPassword}
      setName={setName}
      setEmail={setEmail}
      setPassword={setPassword}
      setConfirmPassword={setConfirmPassword}
      handleSubmit={handleSubmit}
      error={authError?.message || null}
      loading={loading}
    />
  );
};

export default SignupPage;
