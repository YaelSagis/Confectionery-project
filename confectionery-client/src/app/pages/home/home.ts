import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PHOTOS, SITE } from '../../core/site';
import { Icon, IconName } from '../../shared/icon';

interface Step {
  icon: IconName;
  title: string;
  text: string;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink, Icon],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  protected readonly site = SITE;
  protected readonly photos = PHOTOS;

  protected readonly steps: Step[] = [
    { icon: 'cake', title: 'בוחרים מהתפריט', text: 'עוברים על התפריט ומוסיפים להזמנה את מה שמתחשק.' },
    { icon: 'calendar', title: 'קובעים תאריך', text: 'משאירים שם, טלפון ותאריך שבו תרצו לקבל את ההזמנה.' },
    { icon: 'phone', title: 'אנחנו חוזרים אליכם', text: 'ההזמנה מגיעה ישר אלינו, ונתקשר לאשר אותה.' },
  ];

  protected scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
