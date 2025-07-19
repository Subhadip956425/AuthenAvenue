import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { register } from "@/State/Auth/Action";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const SignupForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    resolver: "",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await dispatch(
        register(data, navigate, setSuccessMessage, setErrorMessage)
      );
    } catch (error) {
      setErrorMessage("Signup failed. Please try again.");
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-center pb-3">Create New Account</h1>
      {/* ✅ Success Message */}
      {successMessage && (
        <div className="bg-green-100 text-green-700 p-2 text-sm rounded mb-3 text-center">
          {successMessage}
        </div>
      )}

      {/* ❌ Error Message */}
      {errorMessage && (
        <div className="bg-red-100 text-red-700 p-2 text-sm rounded mb-3 text-center">
          {errorMessage}
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="fullName"
            rules={{ required: "Full name is required" }}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className="border w-full border-gray-700 p-5"
                    placeholder="Full Name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            rules={{ required: "Email is required" }}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className="border w-full border-gray-700 p-5"
                    placeholder="Email"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            rules={{ required: "Password is required" }}
            render={({ field }) => (
              <FormItem>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"} // 👈 toggle type
                      className="border w-full border-gray-700 p-5 pr-10"
                      placeholder="Password"
                      {...field}
                    />
                  </FormControl>

                  <span
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full py-5">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SignupForm;
