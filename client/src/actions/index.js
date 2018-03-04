import axios from 'axios';
import { browserHistory } from 'react-router';
import {
  AUTH_USER,
  UNAUTH_USER,
  AUTH_ERROR
} from './types';

const API_URL = 'http://localhost:3090';

export function signinUser({ email, password }) {
  return function (dispatch) {
    // submit email password to server
    axios.post(`${API_URL}/signin`, { email, password })
      .then( response => {
        // if request is good
        // - update state
        dispatch({type: AUTH_USER});
        // - save JWT token
        localStorage.setItem('token', response.data.token);
        // - redirect to the route '/feature'
        browserHistory.push('/feature');
      })
      .catch(() => {
        // - if request is bad
        // - show error
        dispatch(authError('Bad login info'));
      })
  }
}


export function signupUser({ email, password }) {
  return function(dispatch) {
    axios.post(`${API_URL}/signup`, { email, password })
      .then(response => {
        dispatch({ type: AUTH_USER });
        localStorage.setItem('token', response.data.token);
        browserHistory.push('/feature');
      })
      .catch(response => dispatch(authError(response.response.data.error)));
  }
}



export function authError(error) {
  return {
    type: AUTH_ERROR,
    payload: error
  }
}

export function signoutUser() {
  localStorage.removeItem('token');

  return { type: UNAUTH_USER };
}
