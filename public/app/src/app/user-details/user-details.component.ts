import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApplicationService } from '@app/application.service';


@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
  providers: [ApplicationService]
})
export class UserDetailsComponent implements OnInit {

  userData = '';
  userDataJSON: any = {};
  userId: any;
  userTweet = '';
  isPosted: boolean = false;
  fileToUpload: any;
  fileBase64Content: string | ArrayBuffer | null = '';

  constructor(private apiClient: ApplicationService, private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.params.id;
    console.log(this.userId);
    this.apiClient.getUserDetails(this.userId).subscribe(data => {
      if (data.user) {
        this.userDataJSON = data.user;
        this.userData = JSON.stringify(data.user, null, 2)
      }
    })
  }

  tweet(): void {
    if (this.userTweet) {
      this.apiClient.updateStatus(this.userId, this.userTweet, this.fileBase64Content as string).subscribe(data => {
        if (data.response.id) {
          this.isPosted = true;
          this.fileBase64Content = '';
          this.userTweet = '';
          this.fileToUpload = null;
        }
      })
    }
  }

  handleFileInput(event: any) {
    this.fileToUpload = event.target.files[0];
    this.toBase64(this.fileToUpload)
  }

  async toBase64(file: any) {
    const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.fileBase64Content = (reader.result as string).split(",")[1];
      };
      reader.onerror = error => {
        console.error(error);
        
      };
  }

}
