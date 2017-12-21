import auth0 from 'auth0-js';
/**
 * authentication class
 */

 /**
  * class auth runs auth0
  */
export default class Auth {
  auth0 = new auth0.WebAuth({
    domain: 'mapproject.auth0.com',
    // clientID: need to add locally until have some sort of secure file for storage
    redirectUri: 'http://localhost:3000/callback',
    audience: 'https://mapproject.auth0.com/userinfo',
    responseType: 'token id_token',
    scope: 'openid'
  });

  /**
   returns access token, id token, xpires in
   */
  login() {
    this.auth0.authorize();
  }
}
