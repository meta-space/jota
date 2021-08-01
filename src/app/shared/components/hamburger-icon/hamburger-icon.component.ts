import { Component, Input } from '@angular/core';

@Component({
  selector: 'hamburger-icon',
  template: `
  <div class="w-full h-full relative focus:outline-none bg-transparent">
    <div class="block w-4/6 absolute left-1/2 top-1/2  transform  -translate-x-1/2 -translate-y-1/2">
      <span aria-hidden="true" class="block absolute h-0.5        bg-current transform transition duration-1000 ease-in-out" [ngClass]="{'rotate-45  -translate-x-px translate-y-1 w-3/6': open,' w-full -translate-y-1.5': !open }"></span>
      <span aria-hidden="true" class="block absolute h-0.5 w-full bg-current transform transition duration-1000 ease-in-out" ></span>
      <span aria-hidden="true" class="block absolute h-0.5        bg-current transform transition duration-1000 ease-in-out" [ngClass]="{'-rotate-45 -translate-x-px -translate-y-1 w-3/6': open, 'w-full translate-y-1.5': !open}"></span>
    </div>
  </div>
  `
})
export class HamburgerButtonComponent {

  @Input() open = false;

}
