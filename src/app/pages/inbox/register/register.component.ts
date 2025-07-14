import { Component, importProvidersFrom, OnInit } from '@angular/core';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagComponent } from 'ng-zorro-antd/tag';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

interface ItemData {
  nro: number;
  code_rude: string;
  identity_card: string;
  last_name: string;
  mothers_last_name: string;
  full_name: string;
  gender: string;
  date_birth: Date | string;
  identity_card_father: string;
  last_name_father: string;
  mothers_last_name_father: string;
  full_name_father: string;
  relation: string;
}

@Component({
  imports: [
    NzTableModule,
    NzIconModule,
    NzButtonComponent,
    NzTagComponent,
    NzTypographyModule
  ],
  selector: 'register-inbox',
  templateUrl: './register.component.html',
  styleUrl: './register.component.less'
})
export class RegisterInbox implements OnInit {
  listOfData: ItemData[] = [];

  ngOnInit(): void {
    const data: ItemData[] = []
    for(let i = 0; i < 20; i++) {
      data.push({
        nro: i + 1,
        code_rude: '81711919191',
        identity_card: '9181721',
        last_name: 'Vargas',
        mothers_last_name: 'Ramirez',
        full_name: 'Leonel Maximo',
        gender: 'M',
        date_birth: '1994-02-22',
        identity_card_father: '1231122',
        last_name_father: 'Vargas',
        mothers_last_name_father: 'Ulloa',
        full_name_father: 'Ramiro Vidal',
        relation: 'PADRE'
      })
    }
    this.listOfData = data
  }

}