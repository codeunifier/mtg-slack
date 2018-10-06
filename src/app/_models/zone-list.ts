import { ListItem } from "./list-item";

export class ZoneList {
    id: number;
    name: string;
    items: ListItem[];
    classList: string;

    constructor(name: string, classList: string) {
        this.name = name;
        this.items = [];
        this.classList = classList;
    }
}