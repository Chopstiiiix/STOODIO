"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

const Logo = () => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push("/")}
      className="cursor-pointer"
    >
      <Image
        src="/stoodio-logo.png"
        alt="Stoodio"
        width={180}
        height={60}
        className="object-contain"
        priority
      />
    </div>
  );
};

export default Logo;
