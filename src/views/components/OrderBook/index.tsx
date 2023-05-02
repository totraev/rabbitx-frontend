import { memo, forwardRef, useImperativeHandle, useRef } from "react";
import cn from "classnames";

import PriceLevels, {
  type InstanceMethods as PriceLevelInstance,
} from "./components/PriceLevels";
import st from "./OrderBook.module.css";
import type { PriceLevel } from "./types";

type Props = {
  asks?: PriceLevel[];
  bids?: PriceLevel[];
  spread: number;
  priceStep: number;
  minPriceStep: number;
  maxPriceStep: number;
  onIncreasePriceStep: () => void;
  onDecreasePriceStep: () => void;
  onRowClick?: (side: "ask" | "bid", priceLevel: PriceLevel | null) => void;
};

export type InstanceMethods = {
  updateAsks: (priceLevels: PriceLevel[]) => void;
  updateBids: (priceLevels: PriceLevel[]) => void;
};

const OrderBook = forwardRef<InstanceMethods, Props>(
  (
    {
      asks,
      bids,
      spread,
      priceStep,
      maxPriceStep,
      minPriceStep,
      onDecreasePriceStep,
      onIncreasePriceStep,
      onRowClick,
    },
    ref
  ) => {
    const asksRef = useRef<PriceLevelInstance>(null);
    const bidsRef = useRef<PriceLevelInstance>(null);

    useImperativeHandle(
      ref,
      () => ({
        updateAsks: (priceLevels) => {
          asksRef.current?.updatePriceLevels(priceLevels);
        },
        updateBids: (priceLevels) => {
          bidsRef.current?.updatePriceLevels(priceLevels);
        },
      }),
      []
    );

    return (
      <div className={st.wrapper}>
        <div className={st.header}>
          <div className={st.headerItem}>
            Amount <span className={st.asset}>BTC</span>
          </div>
          <div className={cn(st.headerItem, st.alignRight)}>
            Price <span className={st.asset}>USD</span>
          </div>
          <div className={cn(st.headerItem, st.alignRight)}>
            Total <span className={st.asset}>USD</span>
          </div>
        </div>

        <div className={st.container}>
          <PriceLevels
            ref={asksRef}
            priceLevels={asks}
            side="ask"
            numberOfRows={25}
            onRowClick={onRowClick}
          />

          <div className={st.delimiter}>
            <div className={st.delimiterItem}>Spread</div>
            <div className={cn(st.delimiterItem, st.alignRight)}>{spread}</div>
            <div className={st.delimiterItem}></div>
          </div>

          <PriceLevels
            ref={bidsRef}
            priceLevels={bids}
            side="bid"
            numberOfRows={25}
            onRowClick={onRowClick}
          />
        </div>

        <div className={st.footer}>
          <div className={cn(st.footerItem, st.aggregation)}>Aggregation</div>

          <div className={cn(st.footerItem, st.priceStep)}>{priceStep}</div>

          <div className={cn(st.footerItem, st.controls)}>
            <button
              className={st.button}
              disabled={priceStep === minPriceStep}
              onClick={onDecreasePriceStep}
            >
              -
            </button>
            <button
              className={st.button}
              disabled={priceStep === maxPriceStep}
              onClick={onIncreasePriceStep}
            >
              +
            </button>
          </div>
        </div>
      </div>
    );
  }
);

export default memo(OrderBook);
