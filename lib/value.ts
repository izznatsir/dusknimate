export interface MotionCallback {
  (current: number, previous: number): void;
}

export class MotionValue {
  previous: number;
  current: number;

  callbacks: Set<MotionCallback> = new Set();

  constructor(value: number) {
    this.previous = this.current = value;
  }

  get() {
    return this.current;
  }

  getPrevious() {
    return this.previous;
  }

  subscribe(callback: MotionCallback) {
    this.callbacks.add(callback);
  }

  notify() {
    this.callbacks.forEach((callback) => {
      callback(this.current, this.previous);
    });
  }

  update(value: number) {
    this.previous = this.current;
    this.current = value;

    this.notify();
  }
}
