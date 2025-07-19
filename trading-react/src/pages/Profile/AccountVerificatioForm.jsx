import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { frontend_baseurl } from "@/State/Enviorenment/env";

const AccountVerificationForm = () => {
  const [value, setValue] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const baseurl = frontend_baseurl || "http://localhost:5454";

  const fetchUserProfile = async () => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) return;

    try {
      const response = await axios.get(`${baseurl}/api/users/profile`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      setUserEmail(response.data.email || "");
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  };

  const sendOtp = async () => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) return alert("User not logged in!");

    try {
      await axios.post(
        `${baseurl}/api/users/verification/EMAIL/send-otp`,
        {},
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      setDialogOpen(true);
    } catch (error) {
      console.error("OTP send failed:", error);
      alert("Failed to send OTP");
    }
  };

  const handleSubmit = async () => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt || value.length !== 6) return alert("Invalid OTP or user session");

    try {
      const response = await axios.patch(
        `${baseurl}/api/users/enable-two-factor/verify-otp/${value}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      alert("Two-factor authentication enabled!");
      console.log("OTP verified. User:", response.data);
      window.location.reload();
    } catch (err) {
      console.error("OTP verification failed:", err);
      alert("Invalid OTP. Try again.");
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const maskEmail = (email) => {
    const [name, domain] = email.split("@");
    if (!name || !domain) return email;
    return `${name[0]}${"*".repeat(name.length - 2)}${name.slice(
      -1
    )}@${domain}`;
  };

  return (
    <div className="flex justify-center">
      <div className="space-y-5 mt-10 w-full max-w-md">
        <div className="flex justify-between items-center">
          <span>Email:</span>
          <span className="text-muted-foreground">
            {userEmail ? maskEmail(userEmail) : "Loading..."}
          </span>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={sendOtp}>Send OTP</Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Enter OTP</DialogTitle>
              </DialogHeader>
              <div className="py-5 flex flex-col items-center gap-6">
                <InputOTP value={value} onChange={setValue} maxLength={6}>
                  <InputOTPGroup>
                    {[0, 1, 2].map((i) => (
                      <InputOTPSlot key={i} index={i} />
                    ))}
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    {[3, 4, 5].map((i) => (
                      <InputOTPSlot key={i} index={i} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>

                <DialogClose asChild>
                  <Button className="w-40" onClick={handleSubmit}>
                    Submit
                  </Button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default AccountVerificationForm;
