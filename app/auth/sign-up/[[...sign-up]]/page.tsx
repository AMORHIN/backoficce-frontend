"use client";
import RegisterForm from "@/components/RegisterForm";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const handleRegister = () => {
    setTimeout(() => router.push("/auth/sign-in"), 1200);
  };

  return (
    <div className="flex flex-col justify-center h-full items-center">
      <RegisterForm onRegister={handleRegister} />
    </div>
  );
}
