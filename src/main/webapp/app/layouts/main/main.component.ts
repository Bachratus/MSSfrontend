import { Component, OnInit } from '@angular/core';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

@Component({
  selector: 'mss-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export default class MainComponent implements OnInit {
  constructor(private accountService: AccountService) { }

  get getAccount(): Account | null {
    return this.accountService.getIdentity();
  }

  ngOnInit(): void {
    this.accountService.identity().subscribe();
  }
}
