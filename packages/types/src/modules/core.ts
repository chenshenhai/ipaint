import { TypeDataPosition  } from './../base';


export abstract class TypeModuleCore {
  public abstract pushPosition(p: TypeDataPosition): void;
  public abstract drawStart(): void;
  public abstract drawEnd(): void;
  public abstract drawLine(): void;
}