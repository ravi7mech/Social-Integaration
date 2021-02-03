import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  appUrl = 'http://localhost:3000'

  constructor(private http: HttpClient) { 

  }

  getOAuthRequestToken(){
    return this.http.get<any>(this.appUrl+`/auth/getOAuthRequestToken`);
  }

  getAllAuthenicatedUsers(){
    return this.http.get<any>(this.appUrl+`/auth/getAllAuthenicatedUsers`);
  }

  getUserDetails(id:any){
    return this.http.get<any>(this.appUrl+`/auth/getUserDetails/${id}`);
  }

  updateStatus(userId:string,userTweet:string, fileBase64Content:string){
    return this.http.post<any>(this.appUrl+`/auth/updateStatus`, {userId:userId, userTweet:userTweet, tweetImg:fileBase64Content});
  }


}
