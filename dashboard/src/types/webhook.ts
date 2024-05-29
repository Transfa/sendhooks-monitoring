export type Webhook = {
  _id: number;
  id: number;
  status: "success" | "failed";
  created: string;
  delivered: string;
  error: string;
};
