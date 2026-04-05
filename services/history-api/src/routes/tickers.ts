import { Router } from "express";
import { TICKERS } from "@trading/shared";

const router = Router();

/** GET /tickers — return list of available instruments */
router.get("/", (_req, res) => {
  res.json(
    TICKERS.map((t) => ({
      symbol: t.symbol,
      name: t.name,
    }))
  );
});

export default router;
