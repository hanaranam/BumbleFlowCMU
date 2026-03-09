"use client";

import { useEffect } from "react";

export default function BumbleFlowInitializer() {
  useEffect(() => {
    let isMounted = true;

    import("@/lib/initializeBumbleFlow")
      .then(({ initializeBumbleFlow }) => {
        if (!isMounted) return;
        try {
          initializeBumbleFlow();
        } catch (error) {
          console.error("BumbleFlow initialization failed:", error);
        }
      })
      .catch((error) => {
        console.error("BumbleFlow initializer module failed to load:", error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return null;
}
