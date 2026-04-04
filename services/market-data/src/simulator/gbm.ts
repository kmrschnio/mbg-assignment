/**
 * Geometric Brownian Motion price simulator.
 * Returns the next price given current price and GBM parameters.
 *
 * Formula: S(t+dt) = S(t) * exp((drift - vol²/2) * dt + vol * sqrt(dt) * Z)
 * where Z ~ N(0,1)
 */
export function gbm(
  price: number,
  drift: number,
  volatility: number,
  dt: number
): number {
  const z = boxMullerRandom();
  const exponent =
    (drift - (volatility * volatility) / 2) * dt +
    volatility * Math.sqrt(dt) * z;
  return price * Math.exp(exponent);
}

/** Box-Muller transform to generate standard normal random variable */
function boxMullerRandom(): number {
  const u1 = Math.random();
  const u2 = Math.random();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}
