if (typeof registerPaint !== "undefined") {
  class RoughNotation {
    constructor() {
      this._seed = Math.floor(Math.random() * 2 ** 31);
    }

    static get inputProperties() {
      return ['--roughness', '--rough-color', '--type'];
    }

    paint(ctx, size, styles) {
      this._ctx = ctx
      this._ctx.lineWidth = 1.5;

      this._roughness = parseInt(styles.get('--roughness')) || 2;
      this._ctx.strokeStyle = String(styles.get('--rough-color')) || '#000';
      if (styles.get('--type').toString().trim() === 'box') {
        this._offset = 6;
        this.rectangle(this._offset, this._offset, size.width - this._offset, size.height - this._offset);
      } else {
        this._offset = 8;
        this.line(0, size.height - this._offset, size.width, size.height - this._offset);
      }
    }

    line(x1, y1, x2, y2) {
      const random = () => ((2 ** 31 - 1) & (this._seed = Math.imul(48271, this._seed))) / 2 ** 31;
      const offsetOpt = x => this._roughness * roughnessGain * ((random() * x * 2) - x);

      const lengthSq = Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2);
      const length = Math.sqrt(lengthSq);
      let roughnessGain = 1;
      if (length < 200) roughnessGain = 1;
      else if (length > 500) roughnessGain = 0.4;
      else roughnessGain = (-0.0016668) * length + 1.233334;
      const maxRandomnessOffset = 1;
      let offset = maxRandomnessOffset;
      if ((offset * offset * 100) > lengthSq) offset = length / 10;
      const divergePoint = 0.2 + random() * 0.2;

      const midDispX = offsetOpt(maxRandomnessOffset * (y2 - y1) / 200);
      const midDispY = offsetOpt(maxRandomnessOffset * (x1 - x2) / 200);

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

    rectangle(x, y, width, height) {
      const points = [
        [x, y],
        [x + width, y],
        [x + width, y + height],
        [x, y + height],
      ];
      const len = 4;
      for (let i = 0; i < (len - 1); i++)
        this.line(points[i][0], points[i][1], points[i + 1][0], points[i + 1][1])
      this.line(points[len - 1][0], points[len - 1][1], points[0][0], points[0][1])
    }
  }

  registerPaint('rough-notation', RoughNotation)
}