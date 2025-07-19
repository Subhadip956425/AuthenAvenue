import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { login } from "@/State/Auth/Action";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const SigninForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    resolver: "",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await dispatch(
        login({ data, navigate, setSuccessMessage, setErrorMessage })
      );
      console.log(data);
    } catch (error) {
      setErrorMessage("Login failed. Please check your credentials.");
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-center pb-3">Login</h1>

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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className="border w-full border-gray-700 p-5"
                    placeholder="Email"
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
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      className="border w-full border-gray-700 p-5 pr-10"
                      placeholder="Password"
                      {...field}
                    />
                    <div
                      className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </div>
                  </div>
                </FormControl>
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

export default SigninForm;
