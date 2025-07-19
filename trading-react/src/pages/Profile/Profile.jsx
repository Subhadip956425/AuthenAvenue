import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VerifiedIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AccountVerificatioForm from "./AccountVerificatioForm";
import { useSelector } from "react-redux";
import ProfileForm from "./ProfileForm";

const Profile = () => {
  const { auth } = useSelector((store) => store);
  const [isTwoStepEnabled, setIsTwoStepEnabled] = useState(false);

  const handleEnableTwoStepVerification = () => {
    setIsTwoStepEnabled(true);
    console.log("two step verification");
  };

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    const fetchStatus = async () => {
      const response = await fetch("/api/user/two-step-status", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      const result = await response.json();
      setIsTwoStepEnabled(result.enabled);
    };

    fetchStatus();
  }, []);

  useEffect(() => {
    if (auth.user?.twoFactorAuth?.enabled) {
      setIsTwoStepEnabled(true);
    }
  }, [auth.user]);

  return (
    <div className="flex flex-col items-center mb-5">
      <div className=" pt-10 w-full lg:w-[60%]">
        <Card>
          <CardHeader className="pb-9 flex justify-between items-center">
            <CardTitle>Your Information</CardTitle>
            <Dialog>
              <DialogTrigger>
                <Button variant="outline">Edit</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Profile Details</DialogTitle>
                </DialogHeader>
                <ProfileForm defaultValues={auth.user} />
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="lg:flex gap-32">
              <div className="space-y-7">
                <div className="flex">
                  <p className="w-[9rem]">Email : </p>
                  <p className="text-gray-500">{auth.user?.email}</p>
                </div>

                <div className="flex">
                  <p className="w-[9rem]">Full Name : </p>
                  <p className="text-gray-500">{auth.user?.fullName}</p>
                </div>

                <div className="flex">
                  <p className="w-[9rem]">Date of Birth : </p>
                  <p className="text-gray-500">{auth.user?.dob}</p>
                </div>

                <div className="flex">
                  <p className="w-[9rem]">Nationality : </p>
                  <p className="text-gray-500">{auth.user?.nationality}</p>
                </div>
              </div>

              <div className="space-y-7">
                <div className="flex">
                  <p className="w-[9rem]">Address : </p>
                  <p className="text-gray-500">{auth.user?.address}</p>
                </div>

                <div className="flex">
                  <p className="w-[9rem]">City : </p>
                  <p className="text-gray-500">{auth.user?.city}</p>
                </div>

                <div className="flex">
                  <p className="w-[9rem]">Postcode : </p>
                  <p className="text-gray-500">{auth.user?.postcode}</p>
                </div>

                <div className="flex">
                  <p className="w-[9rem]">Country : </p>
                  <p className="text-gray-500">{auth.user?.country}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6">
          <Card className="w-full">
            <CardHeader className="pb-7">
              <div className="flex items-center gap-3">
                <CardTitle>2 Step Verification</CardTitle>
                {isTwoStepEnabled ? (
                  <Badge className="space-x-2 text-white bg-green-600">
                    <VerifiedIcon />
                    <span>Enabled</span>
                  </Badge>
                ) : (
                  <Badge className="bg-orange-500">Disabled</Badge>
                )}
              </div>
            </CardHeader>

            <CardContent>
              {!isTwoStepEnabled ? (
                <Dialog>
                  <DialogTrigger>
                    <Button>Enable Two Step Verification</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Verify Your Account</DialogTitle>
                    </DialogHeader>
                    <AccountVerificatioForm
                      handleSubmit={handleEnableTwoStepVerification}
                    />
                  </DialogContent>
                </Dialog>
              ) : (
                <div className="text-green-600 font-medium">
                  Two Step Verification is already enabled for your account.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
