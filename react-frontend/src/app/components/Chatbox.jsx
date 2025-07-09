import Image from "next/image";
import React, { useState } from "react";
import profilepic from "../components/OIP.jpg";
import PromptMessage from "./PromptMessage";
import ResponseMessage from "./ResponseMessage";
import axios from "axios";

const Chatbox = ({ isBotRealease, handleBotRealease }) => {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFetchCoinDetails = async (prompt) => {
    setLoading(true);
    try {
      const { data } = await axios.post("http://localhost:5454/ai/chat", {
        prompt,
      });
      const response = { message: data.message, role: "model" };
      setResponses((prev) => [...prev, response]);
      console.log("Success", data);
    } catch (error) {
      console.log("error", error);
    }
    setLoading(false);
  };

  return (
    <div className="chatbox blur-backgroud large-shadow z-50 bg-[#000518] bg-opacity-70 w-[90vw] md:w-[70vw] lg:w-[40vw] pb-6 h-[85vh] shadow-2xl shadow-blue-700">
      <div className="h-[13%] pl-3 border-b border-gray-700 flex gap-x-4 items-center">
        <Image className="rounded-full w-12 h-12" src={profilepic} alt="" />

        <div>
          <h1 className="text-lg font-semibold">AI Chat Bot</h1>
          <p className="text-sm text-gray-400">Real Time Crypto Market Data</p>
        </div>
      </div>
      <div className="h-[77%]">
        {responses.length ? (
          <div className="flex flex-col py-5 px-5 overflow-y-auto h-full custom-scrollbar">
            {responses.map((item, index) =>
              item.role == "user" ? (
                <div className="self-end" key={index}>
                  <PromptMessage message={item.message} />
                </div>
              ) : (
                <div className="self-start" key={index}>
                  <ResponseMessage message={item.message} />
                </div>
              )
            )}
            {loading && <p>fetching data...</p>}
          </div>
        ) : (
          <div className="p-10 gap-5 h-full flex flex-col justify-center items-center">
            <p className="text-2xl font-bold">Welcome To Crypto Chat Bot</p>
            <p className="text-gray-500">Inquire About Market Data</p>
          </div>
        )}
      </div>

      <div className="h-[10%] px-5">
        <input
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.target.value.trim() !== "") {
              const userMessage = { message: e.target.value, role: "user" };
              setResponses((prev) => [...prev, userMessage]);
              handleFetchCoinDetails(e.target.value);
              e.target.value = "";
            }
          }}
          type="text"
          className="h-full rounded-full border-gray-700 border bg-transparent px-5 w-full outline-none"
          placeholder="Give your prompt..."
        />
      </div>
    </div>
  );
};

export default Chatbox;
