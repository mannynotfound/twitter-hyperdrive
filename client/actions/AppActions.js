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

export function fetchTweetDataSuccess(user, tweets) {
  return {
    type: types.FETCH_TWEET_DATA_SUCCESS,
    user,
    tweets,
  }
}

export function searchTweetsSuccess(tweets) {
  return {
    type: types.SEARCH_TWEETS_SUCCESS,
    tweets,
  }
}

export function fetchUser(cookie) {
  return (dispatch) => (
    fetch(`${API}/fetchUser/${cookie}`)
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

export function searchTweets(term, cookie) {
  return (dispatch) => (
    fetch(`${API}/searchTweets/${cookie}/${term}`)
      .then((response) => response.json())
      .then((json) => dispatch(searchTweetsSuccess(json.statuses)))
      .catch((error) => console.log(error))
  )
}

export function fetchTweetData(cookie) {
  if (!cookie) {
    return (dispatch) => (
      dispatch({
        type: types.FETCH_TWEETS_FAILURE
      })
    )
  }

  return (dispatch) => (
    fetch(`${API}/fetchUser/${cookie}`)
      .then((userResp) => userResp.json())
      .then((user) => {
        fetch(`${API}/fetchTweets/${cookie}`)
        .then((tweetsResp) => tweetsResp.json())
        .then((tweets) => dispatch(fetchTweetDataSuccess(user, tweets)))
      })
      .catch((error) => console.log(error))
  )
}
