import { RowState } from "./RowState";
import type { Row } from "../../../../types";

export class AnimationState {
  private _rows: RowState[];
  private _tmp: RowState[];

  constructor(
    private _numberOfRows: number,
    private _sortOrder: "ASC" | "DESC"
  ) {
    this._rows = this.getDefaultState();
    this._tmp = this.getDefaultState();
  }

  get length() {
    return this._numberOfRows;
  }

  getRow(index: number) {
    return this._rows[index];
  }

  updateState(rows: (Row | null)[]) {
    this.removeInactiveRows();
    this.resetTmp();

    const newAnimationState = this._tmp;
    let i = 0;
    let j = 0;
    let k = 0;

    while (k < newAnimationState.length) {
      const row = rows[i];
      const rowAnimationState = this._rows[j];

      if (!row && (!rowAnimationState || rowAnimationState.empty)) {
        break;
      }

      if (!row || rowAnimationState.removed) {
        newAnimationState[k].update(rowAnimationState);
        k++;
        j++;

        continue;
      }

      if (!rowAnimationState || rowAnimationState.empty) {
        newAnimationState[k] = new RowState(row);
        k++;
        i++;

        continue;
      }

      const comparisonResult = rowAnimationState.compare(row, (a, b) =>
        this._sortOrder === "DESC"
          ? (a?.price ?? 0) - b.price
          : b.price - (a?.price ?? 0)
      );

      if (comparisonResult < 0) {
        newAnimationState[k] = new RowState(row);

        i++;
      } else if (comparisonResult === 0) {
        rowAnimationState.updateData(row);
        newAnimationState[k].update(rowAnimationState);

        i++;
        j++;
      } else if (comparisonResult > 0) {
        rowAnimationState.markAsRemoved();
        newAnimationState[k].update(rowAnimationState);

        j++;
      }

      k++;
    }

    this.swapMemory();
  }

  resetState() {
    for (let i = 0; i < this._rows.length; i++) {
      this._tmp[i]?.reset();
      this._rows[i]?.reset();
    }
  }

  removeInactiveRows() {
    this.resetTmp();

    const newAnimationState = this._tmp;
    let i = 0;
    let j = 0;

    while (i < newAnimationState.length) {
      const row = this._rows[i];

      if (row && row.visible && !row.empty) {
        newAnimationState[j].update(row);
        j++;
      }

      i++;
    }

    this.swapMemory();
  }

  private swapMemory() {
    const newState = this._tmp;

    this._tmp = this._rows;
    this._rows = newState;
  }

  private resetTmp() {
    for (let i = 0; i < this._tmp.length; i++) {
      this._tmp[i].reset();
    }
  }

  private getDefaultState() {
    return Array(this._numberOfRows * 2)
      .fill(null)
      .map((data) => new RowState(data));
  }
}
