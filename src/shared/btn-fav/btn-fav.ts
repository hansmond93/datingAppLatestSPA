import { Component, Input, output } from '@angular/core';

@Component({
  selector: 'app-btn-fav',
  imports: [],
  templateUrl: './btn-fav.html',
  styleUrl: './btn-fav.css'
})
export class BtnFav {
  clickEvent = output<boolean>();
  @Input({required: true}) disabled: boolean = false;
  @Input({required: true}) selected: boolean = false;

  onClick() {
    this.clickEvent.emit(true);
  }
}
