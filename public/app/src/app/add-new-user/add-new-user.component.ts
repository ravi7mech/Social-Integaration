import { Component, OnInit } from '@angular/core';
import { ApplicationService } from '@app/application.service';

@Component({
  selector: 'app-add-new-user',
  templateUrl: './add-new-user.component.html',
  styleUrls: ['./add-new-user.component.scss'],
  providers: [ApplicationService]
})
export class AddNewUserComponent implements OnInit {

  OAuthToken = '';

  constructor(private apiClient: ApplicationService) { }

  ngOnInit(): void {
    this.apiClient.getOAuthRequestToken().subscribe((data: any) => {
      this.OAuthToken = data.OAuthToken;
    });
  }

}
