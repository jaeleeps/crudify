export class CrudifySingleton {
  private static instance: CrudifySingleton;

  private constructor() {}

  public static getInstance(): CrudifySingleton {
    if (!CrudifySingleton.instance) {
      CrudifySingleton.instance = new CrudifySingleton();
    }

    return CrudifySingleton.instance;
  }
}
