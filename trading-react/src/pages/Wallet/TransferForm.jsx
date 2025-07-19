import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { transferMoney } from "@/State/Wallet/Action";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const TransferForm = () => {
  const dispatch = useDispatch();
  const { wallet } = useSelector((store) => store);

  const [formData, setFormData] = React.useState({
    amount: "",
    walletId: "",
    purpose: "",
  });

  const [errorMessage, setErrorMessage] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.trimStart() });
  };

  const handleSubmit = () => {
    if (!formData.amount || !formData.walletId || !formData.purpose) {
      setErrorMessage("All fields are required.");
      return;
    }

    setIsLoading(true);

    dispatch(
      transferMoney({
        jwt: localStorage.getItem("jwt"),
        walletId: formData.walletId,
        reqData: {
          amount: formData.amount,
          purpose: formData.purpose,
        },
      })
    )
      .then((res) => {
        setIsLoading(false);
        if (res?.error) {
          setErrorMessage(res.error || "Wallet not found.");
          setSuccessMessage("");
        } else {
          setSuccessMessage("Transfer successful!");
          setErrorMessage("");
          setFormData({
            amount: "",
            walletId: "",
            purpose: "",
          });
        }
      })
      .catch(() => {
        setIsLoading(false);
        setErrorMessage("Something went wrong. Please try again.");
        setSuccessMessage("");
      });
  };

  return (
    <div className="pt-10 space-y-5">
      {errorMessage && (
        <p className="text-red-500 font-semibold text-center">{errorMessage}</p>
      )}
      {successMessage && (
        <p className="text-green-600 font-semibold text-center">
          {successMessage}
        </p>
      )}

      <div>
        <h1 className="pb-1">Enter Amount</h1>
        <Input
          name="amount"
          onChange={handleChange}
          value={formData.amount}
          className="py-7"
          placeholder="$9999"
        />
      </div>

      <div>
        <h1 className="pb-1">Wallet Id</h1>
        <Input
          name="walletId"
          onChange={handleChange}
          value={formData.walletId}
          className="py-7"
          placeholder="#ADER455"
        />
      </div>

      <div>
        <h1 className="pb-1">Purpose</h1>
        <Input
          name="purpose"
          onChange={handleChange}
          value={formData.purpose}
          className="py-7"
          placeholder="gift for your friend..."
        />
      </div>

      <Button
        onClick={handleSubmit}
        className="w-full py-7"
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Submit"}
      </Button>
    </div>
  );
};

export default TransferForm;
