"use client";

import { useCallback, useState } from "react";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import useRegisterModal from "@/hooks/useRegisterModal";
import useLoginModal from "@/hooks/useLoginModal";
import Modal from "./Modal";
import Input from "../inputs/Input";
import { registerUser } from "@/actions/auth";
import { toast } from "react-hot-toast";

const RegisterModal = () => {
  const router = useRouter();
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<string>("");
  const [studioType, setStudioType] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (!userType) {
      toast.error("Please select if you're a host or guest");
      return;
    }

    if (userType === "host" && !studioType) {
      toast.error("Please select your studio type");
      return;
    }

    setIsLoading(true);

    const result = await registerUser({
      email: data.email,
      name: data.name,
      password: data.password,
      userType,
      studioType: userType === "host" ? studioType : undefined,
    });

    if (result.error) {
      setIsLoading(false);
      toast.error(result.error);
      return;
    }

    toast.success("Account created! Logging you in...");

    // Automatically log in the user
    const signInResult = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    setIsLoading(false);

    if (signInResult?.error) {
      toast.error("Account created but login failed. Please log in manually.");
      registerModal.onClose();
      loginModal.onOpen();
      return;
    }

    toast.success("Welcome to Stoodio!");
    registerModal.onClose();
    router.refresh();
  };

  const onToggle = useCallback(() => {
    registerModal.onClose();
    loginModal.onOpen();
  }, [registerModal, loginModal]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Input
        id="email"
        label="Email"
        type="email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="name"
        label="Name"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="password"
        label="Password"
        type="password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold">I am signing up as:</label>
        <div className="grid grid-cols-2 gap-3">
          <div
            onClick={() => !isLoading && setUserType("guest")}
            className={`
              p-4
              border-2
              rounded-lg
              cursor-pointer
              transition
              text-center
              ${userType === "guest"
                ? "border-primary bg-primary/5"
                : "border-neutral-300 hover:border-neutral-400"
              }
              ${isLoading && "opacity-50 cursor-not-allowed"}
            `}
          >
            <div className="font-semibold">Guest</div>
            <div className="text-xs text-neutral-500 mt-1">Book studios</div>
          </div>

          <div
            onClick={() => !isLoading && setUserType("host")}
            className={`
              p-4
              border-2
              rounded-lg
              cursor-pointer
              transition
              text-center
              ${userType === "host"
                ? "border-primary bg-primary/5"
                : "border-neutral-300 hover:border-neutral-400"
              }
              ${isLoading && "opacity-50 cursor-not-allowed"}
            `}
          >
            <div className="font-semibold">Host</div>
            <div className="text-xs text-neutral-500 mt-1">List studios</div>
          </div>
        </div>
      </div>

      {userType === "host" && (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold">Select your studio type:</label>
          <div className="grid grid-cols-2 gap-3">
            {["Music", "Podcast", "Photo", "Make up"].map((type) => (
              <div
                key={type}
                onClick={() => !isLoading && setStudioType(type)}
                className={`
                  p-3
                  border-2
                  rounded-lg
                  cursor-pointer
                  transition
                  text-center
                  text-sm
                  ${studioType === type
                    ? "border-primary bg-primary/5 font-semibold"
                    : "border-neutral-300 hover:border-neutral-400"
                  }
                  ${isLoading && "opacity-50 cursor-not-allowed"}
                `}
              >
                {type}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <div className="text-neutral-500 text-center mt-4 font-light">
        <p>
          Already have an account?
          <span
            onClick={onToggle}
            className="
              text-neutral-800
              cursor-pointer
              hover:underline
              ml-1
            "
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={registerModal.isOpen}
      title="Register"
      actionLabel="Continue"
      onClose={registerModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default RegisterModal;
