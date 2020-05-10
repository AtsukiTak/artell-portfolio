export class Color {
  readonly hex: string;

  constructor(
    readonly red: number,
    readonly green: number,
    readonly blue: number
  ) {
    this.hex = `#${toHex(this.red)}${toHex(this.green)}${toHex(this.blue)}`;
  }

  static fromHex(hex: string): Color {
    const red = fromHex(hex.slice(1, 3));
    const green = fromHex(hex.slice(3, 5));
    const blue = fromHex(hex.slice(5, 7));
    return new Color(red, green, blue);
  }

  // opacity; 0 ~ 1
  hexWithOpacity(opacity: number): string {
    return `${this.hex}${toHex(opacity * 256)}`;
  }

  rgba(opacity: number): string {
    return `rgba(${this.red}, ${this.green}, ${this.blue}, ${opacity})`;
  }
}

function toHex(i: number): string {
  return ("0" + i.toString(16)).slice(-2);
}

function fromHex(hex: string): number {
  return parseInt(hex, 16);
}

export const White = Color.fromHex("#ffffff");
export const Black = Color.fromHex("#000000");
export const LightBlack = Color.fromHex("#333333");
export const MidGray = Color.fromHex("#666666");
export const LightGray = Color.fromHex("#a1a1a1");
