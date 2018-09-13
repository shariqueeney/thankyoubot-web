import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

@Component({
  selector: 'app-root',
  template: `
        <ul>
            <li *ngFor="let item of items | async">
                <pre>{{ item | json }}</pre>
            </li>
        </ul>
    `,
})
export class AppComponent {
  public items: AngularFireList<any>;
  constructor(db: AngularFireDatabase) {
    this.items = db.list('/messages');
    console.log(this.items);
  }
}
