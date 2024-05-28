"use client";
import { SWRConfig } from "swr";
import { ReactElement } from "react";

export const SWRProvider = ({ children }: { children: ReactElement }) => {
  return (
    <SWRConfig
      value={{
        refreshInterval: 10000,
      }}
    >
      {children}
    </SWRConfig>
  );
};
