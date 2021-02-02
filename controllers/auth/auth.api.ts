import { Request, Response, NextFunction } from "express";
import { OAuth } from "oauth";
import * as Twit from "twit";


const CONSUMER_KEY = '';
const CONSUMER_SECRET = '';
const userFBContext = new Map();

var oAuthTokenSecret = '';
var oAuthAccessToken = '';
var oAuthAccessTokenSecret = '';
const NG_ROK_URL = 'https://9eadfca65a65.ngrok.io';

const oauth = new OAuth(
  'https://api.twitter.com/oauth/request_token',
  'https://api.twitter.com/oauth/access_token',
  CONSUMER_KEY,
  CONSUMER_SECRET,
  '1.0',
  `${NG_ROK_URL}/auth/handleOAuthResponse`,
  'HMAC-SHA1'
);


const createTwitterBus = (oAuthAccessToken, oAuthAccessTokenSecret) => new Twit({
  consumer_key: CONSUMER_KEY,
  consumer_secret: CONSUMER_SECRET,
  access_token: oAuthAccessToken,
  access_token_secret: oAuthAccessTokenSecret
});


export function getOAuthRequestToken(req: Request, res: Response, next: NextFunction) {

  oauth.getOAuthRequestToken((err, OAuthToken, OAuthTokenSecret, results) => {

    oAuthTokenSecret = OAuthTokenSecret;

    res.json({
      OAuthToken: OAuthToken,
      OAuthTokenSecret: OAuthTokenSecret
    });

  });

}

export function handleOAuthResponse(req: Request, res: Response, next: NextFunction) {

  const oauth_token = req.query.oauth_token.toString();
  const oauth_verifier = req.query.oauth_verifier.toString();

  console.log(oAuthTokenSecret);

  oauth.getOAuthAccessToken(
    oauth_token,
    oAuthTokenSecret,
    oauth_verifier,
    (err, oAuthAccessToken, oAuthAccessTokenSecret, results) => {
      // store the access token and the access token secret some where else
      // now we did it globally to do some twitter activities
      oAuthAccessToken = oAuthAccessToken;
      oAuthAccessTokenSecret = oAuthAccessTokenSecret;
      // verifiy the user account
      console.log(oAuthAccessToken);
      console.log(oAuthAccessTokenSecret);
      if (oAuthAccessTokenSecret && oAuthAccessToken) {
        createTwitterBus(oAuthAccessToken, oAuthAccessTokenSecret).
          get('account/verify_credentials', (err: any, result: any, response: any) => {
            userFBContext.set(result.id.toString(), {
              id: result.id,
              name: result.name,
              screen_name: result.screen_name,
              oAuthAccessToken: oAuthAccessToken,
              oAuthAccessTokenSecret: oAuthAccessTokenSecret,
              profile_image_url: result.profile_image_url,
              all_result: result
            });
            res.redirect('http://localhost:4200/allUsers')
          });
      }
    });


}


export function getAllAuthenicatedUsers(req: Request, res: Response, next: NextFunction) {

  res.json({
    users: Array.from(userFBContext.values())
  });

}

export function getUserDetails(req: Request, res: Response, next: NextFunction) {
  console.log(req.params);

  res.json({
    user: userFBContext.get(req.params.id).all_result
  });

}

export function updateStatus(req: Request, res: Response, next: NextFunction) {
  console.log(req.body.userTweet);
  if (req.body.userTweet) {
    let userObj = userFBContext.get(req.body.userId);
    createTwitterBus(userObj.oAuthAccessToken, userObj.oAuthAccessTokenSecret).
      post('statuses/update', { status: req.body.userTweet }, (err: any, result: any, response: any) => {
        res.json({
          response: result
        });
      });
  }

}




