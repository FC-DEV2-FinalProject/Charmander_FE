/* eslint-disable no-unused-vars */
type DropDownProps = {
  placeholder?: string;
  dropDownData:
    | {
        id: number;
        name: string;
      }[]
    | string[];
  width?: string;
  onSelect?: (value: string) => void;
};

export type { DropDownProps };
