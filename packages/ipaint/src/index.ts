import Core from '@ipaint/core';

type TypeOptions = {
  devicePixelRatio?: number;
};

class iPaint extends Core {
  constructor(ctx: CanvasRenderingContext2D, opts?: TypeOptions) {
    super(ctx, opts);
  }
}

export default iPaint