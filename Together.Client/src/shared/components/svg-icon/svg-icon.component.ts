import { Component, Input } from '@angular/core';

@Component({
  selector: 'together-svg-icon',
  standalone: true,
  imports: [],
  template: `
    <svg
      [class]="className"
      [style.fill]="fill"
      [style.height.px]="height || size"
      [style.stroke]="stroke"
      [style.width.px]="width || size"
      xmlns="http://www.w3.org/2000/svg"
    >
      <use [attr.xlink:href]="iconUrl"></use>
    </svg>
  `,
})
export class SvgIconComponent {
  @Input() name!: string;
  @Input() size: number | string = 25;
  @Input() width?: number | string;
  @Input() height?: number | string;
  @Input() fill?: string;
  @Input() stroke?: string;
  @Input() className!: string;

  constructor() {}

  get iconUrl() {
    return `${window.location.href}#${this.name}`;
  }
}
