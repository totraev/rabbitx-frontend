import type { Config, Row, Styles } from "../../../types";

import { RowRenderer } from "./renderers/RowRenderer";
import { AnimationState } from "./states/AnimationState";

export class CanvasTable {
  private animationId: number | null = null;
  private ctx: CanvasRenderingContext2D | null = this.canvas.getContext("2d");

  private rowRenderer = new RowRenderer(this.ctx, this.config, this.style);

  private state = {
    rows: Array(this.config.numberOfRows).fill(null) as (Row | null)[],
    totalSize: 0,
  };
  private animationState = new AnimationState(this.config.numberOfRows, this.config.sortOrder);

  constructor(
    private canvas: HTMLCanvasElement,
    private config: Config,
    private style: Styles
  ) {
    const ratio = this.config.pixelRatio;
    const width = this.config.width;
    const height = this.config.height;

    this.canvas.width = width * ratio;
    this.canvas.height = height * ratio;
    this.canvas.style.height = height + "px";
    this.canvas.style.width = width + "px";

    if (this.ctx) {
      this.ctx.scale(ratio, ratio);
    }
  }

  updateState(rows: Row[]) {
    this.state.totalSize = 0;

    for (let i = 0; i < this.state.rows.length; i++) {
      this.state.rows[i] = rows[i] ?? null;
      this.state.totalSize += (rows[i]?.size ?? 0);
    }

    this.animationState.updateState(this.state.rows);
  }

  resetState() {
    for(let i = 0; i < this.config.numberOfRows; i++) {
      this.state.rows[i] = null;
      this.state.totalSize = 0;
    }
  }


  draw = () => {
    const totalSize = this.state.totalSize;

    for (let i = 0; i < this.config.numberOfRows; i++) {
      const rowState = this.animationState.getRow(i);
      this.rowRenderer.render(i, rowState, totalSize);
      rowState.updateAnimationState();
    }

    this.animationState.removeInactiveRows();
    this.animationId = requestAnimationFrame(this.draw);
  };

  clear = () => {
    this.resetState();

    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  };

  getRow(index: number): Row | null {
    return this.animationState.getRow(index).data;
  }
}
