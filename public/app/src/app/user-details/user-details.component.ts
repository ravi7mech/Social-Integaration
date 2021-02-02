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
  userDataJSON : any = {};
  userId: any;
  userTweet = '';
  isPosted:boolean = false;

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

  tweet(): void{
    if(this.userTweet){
      this.apiClient.updateStatus(this.userId, this.userTweet).subscribe(data =>{
        if(data.response.id){
          this.isPosted = true;
          this.userTweet = '';
        }
      })
    }
  }

}
