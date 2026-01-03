"use client";

import { useRouter } from "next/navigation";
import { Home } from "lucide-react";

const Logo = () => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push("/")}
      className="flex items-center gap-2 cursor-pointer"
    >
      <Home className="text-primary" size={32} />
      <span className="hidden md:block text-xl font-bold text-primary">
        Stoodio
      </span>
    </div>
  );
};

export default Logo;
