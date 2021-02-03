import { Request, Response, NextFunction } from "express";
import { OAuth } from "oauth";
import * as Twit from "twit";


const CONSUMER_KEY = ''; // use your conumer api token here
const CONSUMER_SECRET = ''; // use your conumer api token secret here
const userFBContext = new Map();

var oAuthTokenSecret = '';
var oAuthAccessToken = ''; 
var oAuthAccessTokenSecret = ''; 
const NG_ROK_URL = 'https://a35b6f97396b.ngrok.io';

const oauth = new OAuth(
  'https://api.twitter.com/oauth/request_token',
  'https://api.twitter.com/oauth/access_token',
  CONSUMER_KEY,
  CONSUMER_SECRET,
  '1.0',
  `${NG_ROK_URL}/auth/handleOAuthResponse`,
  'HMAC-SHA1'
);


const twitterApi = (oAuthAccessToken, oAuthAccessTokenSecret) => new Twit({
  consumer_key: CONSUMER_KEY,
  consumer_secret: CONSUMER_SECRET,
  access_token: oAuthAccessToken,
  access_token_secret: oAuthAccessTokenSecret
});


export function getOAuthRequestToken(req: Request, res: Response, next: NextFunction) {
  console.log(NG_ROK_URL);

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
        twitterApi(oAuthAccessToken, oAuthAccessTokenSecret).
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
  let tweetType = '';

  tweetType = req.body.tweetImg ? 'WITH_IMAGE' : 'WITHOUT_IMAGE';

  switch (tweetType) {
    case 'WITH_IMAGE':
      updateStatusWithImage(req);
      break;
    case 'WITHOUT_IMAGE':
      updateStatusWithOutImage(req);
      break;
    default:
      break;
  }


  function updateStatusWithImage(req: Request) {
    if (req.body.tweetImg) {
      let userObj = userFBContext.get(req.body.userId);
      const twitApi = twitterApi(userObj.oAuthAccessToken, userObj.oAuthAccessTokenSecret);

      twitApi.post('media/upload', { media_data: req.body.tweetImg }, (err: any, result: any, response: any) => {
        const media_id = result.media_id_string;
        var altText = "Small flowers in a planter on a sunny balcony, blossoming."
        const meta_params = { media_id: media_id, alt_text: { text: altText } };

        twitApi.post('media/metadata/create', meta_params, (err: any, result: any, response: any) => {
          if (!err) {
            // now we can reference the media and post a tweet (media will attach to the tweet)
            var params = { status: req.body.userTweet , media_ids: [media_id] };

            twitApi.post('statuses/update', params, (err: any, result: any, response: any) => {
              console.log(result)
              res.json({
                response: result
              });
            })
          }
        });
      });
    }
  }

  function updateStatusWithOutImage(req: Request) {
    if (req.body.userTweet) {
      let userObj = userFBContext.get(req.body.userId);
      twitterApi(userObj.oAuthAccessToken, userObj.oAuthAccessTokenSecret).
        post('statuses/update', { status: req.body.userTweet }, (err: any, result: any, response: any) => {
          res.json({
            response: result
          });
        });
    }
  }
}




