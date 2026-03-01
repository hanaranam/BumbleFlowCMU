"use client";

import { useEffect } from "react";
import { initializeBumbleFlow } from "@/lib/initializeBumbleFlow";

export default function BumbleFlowPrototype({ html }) {
  useEffect(() => {
    initializeBumbleFlow();
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
