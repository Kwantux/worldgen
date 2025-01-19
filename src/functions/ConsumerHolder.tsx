export class ConsumerHolder {
  public heightMapConsumer: (values: Float32Array) => void;

  constructor() {
    this.heightMapConsumer = () => {};
  }
}