"use client";

import { SWRProvider } from "@/app/swr-provider";
import useSWR from "swr";
import { fetcher } from "@/utils";

export default function HooksListing() {
  const { data: hooks } = useSWR("/hooks/", fetcher);
  return (
    <SWRProvider>
      <div>Webhooks</div>
    </SWRProvider>
  );
}
