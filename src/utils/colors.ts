export class Color {
  readonly hex: string;

  constructor(
    readonly red: number,
    readonly green: number,
    readonly blue: number
  ) {
    this.hex = `#${toHex(this.red)}${toHex(this.green)}${toHex(this.blue)}`;
  }

  // # Params
  // - hex: "#ffffff" のような文字列
  static fromHex(hex: string): Color {
    const red = fromHex(hex.slice(1, 3));
    const green = fromHex(hex.slice(3, 5));
    const blue = fromHex(hex.slice(5, 7));
    return new Color(red, green, blue);
  }

  // # Params
  // - opacity: 0 ~ 1
  //
  // # Returns
  // string such as "#ffffff00"
  hexWithOpacity(opacity: number): string {
    return `${this.hex}${toHex(opacity * 256)}`;
  }

  // # Params
  // - opacity: 0 ~ 1
  //
  // # Returns
  // string such as "rgba(256, 256, 256, 256)"
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

export const white = Color.fromHex("#FFFFFF");
export const gray10 = Color.fromHex("#FAFAFA");
export const gray20 = Color.fromHex("#E0E0E0");
export const gray30 = Color.fromHex("#BDBDBD");
export const gray50 = Color.fromHex("#757575");
export const gray90 = Color.fromHex("#212121");
export const black = Color.fromHex("#000000");
export const tomato = Color.fromHex("#f44336");

export default Color;
