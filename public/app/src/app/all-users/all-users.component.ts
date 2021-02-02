import { Component, OnInit } from '@angular/core';
import { ApplicationService } from '@app/application.service';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.scss'],
  providers: [ApplicationService]
})
export class AllUsersComponent implements OnInit {

  allUsers:any;

  constructor(private apiClient: ApplicationService) { }

  ngOnInit(): void {
    this.apiClient.getAllAuthenicatedUsers().subscribe((data: any) => {
      this.allUsers = data.users;
    });
  }

}
