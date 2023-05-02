import type { Row } from "../../../../types";

const NUMBER_OF_ANIMATION_TICKS = 100;

export enum RenderState {
  Active,
  Updated,
  Removed,
  Inactive,
}

export class RowState {
  private _animationTicks = 0;
  private _state = RenderState.Active;

  constructor(private _data: Row | null = null) {}

  get visible() {
    return this._state !== RenderState.Inactive;
  }

  get inactive() {
    return this._state === RenderState.Inactive;
  }

  get updated() {
    return this._state === RenderState.Updated && this._animationTicks > 0;
  }

  get removed() {
    return this._state === RenderState.Removed && this._animationTicks > 0;
  }

  get empty() {
    return this._data === null;
  }

  get renderState() {
    return this._state;
  }

  get data() {
    return this._data;
  }

  get ticks() {
    return this._animationTicks;
  }

  updateData(data: Row) {
    if (!data) {
      return;
    }

    if (
      this._state === RenderState.Active &&
      !this.empty &&
      this._data?.size !== data.size
    ) {
      this._state = RenderState.Updated;
      this._animationTicks = NUMBER_OF_ANIMATION_TICKS;
    }

    this._data = data;
  }

  update(data: RowState) {
    this._animationTicks = data.ticks;
    this._data = data.data;
    this._state = data.renderState;
  }

  reset() {
    this._data = null;

    this._state = RenderState.Active;
    this._animationTicks = 0;
  }

  compare(row: Row, comparator: (a: Row | null, b: Row) => number): number {
    return comparator(this._data, row);
  }

  markAsRemoved() {
    this._state = RenderState.Removed;
    this._animationTicks = NUMBER_OF_ANIMATION_TICKS;
  }

  updateAnimationState() {
    if (this._state === RenderState.Active) {
      return;
    }

    if (this._state === RenderState.Updated) {
      if (this._animationTicks > 0) {
        this._animationTicks--;
      } else {
        this._state = RenderState.Active;
      }
    }

    if (this._state === RenderState.Removed) {
      if (this._animationTicks > 0) {
        this._animationTicks--;
      } else {
        this._state = RenderState.Inactive;
      }
    }
  }
}
