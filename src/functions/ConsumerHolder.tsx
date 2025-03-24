export class ConsumerHolder {
  public heightMapConsumer: (values: Float32Array) => void;
  public updateFunction: () => void;

  constructor() {
    this.heightMapConsumer = () => {};
    this.updateFunction = () => {};
  }
}