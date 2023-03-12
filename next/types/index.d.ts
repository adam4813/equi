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

interface IItem {
  name: string;
  type: ISidlType;
  propertyValues: Map<string, ItemPropertyValue | ItemPropertyValue[]>;
}

type UIFIle = Map<string, Item>;

type MapProperty = Map<
  string,
  number | string | boolean | Map<string, number | string | boolean>
>;

type ItemPropertyValue = number | string | boolean | MapProperty | IItem;

type SidlMap = Map<string, ISidlType>;

type FileMap = Map<string, UIFIle>;

interface UI2DAnimation extends IItem {
  propertyValues: Map<"Frames", Map<"Size", Map<"CX" | "CY", number>>[]>;
}
