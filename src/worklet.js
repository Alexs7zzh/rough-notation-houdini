if (typeof registerPaint !== "undefined") {
  class RoughNotation {
    constructor() {
      this._bowing = 1;
      this._offset = 4;
      this._maxRandomnessOffset = 1;
      this._seed = Math.floor(Math.random() * 2 ** 31);
    }

    static get inputProperties() {
      return ['--roughness', '--rough-color'];
    }

    paint(ctx, size, styles) {
      this._ctx = ctx

      this._roughness = parseInt(styles.get('--roughness')) || 2;
      this._ctx.lineWidth = 2;
      this._ctx.strokeStyle = String(styles.get('--rough-color')) || '#000';

      this.drawLine(0, size.height - this._offset, size.width, size.height - this._offset);
    }

    drawLine(x1, y1, x2, y2) {
      const random = () => ((2 ** 31 - 1) & (this._seed = Math.imul(48271, this._seed))) / 2 ** 31;
      const offsetOpt = x => this._roughness * roughnessGain * ((random() * x * 2) - x);

      const lengthSq = Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2);
      const length = Math.sqrt(lengthSq);
      let roughnessGain = 1;
      if (length < 200) roughnessGain = 1;
      else if (length > 500) roughnessGain = 0.4;
      else roughnessGain = (-0.0016668) * length + 1.233334;
      let offset = this._maxRandomnessOffset;
      if ((offset * offset * 100) > lengthSq) offset = length / 10;
      const divergePoint = 0.2 + random() * 0.2;

      const midDispX = offsetOpt(this._bowing * this._maxRandomnessOffset * (y2 - y1) / 200);
      const midDispY = offsetOpt(this._bowing * this._maxRandomnessOffset * (x1 - x2) / 200);

      const randomFull = () => offsetOpt(offset);

      this._ctx.save();
      this._ctx.beginPath();
      this._ctx.moveTo(x1 + offsetOpt(offset), y1 + offsetOpt(offset))
      this._ctx.bezierCurveTo(
        midDispX + x1 + (x2 - x1) * divergePoint + randomFull(),
        midDispY + y1 + (y2 - y1) * divergePoint + randomFull(),
        midDispX + x1 + 2 * (x2 - x1) * divergePoint + randomFull(),
        midDispY + y1 + 2 * (y2 - y1) * divergePoint + randomFull(),
        x2 + randomFull(),
        y2 + randomFull(),
      )
      this._ctx.stroke();
      this._ctx.restore();
    }
  }

  registerPaint('rough-notation', RoughNotation)
}