import { Component, OnInit } from '@angular/core';

import { AccountService } from 'app/core/auth/account.service';
import { AppPageTitleStrategy } from 'app/app-page-title-strategy';
import { Router } from '@angular/router';
import { Account } from 'app/core/auth/account.model';

@Component({
  selector: 'mss-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  providers: [AppPageTitleStrategy],
})
export default class MainComponent implements OnInit {
  constructor(private router: Router, private appPageTitleStrategy: AppPageTitleStrategy, private accountService: AccountService) {}

  get getAccount(): Account | null {
    return this.accountService.getIdentity();
  }

  ngOnInit(): void {
    // try to log in automatically
    this.accountService.identity().subscribe();
  }
}
