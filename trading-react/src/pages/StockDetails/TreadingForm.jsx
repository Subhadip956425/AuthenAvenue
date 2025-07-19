import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAssetDetails } from "@/State/Assets/Action";
import { getUserWallet } from "@/State/Wallet/Action";
import { payOrder } from "@/State/Order/Action";
import { DotIcon } from "@radix-ui/react-icons";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DialogClose } from "@/components/ui/dialog";

const TreadingForm = ({ onOrderSuccess }) => {
  const [orderType, setOrderType] = useState("BUY");
  const [amount, setAmount] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const { coin, wallet, asset } = useSelector((store) => store);
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const amount = e.target.value;
    setAmount(amount);
    const volume = calculateBuyCost(
      amount,
      coin.coinDetails.market_data.current_price.usd
    );
    setQuantity(volume);
  };

  const calculateBuyCost = (amount, price) => {
    let volume = amount / price;
    let decimalPlaces = Math.max(2, price.toString().split(".")[0].length);

    return volume.toFixed(decimalPlaces);
  };

  useEffect(() => {
    if (coin.coinDetails?.id) {
      dispatch(getUserWallet(localStorage.getItem("jwt")));
      dispatch(
        getAssetDetails({
          coinId: coin.coinDetails.id,
          jwt: localStorage.getItem("jwt"),
        })
      );
    }
  }, [coin.coinDetails]);

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

  const handleBuyCrypto = () => {
    const balance = wallet.userWallet?.balance || 0;
    const ownedQuantity = asset.assetDetails?.quantity || 0;

    if (!coin.coinDetails?.id) {
      setErrorMessage("Coin not loaded. Please try again later.");
      return;
    }

    if (orderType === "BUY" && Number(amount) > Number(balance)) {
      setErrorMessage("Insufficient wallet balance.");
      return;
    }

    if (orderType === "SELL" && Number(quantity) > Number(ownedQuantity)) {
      setErrorMessage("Insufficient asset quantity to sell.");
      return;
    }

    // Clear error if valid
    setErrorMessage("");

    dispatch(
      payOrder({
        jwt: localStorage.getItem("jwt"),
        amount,
        orderData: {
          coinId: coin.coinDetails?.id,
          quantity,
          orderType,
        },
      })
    )
      .then(() => {
        dispatch(getUserWallet(localStorage.getItem("jwt")));
        dispatch(
          getAssetDetails({
            coinId: coin.coinDetails.id,
            jwt: localStorage.getItem("jwt"),
          })
        );
        setSuccessMessage(
          orderType === "BUY"
            ? "Crypto purchased successfully!"
            : "Crypto sold successfully!"
        );

        setAmount(0);
        setQuantity(0);
        setOrderType("BUY");

        onOrderSuccess?.();
      })
      .catch((error) => {
        console.error("Order failed:", error);
      });
  };

  return (
    <div className="space-y-10 p-5">
      <div>
        <div className="flex gap-4 items-center justify-between">
          <Input
            className="py-7 focus:outline-none"
            placeholder="Enter Amount..."
            onChange={handleChange}
            type="number"
            name="amount"
            value={amount}
          />

          <div>
            <p className="border text-2xl flex justify-center items-center w-36 h-14 rounded-md">
              {quantity}
            </p>
          </div>
        </div>
        {errorMessage && (
          <h1 className="text-red-600 text-center pt-4">{errorMessage}</h1>
        )}

        {successMessage && (
          <h1 className="text-green-600 text-center pt-4">{successMessage}</h1>
        )}
      </div>
      <div className="flex gap-5 items-center">
        <div>
          <Avatar>
            <AvatarImage
              src={coin.coinDetails?.image?.thumb || "/fallback.png"}
              alt={coin.coinDetails?.name || "Coin"}
            />
          </Avatar>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="uppercase">{coin.coinDetails?.symbol}</p>
            <DotIcon className="text-gray-400" />
            <p className="text-gray-400">{coin.coinDetails?.name}</p>
          </div>
          <div className="flex items-end gap-2">
            <p className="text-x1 font-bold">
              ${coin.coinDetails?.market_data.current_price.usd}
            </p>
            <p
              className={
                coin.coinDetails?.market_data?.price_change_percentage_24h > 0
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              <span>
                {coin.coinDetails?.market_data?.price_change_24h?.toFixed(2)}
              </span>
              <span>
                (
                {coin.coinDetails?.market_data?.price_change_percentage_24h?.toFixed(
                  2
                )}
                %)
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p>Order Type</p>
        <p>Market Order</p>
      </div>
      <div className="flex items-center justify-between">
        <p>{orderType == "BUY" ? "Available Cash" : "Available Quantity"}</p>
        <p>
          {orderType == "BUY"
            ? "$" + wallet.userWallet?.balance
            : asset.assetDetails?.quantity || 0}
        </p>
      </div>

      <div>
        <Button
          onClick={handleBuyCrypto}
          className={`w-full py-6 ${
            orderType == "SELL" ? "bg-red-600 text-white" : ""
          }`}
        >
          {orderType}
        </Button>
        <Button
          variant="link"
          className="w-full mt-5 text-xl"
          onClick={() => setOrderType(orderType == "BUY" ? "SELL" : "BUY")}
        >
          {orderType == "BUY" ? "Or Sell" : "Or Buy"}
        </Button>
      </div>
    </div>
  );
};

export default TreadingForm;
