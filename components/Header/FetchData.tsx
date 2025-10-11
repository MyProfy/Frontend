"use client";

import React, { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const FetchData = () => {
  const [currentUrl, setCurrentUrl] = React.useState<string | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const region = searchParams.get("region");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = window.location.href;
      setCurrentUrl(url);

      if (region) {
        localStorage.setItem("currentRegion", region);
        console.log("Region saved to localStorage:", region);
      }

      const savedRegion = localStorage.getItem("currentRegion");
      console.log("Previously saved region:", savedRegion);
    }
  }, [region]); 

  return (
    // <div>
    //   {/* <p>Current URL: {currentUrl}</p>
    //   <p>Current Region: {region}</p>
    //   <p>Saved Region: {typeof window !== "undefined" ? localStorage.getItem("currentRegion") : ""}</p> */}
    // </div>
    <></>
  );
};

export default FetchData;