import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getPaymentDetils, withdrawalRequest } from "@/State/Withdrawal/Action";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BankImg from "@/assets/Bank.png";

const WithdrawalForm = () => {
  const [amount, setAmount] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const dispatch = useDispatch();
  const { wallet, withdrawal } = useSelector((store) => store);
  const balance = parseFloat(wallet?.userWallet?.balance || 0);

  const handleChange = (e) => {
    setAmount(e.target.value);
    if (errorMessage) setErrorMessage(""); // Clear error on new input
  };

  const handleSubmit = () => {
    const amt = parseFloat(amount);

    if (!withdrawal.paymentDetails) {
      setErrorMessage("Please add your payment details before withdrawing.");
      return;
    }

    if (!amt || amt <= 0) {
      setErrorMessage("Please enter a valid withdrawal amount.");
      return;
    }

    if (amt > balance) {
      setErrorMessage("You cannot withdraw more than your available balance.");
      return;
    }

    // Proceed with dispatch
    dispatch(
      withdrawalRequest({
        amount: amt,
        jwt: localStorage.getItem("jwt"),
      })
    );

    setSuccessMessage("Withdrawal request submitted.");
    setAmount("");
  };

  useEffect(() => {
    if (!withdrawal.paymentDetails) {
      dispatch(getPaymentDetils(localStorage.getItem("jwt")));
    }
  }, []);

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
    <div className="pt-10 space-y-5">
      <div className="flex justify-between items-center rounded-md bg-slate-900 text-xl font-bold px-5 py-4">
        <p>Available Balance</p>
        <p>₹{balance.toFixed(2)}</p>
      </div>

      <div className="flex flex-col items-center">
        <h1>Enter Withdrawal Amount</h1>
        <div className="flex items-center justify-center">
          <Input
            onChange={handleChange}
            value={amount}
            className="withdrawalInput py-7 focus:outline-none px-0 text-2xl text-center"
            placeholder="₹999"
            type="number"
          />
        </div>
        {errorMessage && (
          <p className="text-red-500 text-sm pt-2">{errorMessage}</p>
        )}
        {successMessage && (
          <p className="text-green-500 text-sm pt-2">{successMessage}</p>
        )}
      </div>

      <div>
        <p className="pb-2">Transfer To</p>
        <div className="flex items-center gap-5 border px-5 py-2 rounded-md">
          <img className="h-8 w-8" src={BankImg} alt="" />
          <div>
            {withdrawal.paymentDetails ? (
              <>
                <p className="text-xl font-bold">
                  {withdrawal.paymentDetails.bankName}
                </p>
                <p className="text-xs">
                  {`**** **** **** ${withdrawal.paymentDetails.accountNumber.slice(
                    -4
                  )}`}
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-400">
                Loading payment details...
              </p>
            )}
          </div>
        </div>
      </div>

      <Button onClick={handleSubmit} className="w-full py-7 text-xl">
        Withdraw
      </Button>
    </div>
  );
};

export default WithdrawalForm;
