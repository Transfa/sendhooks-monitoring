import { Request, Response } from "express";
import { HookModel } from "../models/hookModel";
import { appLog } from "../share/app-log";
import mongoose from "mongoose";

export class HookController {
  static async findAll(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const {
      status,
      createdStartDate,
      createdEndDate,
      deliveredStartDate,
      deliveredEndDate,
      search,
    } = req.query;

    const filter: any = {};

    if (status) {
      filter.status = status;
    }

    if (createdStartDate && createdEndDate) {
      filter.created = {
        $gte: new Date(createdStartDate as string),
        $lte: new Date(createdEndDate as string),
      };
    }

    if (deliveredStartDate && deliveredEndDate) {
      filter.delivered = {
        $gte: new Date(deliveredStartDate as string),
        $lte: new Date(deliveredEndDate as string),
      };
    }

    if (search) {
      filter.$or = [
        { externalId: { $regex: search as string, $options: "i" } },
        { url: { $regex: search as string, $options: "i" } },
      ];
    }

    try {
      const totalItems = await HookModel.countDocuments(filter);
      const hooks = await HookModel.find(filter)
        .sort({ created: -1 }) // Order by most recent created date
        .skip(skip)
        .limit(limit);

      const totalPages = Math.ceil(totalItems / limit);

      return res.json({
        data: hooks,
        meta: {
          totalItems,
          totalPages,
          currentPage: page,
          itemsPerPage: limit,
        },
      });
    } catch (error) {
      appLog.error("Error fetching hooks:", error);
      return res
        .status(500)
        .json({ code: "SERVER_ERROR", description: "Internal Server Error" });
    }
  }

  static async findOne(req: Request, res: Response) {
    const { hookId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(hookId)) {
      return res.status(404).json({
        code: "INVALID_ID",
        description: "Provided ID is invalid. Hook not found.",
      });
    }

    try {
      const hook = await HookModel.findById(hookId);
      if (!hook) {
        return res
          .status(404)
          .json({ code: "HOOK_NOT_FOUND", description: "Hook not found" });
      }

      return res.json(hook);
    } catch (error) {
      appLog.error("Error fetching hook:", error);
      return res
        .status(500)
        .json({ code: "SERVER_ERROR", description: "Internal Server Error" });
    }
  }
}
