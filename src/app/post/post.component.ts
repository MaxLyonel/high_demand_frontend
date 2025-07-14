import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzTabPosition, NzTabsModule } from 'ng-zorro-antd/tabs';

@Component({
  selector: 'app-post',
  imports: [FormsModule, NzInputNumberModule, NzRadioModule, NzTabsModule],
  templateUrl: './post.component.html'
})
export class PostComponent implements OnInit {
  tabs: Array<{ name: string; content: string; disabled: boolean }> = [];
  nzTabPosition: NzTabPosition = 'top';
  selectedIndex = 27;

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  log(args: any[]): void {
    console.log(args);
  }

  ngOnInit(): void {
    for (let i = 0; i < 30; i++) {
      this.tabs.push({
        name: `Tab ${i}`,
        disabled: i === 28,
        content: `Content of tab ${i}`
      });
    }
  }
}
