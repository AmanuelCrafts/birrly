import mongoose, { Schema, type Document } from "mongoose";

export interface IVIPPlan extends Document {
  level: number;
  name: string;
  depositAmount: number;
  dailyIncome: number;
  dailyTasksRequired: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const vipPlanSchema = new Schema<IVIPPlan>(
  {
    level: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    depositAmount: {
      type: Number,
      required: true,
    },
    dailyIncome: {
      type: Number,
      required: true,
    },
    dailyTasksRequired: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const VIPPlan = mongoose.models.VIPPlan || mongoose.model<IVIPPlan>("VIPPlan", vipPlanSchema);
