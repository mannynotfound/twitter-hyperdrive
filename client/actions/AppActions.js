import * as types from '../constants/ActionTypes'
import fetch from 'isomorphic-fetch'

const API = process.env.API || 'http://localhost:3000/api'

export function setClient(client) {
  return (dispatch) => (
     dispatch({
      type: types.SET_CLIENT,
      client,
    })
  )
}

export function toggleSidebar(sideOpen) {
  return (dispatch) => (
    dispatch({
      type: types.TOGGLE_SIDEBAR,
      sideOpen,
    })
  )
}

export function fetchUserSuccess(user) {
  return {
    type: types.FETCH_USER_SUCCESS,
    user,
  }
}

export function fetchTweetsSuccess(tweets) {
  return {
    type: types.FETCH_TWEETS_SUCCESS,
    tweets,
  }
}

export function fetchUser(cookie) {
  return (dispatch) => (
    fetch(`${API}/getUser/${cookie}`)
      .then((response) => response.json())
      .then((json) => dispatch(fetchUserSuccess(json)))
      .catch((error) => console.log(error))
  )
}

export function fetchTweets(cookie) {
  return (dispatch) => (
    fetch(`${API}/fetchTweets/${cookie}`)
      .then((response) => response.json())
      .then((json) => dispatch(fetchTweetsSuccess(json)))
      .catch((error) => console.log(error))
  )
}
