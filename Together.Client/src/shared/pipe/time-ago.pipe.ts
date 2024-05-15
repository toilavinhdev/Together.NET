import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  standalone: true,
})
export class TimeAgoPipe implements PipeTransform {
  readonly HOUR = 60;
  readonly DAY = this.HOUR * 24;
  readonly MONTH = this.DAY * 30;
  readonly YEAR = this.MONTH * 365;

  transform(input: string): string {
    const now = Date.now();
    const inputTime = new Date(input).getTime();

    const duration = now - inputTime;
    const minutes = Math.floor(duration / (1000 * 60));

    if (minutes < 1) {
      return 'Vừa xong';
    } else if (minutes >= 1 && minutes < this.HOUR) {
      return `${minutes} phút`;
    } else if (minutes >= this.HOUR && minutes < this.DAY) {
      return `${Math.floor(minutes / this.HOUR)} giờ`;
    } else if (minutes >= this.DAY && minutes < this.MONTH) {
      return `${Math.floor(minutes / this.DAY)} ngày`;
    } else if (minutes >= this.MONTH && minutes < this.YEAR) {
      return `${Math.floor(minutes / this.MONTH)} tháng`;
    } else if (minutes >= this.YEAR) {
      return `${Math.floor(minutes / this.YEAR)} năm`;
    } else {
      return '';
    }
  }
}
