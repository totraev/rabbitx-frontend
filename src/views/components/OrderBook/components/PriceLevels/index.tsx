import {
  memo,
  useMemo,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";

import { CanvasTable } from "./utils/CanvasTable";
import st from "./PriceLevels.module.css";
import { styles, config } from "./constants";
import type { PriceLevel } from "../../types";

type Props = {
  priceLevels?: PriceLevel[];
  side: "ask" | "bid";
  numberOfRows: number;
  onRowClick?: (side: "ask" | "bid", priceLevel: PriceLevel | null) => void;
};

export type InstanceMethods = {
  updatePriceLevels: (priceLevels: PriceLevel[]) => void;
};

const PriceLevels = forwardRef<InstanceMethods, Props>(
  ({ priceLevels, numberOfRows, side, onRowClick }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<CanvasTable>();

    useEffect(() => {
      if (priceLevels) {
        rendererRef.current?.updateState(priceLevels);
      }
    }, [priceLevels]);

    useEffect(() => {
      if (!canvasRef.current) {
        return;
      }

      rendererRef.current = new CanvasTable(
        canvasRef.current,
        {
          side,
          numberOfRows,
          pixelRatio: window.devicePixelRatio,
          width: wrapperRef.current?.offsetWidth ?? 0,
          height: wrapperRef.current?.offsetHeight ?? 0,
          ...config[side],
        },
        styles[side]
      );

      rendererRef.current?.draw();

      return () => rendererRef.current?.clear();
    }, [numberOfRows, side]);

    useImperativeHandle(
      ref,
      () => ({
        updatePriceLevels: (priceLevels: PriceLevel[]) => {
          rendererRef.current?.updateState(priceLevels);
        },
      }),
      []
    );

    const priceLevelIndexes = useMemo(
      () =>
        Array(numberOfRows)
          .fill(0)
          .map((_, i) => (side === "bid" ? i : numberOfRows - i - 1)),
      [numberOfRows, side]
    );

    return (
      <div ref={wrapperRef} className={st.wrapper}>
        <canvas ref={canvasRef} className={st.canvas} />

        <div className={st.priceLevels}>
          {priceLevelIndexes.map((i) => (
            <div
              key={i}
              data-index={i}
              className={st.priceLevel}
              onClick={() =>
                onRowClick?.(side, rendererRef.current?.getRow(i) ?? null)
              }
            />
          ))}
        </div>
      </div>
    );
  }
);

export default memo(PriceLevels);
