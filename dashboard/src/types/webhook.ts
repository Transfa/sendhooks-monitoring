export type Webhook = {
  _id: number;
  id: number;
  url: string;
  externalId: string;
  status: "success" | "failed";
  created: string;
  delivered: string;
  error: string;
};
