"use client";

import SignupForm from "@/components/SignupForm";
import { useSignupStore } from "@/hooks/useSignupStore";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase/client_app";
import { doc, setDoc } from "firebase/firestore";
import { AppUser, UserRole } from "@/interface/user";
import { useRouter } from "next/navigation";

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
    error,
  } = useSignupStore();
  const router = useRouter();

  const [createUserWithEmailAndPassword, , loading, authError] =
    useCreateUserWithEmailAndPassword(auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        email,
        password
      );
      const userId = userCredential?.user?.uid;

      if (!userId) return;

      const user: AppUser = {
        id: userId,
        name: name,
        email: email,
        createdAt: new Date(),
        role: UserRole.STUDENT,
      };

      if (userId) {
        await setDoc(doc(db, "users", userId), user, {
          merge: true,
        });

        router.push("/");
      }

      reset();
      console.log("User registered successfully!");
    } catch (err: any) {
      console.error("Error registering user:", err);
      setError(err.message);
    }
  };

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
      error={authError?.message || error}
      loading={loading}
    />
  );
};

export default SignupPage;
