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

export type Filters = {
  status?: string;
  createdStartDate?: string;
  createdEndDate?: string;
  deliveredStartDate?: string;
  deliveredEndDate?: string;
  search?: string;
};
