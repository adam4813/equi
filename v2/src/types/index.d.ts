interface SidlProp {
  name: string;
  type: SidlTypes;
  isItem: boolean;
  isArray: boolean;
  defaultValue?: number | string | boolean;
}
