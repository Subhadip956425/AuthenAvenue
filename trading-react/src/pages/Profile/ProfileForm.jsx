import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { updateProfileDetails } from "@/State/Auth/Action"; // Assume this action exists

const schema = yup.object().shape({
  fullName: yup.string().required("Full name is required"),
  dob: yup
    .string()
    .required("Date of birth is required")
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  nationality: yup.string().required("Nationality is required"),
  address: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  postcode: yup.string().required("Postcode is required"),
  country: yup.string().required("Country is required"),
});

const ProfileForm = ({ defaultValues }) => {
  const dispatch = useDispatch();
  const [successMessage, setSuccessMessage] = useState("");

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: defaultValues?.fullName || "",
      dob: defaultValues?.dob || "",
      nationality: defaultValues?.nationality || "",
      address: defaultValues?.address || "",
      city: defaultValues?.city || "",
      postcode: defaultValues?.postcode || "",
      country: defaultValues?.country || "",
    },
  });

  const onSubmit = async (data) => {
    const jwt = localStorage.getItem("jwt");
    await dispatch(updateProfileDetails(data, jwt));
    setSuccessMessage("Profile updated successfully");
  };

  useEffect(() => {
    if (successMessage) {
      const t = setTimeout(() => setSuccessMessage(""), 4000);
      return () => clearTimeout(t);
    }
  }, [successMessage]);

  return (
    <div className="px-5 py-3">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {[
            "fullName",
            "dob",
            "nationality",
            "address",
            "city",
            "postcode",
            "country",
          ].map((field) => {
            const labels = {
              fullName: "Full Name",
              dob: "Date of Birth",
              nationality: "Nationality",
              address: "Address",
              city: "City",
              postcode: "Postcode",
              country: "Country",
            };
            return (
              <FormField
                key={field}
                control={form.control}
                name={field}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{labels[field.name]}</FormLabel>
                    <FormControl>
                      <Input {...field} className="border w-full p-4" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          })}

          {successMessage && (
            <p className="text-green-600 text-sm">{successMessage}</p>
          )}

          <Button type="submit" className="w-full py-4">
            Update Profile
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ProfileForm;
