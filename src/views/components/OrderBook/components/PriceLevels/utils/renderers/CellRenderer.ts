import { RowState } from "../states/RowState";
import type { Alignment, Config, Styles } from "../../../../types";

export class CellRendered {
  constructor(
    private ctx: CanvasRenderingContext2D | null,
    private config: Config,
    private styles: Styles
  ) {}

  render(
    rowState: RowState,
    rowX: number,
    rowY: number,
    rowWidth: number,
    rowHeight: number
  ) {
    const { data } = rowState;

    if (!this.ctx || !data) {
      return;
    }

    const { columns } = this.config;
    let cellX = rowX;

    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];

      const cellWidth = this.calculateCellWidth(rowWidth, column.width);
      const cellHeight = rowHeight;
      const cellY = rowY;

      const textX = this.calculateTextX(column.align, cellX, cellWidth);
      const textY = cellY + cellHeight / 2;

      if (rowState.removed) {
        this.ctx.fillStyle = this.styles.removalColor;
      } else {
        this.ctx.fillStyle =
          column.key === "price" || rowState.updated
            ? this.styles.priceColor
            : this.styles.color;
      }

      this.ctx.font = this.styles.font;
      this.ctx.textBaseline = "middle";
      this.ctx.textAlign = column.align;
      this.ctx.fillText(data[column.key].toFixed(column.digits), textX, textY);

      cellX += cellWidth;
    }

    this.ctx.restore();
  }

  private calculateCellWidth(rowWidth: number, percent: number) {
    return Math.floor((rowWidth * percent) / 100);
  }

  private calculateTextX(align: Alignment, cellX: number, cellWidth: number) {
    switch (align) {
      case "left":
        return cellX;
      case "right":
        return cellX + cellWidth;
      case "center":
        return cellX + cellWidth / 2;
    }
  }
}
