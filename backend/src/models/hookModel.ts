import { Document, Schema, model } from "mongoose";

export interface Hook extends Document {
  id: string;
  url: string;
  status: "success" | "failed";
  created: Date;
  delivered?: Date;
  error?: string;
  externalId?: string;
}

const hookSchema = new Schema<Hook>({
  id: { type: String, required: true },
  url: { type: String, required: true },
  status: { type: String, enum: ["success", "failed"], required: true },
  created: { type: Date, default: Date.now, required: true },
  delivered: { type: Date },
  error: { type: String },
  externalId: { type: String },
});

export const HookModel = model<Hook>("Hook", hookSchema);
