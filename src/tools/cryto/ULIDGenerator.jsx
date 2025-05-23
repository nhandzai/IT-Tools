"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import CopyToClipboardButton from "@/components/ui/CopyToClipboardButton";
import Button from "@/components/ui/Button";

export default function ULIDGenerator() {
  const [count, setCount] = useState(1);
  const [ulids, setUlids] = useState([]);
  const [format, setFormat] = useState("raw");

  const generateSecureULID = () => {
    const ENCODING = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

    function encodeTime(time, length) {
      let str = "";
      for (let i = length - 1; i >= 0; i--) {
        str = ENCODING[time % 32] + str;
        time = Math.floor(time / 32);
      }
      return str;
    }

    function encodeRandom(length) {
      const cryptoObj = window.crypto || window.msCrypto;
      const buffer = new Uint8Array(length);
      cryptoObj.getRandomValues(buffer);
      let str = "";
      for (let i = 0; i < length; i++) {
        str += ENCODING[buffer[i] % 32];
      }
      return str;
    }

    const time = Date.now();
    return encodeTime(time, 10) + encodeRandom(16);
  };

  const handleGenerate = (newCount) => {
    const list = Array.from({ length: newCount }, () => generateSecureULID());
    setUlids(list);
  };

  const getContentToCopy = () => {
    return format === "json"
      ? JSON.stringify(ulids, null, 2)
      : ulids.join("\n");
  };

  return (
    <div className="max-w-md space-y-4">
      <div className="flex items-center gap-2">
        <Input
          type="number"
          value={count === 0 ? "" : count}
          min={0}
          max={50}
          label="Quantity"
          onChange={(e) => {
            const val = e.target.value;
            if (val === "") {
              setCount(0);
              handleGenerate(0);
            } else {
              let value = Number(val);
              if (value > 50) value = 50;
              if (value < 0) value = 0;
              setCount(value);
              handleGenerate(value);
            }
          }}
          className="w-24 rounded border px-2 py-1"
          placeholder="How many?"
        />
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-1">
          <input
            type="radio"
            name="format"
            value="raw"
            checked={format === "raw"}
            onChange={() => setFormat("raw")}
          />
          Raw
        </label>
        <label className="flex items-center gap-1">
          <input
            type="radio"
            name="format"
            value="json"
            checked={format === "json"}
            onChange={() => setFormat("json")}
          />
          JSON
        </label>
      </div>

      <textarea
        readOnly
        value={
          format === "json" ? JSON.stringify(ulids, null, 2) : ulids.join("\n")
        }
        className="h-40 w-full rounded border border-gray-600 bg-gray-700 p-2 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
        placeholder="Generated ULIDs will appear here..."
      />

      <div className="flex gap-2">
        <CopyToClipboardButton
          textToCopy={getContentToCopy()}
          disabled={ulids.length === 0}
          buttonText="Copy"
          className="bg-blue-600 text-white hover:bg-blue-700"
        />
        <Button
          className="bg-gray-600 text-white hover:bg-gray-700"
          onClick={() => handleGenerate(count)}
        >
          Refresh
        </Button>
      </div>
    </div>
  );
}
