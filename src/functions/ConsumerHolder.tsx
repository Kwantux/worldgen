export class ConsumerHolder {

  private heightConsumers: Map<string, (values: Float32Array) => void> = new Map();
  private biomeConsumers: Map<string, (values: Int16Array) => void> = new Map();
  private colorConsumers: Map<string, (values: Float32Array) => void> = new Map();
  private updateFunctions: Map<string, () => void> = new Map();
  
  // Add Consumer Functions
  public addHeightConsumer(id: string, func: (values: Float32Array) => void) {
    this.heightConsumers.set(id, func);
    // console.log(`-- Height consumer registered with id ${id} --`)
    // console.log(this.heightConsumers.size + " height consumers in total")
  }
  
  public addBiomeConsumer(id: string, func: (values: Int16Array) => void) {
    this.biomeConsumers.set(id, func);
    // console.log(`-- Biome consumer registered with id ${id} --`)
    // console.log(this.biomeConsumers.size + " biome consumers in total")
  }
  
  public addColorConsumer(id: string, func: (values: Float32Array) => void) {
    this.colorConsumers.set(id, func);
    // console.log(`-- Color consumer registered with id ${id} --`)
    // console.log(this.colorConsumers.size + " color consumers in total")
  }
  
  public addUpdateFunction(id: string, func: () => void) {
    this.updateFunctions.set(id, func);
    // console.log(`-- Update function registered with id ${id} --`)
    // console.log(this.updateFunctions.size + " update functions in total")
  }
  
  // Call Consumer Functions
  public consumeHeight = (values: Float32Array) => {
    console.log("Updating height map")
    for (const func of this.heightConsumers.values()) {
      func(values);
    }
  };
  
  public consumeBiome = (values: Int16Array) => {
    console.log("Updating biome map")
    for (const func of this.biomeConsumers.values()) {
      func(values);
    }
  };
  
  public consumeColor = (values: Float32Array) => {
    console.log("Updating color map")
    for (const func of this.colorConsumers.values()) {
      func(values);
    }
  };
  
  public update = () => {
    console.log("Updating everything...")
    for (const func of this.updateFunctions.values()) {
      func();
    }
  };
  
}