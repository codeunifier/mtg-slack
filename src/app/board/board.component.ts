import { Component, OnInit } from '@angular/core';
import { ZoneList } from '../_models/zone-list';
import { ListItem } from '../_models/list-item';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  zoneLists: ZoneList[] = [];
  
  initializeZoneLists(): void {
    this.zoneLists.push(new ZoneList("Hand", 'hand-container'));
    this.zoneLists[0].items.push(new ListItem(1, "White Card", "white"));
    this.zoneLists.push(new ZoneList("Battlefield", 'battlefield-container'));
    this.zoneLists[1].items.push(new ListItem(2, "Blue Card", "blue"));
    this.zoneLists.push(new ZoneList("Exile", 'exile-container'));
    this.zoneLists[2].items.push(new ListItem(3, "Black Card", "black"));
    this.zoneLists.push(new ZoneList("Graveyard", 'graveyard-container'));
    this.zoneLists[3].items.push(new ListItem(4, "Red Card", "red"));
  }

  public draggableConfig = {
    draggable: true,
    effectAllowed: false
  };

  movingItem = null;

  droppedItems = [];
  dropped = false;

  constructor() { }

  ngOnInit() {
    //make database call to grab user's cards

    this.initializeZoneLists();
  }

  onDragStart(e): void {
    
  }

  onDragEnd(e): void {
    //not thrown when the item is removed after a drop
  }

  onDrop(listIndex: number, e): void {
    var data = e.dragData;

    //append to new list
    this.zoneLists[listIndex].items.push(data.item);
    //remove from old list
    this.zoneLists[data.listIndex].items.splice(data.itemIndex, 1);
  }

  onDrag(e): void {

  }
}
