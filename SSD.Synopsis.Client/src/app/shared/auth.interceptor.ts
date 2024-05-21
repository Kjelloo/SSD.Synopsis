import { HttpInterceptorFn } from '@angular/common/http';
import {User} from "./dtos/user.dto";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Get the auth token from the service.
  let user = JSON.parse(localStorage.getItem('user')!) as User;

  if (user == undefined || user.token == undefined || user.token == '') {
    return next(req);
  }

  let authToken = user.token;
  // Clone the request and replace the original headers with
  // cloned headers, updated with the authorization.

  if (authToken) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: "Bearer " + authToken,
      },
    });
    return next(cloned);
  } else {
    return next(req);
  }
};
