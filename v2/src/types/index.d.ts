interface SidlProp {
  name: string;
  type: ISidlType | undefined;
  isItem: boolean;
  isArray: boolean;
  defaultValue?: number | string | boolean;
}

interface ISidlType {
  name: string;
  superType: ISidlType | undefined;
  _properties: SidlProp[];
  defaultValue?: number | string | boolean;
  properties: SidlProp[];
  addProperty(prop: SidlProp): void;
}