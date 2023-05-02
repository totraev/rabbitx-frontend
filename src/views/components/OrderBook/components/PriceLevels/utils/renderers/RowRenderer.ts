import { RowState } from "../states/RowState";
import type { Config, Styles } from "../../../../types";

import { CellRendered } from "./CellRenderer";

export class RowRenderer {
  private cellRenderer = new CellRendered(this.ctx, this.config, this.styles);

  constructor(
    private ctx: CanvasRenderingContext2D | null,
    private config: Config,
    private styles: Styles
  ) {}

  render(index: number, rowState: RowState, totalSize: number) {
    const rowData = rowState.data;

    const x = 0;
    const y = this.getYOffset(index);

    if (!rowState.visible || !rowData || rowState.empty) {
      this.clearRow(x, y);
      return;
    }
    
    const width = this.getBarWidth(rowData.size, totalSize);
    const height = this.styles.rowHeight;

    this.drawRow(x, y, width, height);
    this.cellRenderer.render(rowState, x + 5, y, this.config.width - 10, height);
  }

  private getYOffset(index: number): number {
    return this.config.side === "bid"
      ? index * this.styles.rowHeight
      : (this.config.numberOfRows - index - 1) * this.styles.rowHeight;
  }

  private getBarWidth(size: number, totalSize: number) {
    const percent = (size * 100) / totalSize;

    return Math.ceil((this.config.width * percent) / 100);
  }

  private drawRow(x: number, y: number, width: number, height: number) {
    if (!this.ctx) {
      return;
    }

    this.ctx.clearRect(x, y, this.config.width, this.styles.rowHeight);
    this.ctx.fillStyle = this.styles.bgColor;
    this.ctx.fillRect(x, y, width, height);
    this.ctx.restore();
  }

  private clearRow(x: number, y: number) {
    if (!this.ctx) {
      return;
    }

    this.ctx.clearRect(x, y, this.config.width, this.styles.rowHeight);
  }
}
