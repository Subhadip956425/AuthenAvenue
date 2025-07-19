import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { addPaymentDetails, getPaymentDetils } from "@/State/Withdrawal/Action";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// ✅ Validation schema
const schema = yup.object().shape({
  accountHolderName: yup.string().required("Account holder name is required"),
  ifsc: yup.string().required("IFSC code is required"),
  accountNumber: yup
    .string()
    .required("Account number is required")
    .min(6, "Too short"),
  confirmAccountNumber: yup
    .string()
    .oneOf([yup.ref("accountNumber")], "Account numbers must match")
    .required("Confirm account number"),
  bankName: yup.string().required("Bank name is required"),
});

const PaymentDetailsForm = ({ defaultValues = {}, isEdit = false }) => {
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const form = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    shouldFocusError: true,
    defaultValues: {
      accountHolderName: defaultValues.accountHolderName || "",
      ifsc: defaultValues.ifsc || "",
      accountNumber: defaultValues.accountNumber || "",
      confirmAccountNumber: defaultValues.accountNumber || "",
      bankName: defaultValues.bankName || "",
    },
  });

  const onSubmit = async (data) => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      setErrorMessage("Authentication token missing. Please login again.");
      return;
    }

    if (isEdit && defaultValues.id) {
      data.id = defaultValues.id;
    }

    try {
      await dispatch(addPaymentDetails(data, jwt, isEdit));
      await dispatch(getPaymentDetils(jwt));

      setSuccessMessage(
        isEdit
          ? "Payment details updated successfully."
          : "Payment details added successfully."
      );

      if (isEdit) {
        // Reset to the latest values
        form.reset({
          accountHolderName: data.accountHolderName,
          ifsc: data.ifsc,
          accountNumber: data.accountNumber,
          confirmAccountNumber: data.accountNumber,
          bankName: data.bankName,
        });
      } else {
        // Clear the form
        form.reset({
          accountHolderName: "",
          ifsc: "",
          accountNumber: "",
          confirmAccountNumber: "",
          bankName: "",
        });
      }
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  // Auto-clear messages
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  return (
    <div className="px-10 py-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Form Fields */}
          {[
            "accountHolderName",
            "ifsc",
            "accountNumber",
            "confirmAccountNumber",
            "bankName",
          ].map((fieldName, idx) => {
            const labelMap = {
              accountHolderName: "Account Holder Name",
              ifsc: "IFSC Code",
              accountNumber: "Account Number",
              confirmAccountNumber: "Confirm Account Number",
              bankName: "Bank Name",
            };

            return (
              <FormField
                key={idx}
                control={form.control}
                name={fieldName}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{labelMap[fieldName]}</FormLabel>
                    <FormControl>
                      <Input
                        className="border w-full border-gray-700 p-5"
                        placeholder={labelMap[fieldName]}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          })}

          {errorMessage && (
            <p className="text-red-500 text-sm pt-1">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="text-green-500 text-sm pt-1">{successMessage}</p>
          )}

          <Button type="submit" className="w-full py-5">
            {isEdit ? "Update Details" : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default PaymentDetailsForm;
