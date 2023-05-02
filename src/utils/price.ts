import { IPriceLevel } from "../types/orderBook";

export function roundPrice(price: number, epsilon: number): number {
  return Math.round(price / epsilon) * epsilon;
}

export function equalPrices(
  priceA: number,
  priceB: number,
  epsilon: number,
): boolean {
  return Math.abs(priceA - priceB) < epsilon;
}

export function aggregatePriceLevels(
  priceLevels: IPriceLevel[],
  priceStep: number,
  side: 'ask' | 'bid'
): IPriceLevel[] {
  const aggregateFn = (
    acc: IPriceLevel[],
    priceLevel: IPriceLevel
  ): IPriceLevel[] => {
    const prevPriceLevel = acc.length > 0 ? acc[acc.length - 1] : null;

    if (
      prevPriceLevel &&
      equalPrices(prevPriceLevel.price, priceLevel.price, priceStep)
    ) {
      prevPriceLevel.size += priceLevel.size;
      prevPriceLevel.total += priceLevel.total;
    } else {
      acc.push({
        price: roundPrice(priceLevel.price, priceStep),
        size: priceLevel.size,
        total: priceLevel.total,
      });
    }

    return acc;
  };

  return side === "ask"
    ? priceLevels.reduce(aggregateFn, [])
    : priceLevels.reduceRight(aggregateFn, []);
}
