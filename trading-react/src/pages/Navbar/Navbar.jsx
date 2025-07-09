import { Button } from "@/components/ui/button";
import {
  DragHandleHorizontalIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import imageSrc from "../../assets/1.png";
import { useNavigate } from "react-router-dom";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import React from "react";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import Sidebar from "./Sidebar";
import { AvatarFallback } from "@/components/ui/avatar";
import { useSelector } from "react-redux";

const Navbar = () => {
  const navigate = useNavigate();
  const { auth } = useSelector((store) => store);

  return (
    <div className="px-2 py-3 border-b z-50 bg-background bg-opacity-0 sticky top-0 left-0 right-0 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <Sheet>
          <SheetTrigger asChild>
            <div>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-11 w-11"
              >
                <DragHandleHorizontalIcon className="h-7 w-7" />
              </Button>
            </div>
          </SheetTrigger>
          <SheetContent
            className="w-72 border-r-0 flex-col justify-center"
            side="left"
          >
            <SheetHeader>
              <SheetTitle>
                <div className="text-3xl flex justify-center items-center gap-1">
                  <Avatar>
                    <AvatarImage src={imageSrc} alt="Profile Picture" />
                  </Avatar>
                  <div>
                    <span className="font-bold text-blue-700">Authen</span>
                    <span>Avenue</span>
                  </div>
                </div>
              </SheetTitle>
            </SheetHeader>
            <Sidebar />
          </SheetContent>
        </Sheet>
        <p
          className="text-sm lg:text-base cursor-pointer"
          onClick={() => navigate("/")} // Navigate to Home
        >
          AuthenAvenue
        </p>
        <div className="p-0 ml-9">
          <Button variant="outline" className="flex items-center gap-3">
            <MagnifyingGlassIcon />
            <span>Search</span>
          </Button>
        </div>
      </div>

      <div>
        <Avatar className="h-10 w-10 rounded-full bg-gray-500 flex items-center justify-center">
          <AvatarFallback className="uppercase text-lg font-semibold">
            {auth.user?.fullName?.[0]?.toUpperCase() ?? "U"}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default Navbar;
