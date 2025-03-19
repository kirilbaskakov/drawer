export type KeyCombo = string[];

interface KeyComboCallback {
  combo: KeyCombo;
  callback: () => void;
}

class KeyComboListener {
  private combinations: KeyComboCallback[] = [];
  private pressedKeys: Set<string> = new Set();

  constructor() {
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);

    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
  }

  public subscribe(combos: KeyCombo[], callback?: () => void): void {
    for (const combo of combos) {
      this.combinations.push({ combo, callback: callback! });
    }
  }

  private handleKeyDown(event: KeyboardEvent): void {
    // event.preventDefault();
    this.pressedKeys.add(event.code);
    this.checkCombinations();
  }

  private handleKeyUp(event: KeyboardEvent): void {
    this.pressedKeys.delete(event.code);
  }

  private checkCombinations(): void {
    for (const { combo, callback } of this.combinations) {
      if (
        combo.length === this.pressedKeys.size &&
        combo.every((key) => this.pressedKeys.has(key))
      ) {
        callback();
        break;
      }
    }
  }

  public unsubscribe(): void {
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
  }
}

export const keyComboListener = new KeyComboListener();

export default KeyComboListener;
