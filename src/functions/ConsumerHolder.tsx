export class ConsumerHolder {

  // Consumer Function Arrays
  private heightConsumers: ((values: Float32Array) => void)[] = [];
  private biomeConsumers: ((values: Int16Array) => void)[] = [];
  private colorConsumers: ((values: Float32Array) => void)[] = [];

  private updateFunctions: (() => void)[] = [];


  // Add Consumer Functions
  public addHeightConsumer(func: (values: Float32Array) => void) {
    this.heightConsumers.push(func);
  }
  public addBiomeConsumer(func: (values: Int16Array) => void) {
    this.biomeConsumers.push(func);
  }
  public addColorConsumer(func: (values: Float32Array) => void) {
    this.colorConsumers.push(func);
  }

  public addUpdateFunction(func: () => void) {
    this.updateFunctions.push(func);
  }


  // Call Consumer Functions
  public consumeHeight = (values: Float32Array) => {
    console.log("Updating height map")
    for (const func of this.heightConsumers) {
      func(values);
    }
  };
  public consumeBiome = (values: Int16Array) => {
    console.log("Updating biome map")
    for (const func of this.biomeConsumers) {
      func(values);
    }
  };
  public consumeColor = (values: Float32Array) => {
    console.log("Updating color map")
    for (const func of this.colorConsumers) {
      func(values);
    }
  };

  public update = () => {
    for (const func of this.updateFunctions) {
      func();
    }
  };

}