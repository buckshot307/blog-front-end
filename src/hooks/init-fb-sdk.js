import { apiAccount } from './apiAccount'

//Creates a Promise to be used for waiting on FB SDK loading before doing other things
class Deferred {
  constructor() {
    var self = this
    this.promise = new Promise(function (resolve, reject) {
      self.reject = reject
      self.resolve = resolve
    })
  }
}
//fbLoaded.resolve() is added after FB.init
export const fbLoaded = (new Deferred());
/* 
    Use like this:

    fbLoaded.promise.then( functionToRunAfterSDKLoads() )
*/

//Initializes facebook's javascript SDK
export const InitFacebookSdk = () => {
  //initialize FB SDK before starting app
  console.log('Initializing FB SDK')
  window.fbAsyncInit = () => {
    FB.init({
      appId: process.env.FB_APP_ID,
      cookie: true,
      xfbml: true,
      version: 'v9.0',
      status: true
    })
    fbLoaded.resolve()
  },
    //load FB sdk script
    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'))
}


//Checks login state of user.  If logged in, authorizes them with local auth
export const findIfLoggedIn = () => {
  fbLoaded.promise.then(() => {
    FB.getLoginStatus((response) => {

    /*  response = 
        {status: ['connected', 'not_authorized', 'unknown'],
          authResponse : {
            accessToken: '...',
            expiresIn: '...',
            signedRequest: '...',
            userID: '...'          } }   */
    console.log(response)
    if (response.status === 'connected') {
        console.log('Connected: ' + response.authResponse),
        //if user is logged into FB, and authorized locally
        apiAccount.FbApiAuth(response.authResponse.userID, response.authResponse.accessToken)
    } else {
      console.log('error not logged in')
    }
  })}, console.log('Not fulfilled')
  )
}