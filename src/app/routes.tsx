/**
 * High level router.
 *
 * Note: It's recommended to compose related routes in internal router
 * common-library (e.g: `src/app/modules/auth/pages/AuthPage`, `src/app/BasePage`).
 */

import { BrowserRouter as Router, Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import BasePage from './base-page';
import { Layout } from './layout/components/layout';
import ErrorsPage from './layout/errors/errors-page';
import { AuthPage, Logout } from './pages/auth';
import store from '../redux/store';
import AboutPage from './pages/about-page/about-page';

export function Routes() {
  const userInfo = useSelector(({ auth }: any) => auth);
  const location = useLocation()
  const { pathname } = location;
  const { search } = location;
  const temp = new URLSearchParams(search).get('callbackUrl');
  let callbackUrl = temp ? temp : pathname;
  const isAuthUrls = callbackUrl.indexOf('/logout') > -1 || callbackUrl.indexOf('/auth/') > -1;
  callbackUrl = !isAuthUrls ? callbackUrl : '/';
  

  const isLoggedInAndUnexpired = () => {
    const unexpired = () => {
      const expiredTime = new Date(userInfo._certificate.certificateInfo.timestamp);
      expiredTime.setSeconds(expiredTime.getSeconds() + userInfo._certificate.certificateInfo.exp);
      return expiredTime.getTime() > new Date().getTime();
    };
    return userInfo._certificate && !userInfo._preLoggedIn && unexpired();
  };

  // const isLoggedInAndUnexpired = () => {
  //   // Check if we have a token
  //   const token = localStorage.getItem('accessToken');
  //   if (!token) return false;
    
  //   try {
  //     // Decode the JWT token
  //     const tokenParts = token.split('.');
  //     if (tokenParts.length !== 3) return false;
      
  //     // Parse the payload
  //     const base64Url = tokenParts[1];
  //     const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  //     const payload = JSON.parse(window.atob(base64));
      
  //     // Extract expiration time
  //     const expTime = payload.exp * 86400; // Convert to milliseconds
  //     const currentTime = Date.now();
      
  //     console.log("Token expires:", new Date(expTime).toLocaleString());
  //     console.log("Current time:", new Date(currentTime).toLocaleString());
      
  //     // Check if user is logged in and token is not expired
  //     return (
  //       userInfo && 
  //       userInfo.id && // Check for user ID from your new API response
  //       expTime > currentTime // Check if token is not expired
  //     );
  //   } catch (e) {
  //     console.error("Error validating token:", e);
  //     return false; // If there's any error, treat as not logged in
  //   }
  // };

  let username = location.pathname === '/auth/login/identifier' ? null : userInfo.username;
  
  const errorMessage = !isLoggedInAndUnexpired
    ? userInfo?._error
    : new URLSearchParams(search).get('errorMessage');

  const CheckAuth = () => {
    const state: any = store.getState();
    const username = state.auth.username;
    
    if (isLoggedInAndUnexpired()) {
      return [
        <Redirect from={'/auth'} to={callbackUrl} key={'r_base'} />,
        <Layout key={'base'}>
          <BasePage />
        </Layout>,
      ];
    } else {
      return (
        <Route>
          <AuthPage />
          {username ? (
            <Route>
              <Redirect to={`/auth/login/challenge?callbackUrl=${callbackUrl}`} />
            </Route>
          ) : (
            <Route>
              <Redirect
                to={`/auth/login/identifier?callbackUrl=${callbackUrl}&errorMessage=${errorMessage}`}
              />
            </Route>
          )}
        </Route>
      );
    }
  };
  
  const HomePage = () => {
    if (!isLoggedInAndUnexpired()) {
        return (
          <Route exact path="/">
            <AboutPage />     
          </Route>
        );
      } else {
        return null; // Render nothing if logged in
      }   
  }

  return (
    <Switch>
      <Route path="/error" component={ErrorsPage} />
      <Route path="/logout" component={Logout} />

      {HomePage()}    
      {CheckAuth()}
    </Switch>
  );
}
