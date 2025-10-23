import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-btn-del',
  imports: [],
  templateUrl: './btn-del.html',
  styleUrl: './btn-del.css'
})
export class BtnDel {
  disabled = input<boolean>();
  clickEvent = output<Event>()

  onClick(event :Event) {
    this.clickEvent.emit(event)
  }
}
