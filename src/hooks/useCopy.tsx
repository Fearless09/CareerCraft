"use client";
import { useState } from "react";

const useCopy = () => {
  const [copied, setCopied] = useState(false);

  const copy = async (text: string, timeOut: number = 2000) => {
    setCopied(false);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);

      setTimeout(() => setCopied(false), timeOut);
    } catch (err) {
      console.log(err);
    }
  };
  return { copy, copied };
};

export default useCopy;
