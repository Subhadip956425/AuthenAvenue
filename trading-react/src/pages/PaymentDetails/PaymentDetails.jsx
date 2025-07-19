import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PaymentDetailsForm from "./PaymentDetailsForm";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { getPaymentDetils } from "@/State/Withdrawal/Action";

const PaymentDetails = () => {
  const { withdrawal } = useSelector((store) => store);
  const dispatch = useDispatch();

  useEffect(() => {
    // dispatch(getPaymentDetils({ jwt: localStorage.getItem("jwt") }));
    const token = localStorage.getItem("jwt");
    // console.log("JWT from localStorage:", token); // ✅ Add logging to verify it's valid
    dispatch(getPaymentDetils(token));
  }, []);

  return (
    <div className="px-20">
      <h1 className="text-3xl font-bold py-10">Payment Details</h1>

      {withdrawal.paymentDetails ? (
        <Card>
          <CardHeader className="flex justify-between items-center">
            <div>
              <CardTitle>Bank Details</CardTitle>
              <CardDescription>
                A/C No : {withdrawal.paymentDetails?.accountNumber}
              </CardDescription>
            </div>

            <Dialog>
              <DialogTrigger>
                <Button variant="outline">Edit</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Payment Details</DialogTitle>
                </DialogHeader>
                <PaymentDetailsForm
                  defaultValues={{
                    id: withdrawal.paymentDetails.id,
                    accountHolderName:
                      withdrawal.paymentDetails.accountHolderName,
                    ifsc: withdrawal.paymentDetails.ifsc,
                    accountNumber: withdrawal.paymentDetails.accountNumber,
                    bankName: withdrawal.paymentDetails.bankName,
                  }}
                  isEdit={true}
                />
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <p className="w-32">A/C Holder</p>
              <p className="text-gray-400">
                : {withdrawal.paymentDetails?.accountHolderName}
              </p>
            </div>
            <div className="flex items-center">
              <p className="w-32">Bank Name</p>
              <p className="text-gray-400">
                : {withdrawal.paymentDetails?.bankName}
              </p>
            </div>
            <div className="flex items-center">
              <p className="w-32">IFSC</p>
              <p className="text-gray-400">
                : {withdrawal.paymentDetails?.ifsc}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Dialog>
          <DialogTrigger>
            <Button className="py-6">Add payment details</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Payment Details</DialogTitle>
            </DialogHeader>
            <PaymentDetailsForm />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default PaymentDetails;
