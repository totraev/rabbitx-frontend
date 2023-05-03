import type { Row } from "../../../../types";

export enum RenderState {
  Active,
  Updated,
  Removed,
  Inactive,
}

export class RowState {
  static readonly ANIMATION_DURATION = 500; //ms
  static readonly DEFAULT_FONT_OPACITY = 'ff'; // opacity 1

  private _animationTimestamp = 0;
  private _state = RenderState.Active;

  constructor(private _data: Row | null = null) {}

  get visible() {
    return this._state !== RenderState.Inactive;
  }

  get inactive() {
    return this._state === RenderState.Inactive;
  }

  get updated() {
    return this._state === RenderState.Updated && this._animationTimestamp > 0;
  }

  get removed() {
    return this._state === RenderState.Removed && this._animationTimestamp > 0;
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

  get opacity() {
    if (!this._animationTimestamp) {
      return RowState.DEFAULT_FONT_OPACITY; // opcity 1
    }

    const duration = Date.now() - this._animationTimestamp;

    if (duration > RowState.ANIMATION_DURATION) {
      return RowState.DEFAULT_FONT_OPACITY;
    }

    const animationPercent = (100 * duration) / RowState.ANIMATION_DURATION;

    if (animationPercent < 50) {
      return Math.round((animationPercent * 255 * 2) / 100).toString(16).padStart(2, '0')
    } else {
      return Math.round(((100 - animationPercent) * 255 * 2) / 100).toString(16).padStart(2, '0')
    }
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
      this._animationTimestamp = Date.now();
    }

    if (this._state === RenderState.Removed) {
      this._state = RenderState.Active;
      this._animationTimestamp = 0;
    }

    this._data = data;
  }

  update(data: RowState) {
    this._animationTimestamp = data._animationTimestamp;
    this._data = data.data;
    this._state = data.renderState;
  }

  reset() {
    this._data = null;

    this._state = RenderState.Active;
    this._animationTimestamp = 0;
  }

  compare(row: Row, comparator: (a: Row | null, b: Row) => number): number {
    return comparator(this._data, row);
  }

  markAsRemoved() {
    this._state = RenderState.Removed;
    this._animationTimestamp = Date.now();
  }

  updateAnimationState() {
    switch (this._state) {
      case RenderState.Updated: {
        if (Date.now() - this._animationTimestamp > RowState.ANIMATION_DURATION) {
          this._state = RenderState.Active;
          this._animationTimestamp = 0;
        }

        return;
      }
      case RenderState.Removed: {
        if (Date.now() - this._animationTimestamp > RowState.ANIMATION_DURATION) {
          this._state = RenderState.Inactive;
          this._animationTimestamp = 0;
        }

        return;
      }
      default: {
        return;
      }
    }
  }
}
