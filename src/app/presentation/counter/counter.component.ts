import { Component, OnInit, Input } from '@angular/core'

@Component({
  selector: 'app-counter',
  template: '<span class="badge badge-primary">{{count != null ? count : null}}</span>',
})
export class CounterComponent implements OnInit {
  @Input() private count: number

  constructor() { }

  ngOnInit() {
  }

}
