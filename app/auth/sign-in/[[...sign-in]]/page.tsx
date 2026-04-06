"use client";
import LoginForm from "@/components/LoginForm";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  interface LoginData {
    token: string;
    user: unknown;
  }
  const handleLogin = (data: LoginData) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    router.push("/");
  };

  return (
    <div className="flex flex-col justify-center h-full items-center">
      <LoginForm />
    </div>
  );
}
