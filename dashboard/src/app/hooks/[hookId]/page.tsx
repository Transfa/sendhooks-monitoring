"use client";

import React from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetcher, formatDate } from "@/utils";
import { Button } from "@/components/ui/button";
import { Webhook } from "@/types/webhook";
import Codeblock from "@/components/codeblock";

export default function Page({ params }: { params: { hookId: string } }) {
  const router = useRouter();

  const { hookId } = params;

  const { data, error } = useSWR<Webhook>(
    hookId ? `/hooks/${hookId}/` : null,
    fetcher,
  );

  if (error) return <div>Error loading webhook details</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <Button className="my-2" onClick={() => router.push("/hooks")}>
        Back to Hooks
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold mb-4">
            Webhook Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <div className="w-full sm:w-1/2 md:w-1/3 flex flex-col space-y-2">
              <span className="font-semibold">ID</span>
              <span>{data._id}</span>
            </div>
            <div className="w-full sm:w-1/2 md:w-1/2 flex flex-col space-y-2">
              <span className="font-semibold">URL</span>
              <span className="text-blue-500 underline">{data.url}</span>
            </div>
            <div className="w-full sm:w-1/2 md:w-1/3 flex flex-col space-y-2">
              <span className="font-semibold">Status</span>
              <span>{data.status}</span>
            </div>
            <div className="w-full sm:w-1/2 md:w-1/3 flex flex-col space-y-2">
              <span className="font-semibold">Created At</span>
              <span>{formatDate(data.created)}</span>
            </div>
            <div className="w-full sm:w-1/2 md:w-1/3 flex flex-col space-y-2">
              <span className="font-semibold">Delivered At</span>
              <span>{formatDate(data.delivered)}</span>
            </div>
            <div className="w-full sm:w-1/2 md:w-1/3 flex flex-col space-y-2">
              <span className="font-semibold">External ID</span>
              <span>{data.externalId}</span>
            </div>
            {data.error && (
              <div className="w-full flex flex-col space-y-2">
                <span className="font-semibold">Error details</span>
                {/*<pre className="bg-gray-100 p-4 rounded border border-gray-300 overflow-auto">*/}
                {/*  {data.error}*/}
                {/*</pre>*/}
                <Codeblock code={data.error} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
