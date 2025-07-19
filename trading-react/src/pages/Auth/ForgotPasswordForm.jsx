import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  sendForgotPasswordOtp,
  verifyForgotPasswordOtp,
} from "@/State/Auth/Action";
import { useDispatch } from "react-redux";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const ForgotPasswordForm = () => {
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [sessionId, setSessionId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
      otp: "",
      newPassword: "",
    },
  });

  const extractErrorMessage = (err) => {
    if (typeof err === "string") return err;
    if (typeof err === "object") {
      return (
        err.message || err.error || err.status || "An unknown error occurred"
      );
    }
    return "An error occurred";
  };

  const onSubmit = async (data) => {
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);
    if (step === 1) {
      const res = await dispatch(sendForgotPasswordOtp(data.email));
      setLoading(false);
      if (res?.success) {
        setSessionId(res.session);
        setSuccessMessage("OTP sent successfully. Please check your email.");
        setStep(2);
      } else {
        setErrorMessage(extractErrorMessage(res?.message || res));
      }
    } else if (step === 2) {
      const res = await dispatch(
        verifyForgotPasswordOtp(sessionId, data.otp, data.newPassword)
      );
      setLoading(false);
      if (res?.success) {
        setSuccessMessage("Password reset successful. Redirecting to login...");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        setErrorMessage(extractErrorMessage(res?.message || res));
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-md">
      <h1 className="text-xl font-bold text-center pb-3">Forgot Password</h1>
      {errorMessage && (
        <div className="bg-red-100 text-red-700 p-2 text-sm rounded mb-3 text-center">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 text-green-700 p-2 text-sm rounded mb-3 text-center">
          {successMessage}
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {step === 1 && (
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {step === 2 && (
            <>
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="text" placeholder="Enter OTP" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="New Password"
                          {...field}
                          className="pr-10" // Add padding for eye icon
                        />
                        <span
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
            ) : step === 1 ? (
              "Send OTP"
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ForgotPasswordForm;
