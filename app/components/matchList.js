import React, { Component } from 'react'
import {
  Button,
  Thumbnail,
  Text,
  Icon,
  View,
  Spinner
} from 'native-base'
import { StyleSheet } from 'react-native'
import { observer } from 'mobx-react/native'
// come from firebase nest which is dependencies of mobx
import { autoSubscriber } from 'firebase-nest'
import SwipeCards from 'react-native-swipe-cards'
//set up our initial state
class MatchList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fetching: null
    }
  }
  //since we are using auto subscriber
  // static function gives fb nest our store subscription object
  static getSubs(props, state) {
    return props.stores.matches.subs()
  }
  subscribeSubs(subs, props, state) {
    const { matches } = props.stores
    const { unsubscribe, promise } = matches.subscribeSubsWithPromise(subs)
    this.setState({fecthing: true}, () => {
      // handle the promise
      promise.then(() => {
        this.setState({fetching: false})
      })
    })
    return unsubscribe
  }
  //calling our markViewed
  markViewed(match, liked) {
    // we want the key in this instance
    this.props.stores.matches.markViewed(match[0])
    this.props.stores.history.add(match[0], liked)
  }
  renderCard(post, store) {
    const postObj = post ? post[1] : null
    if(postObj) {
      let pic = {uri: postObj.url}
      let text = postObj.text

      return (
        <View style={styles.card}>
          {pic.uri != undefined && pic.uri != "" ? <Thumbnail style={styles.thumbnail} source={pic}/> : null }
          <Text style={styles.text}>
            {text}
          </Text>
        </View>
      )
    }
    // if our post is null we will not render anything
    return null
  }
  renderNoMoreCards() {
    return (
      <View style={styles.noMoreCards}>
        <Text> Out of Matches </Text>
      </View>
    )
  }
  render() {
    const { matches } = this.props.stores
    const postList = matches.getData('matches')
    const list = postList ? postList.entries() : null
    const { fetching } = this.state
// Now lets return some jsx, start of with View
    return (
      <View>
        // if we are fetching we go head and render Spinner
        { fetching ? <Spinner/> :
          <SwipeCards
            cards={list}
            renderCard={(card) => this.renderCard(card, matches)}
            renderNoMoreCards={this.renderNoMoreCards}
            // event handler
            handleYup={(match) => { this.markViewed(match, true)}}
            handleNope={(match) => { this.markViewed(match,false)}}
          />
        }
      </View>
    )
  }
}
const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    borderRadius: 5,
    overflow: 'hidden',
    borderColor: 'grey',
    backgroundColor: 'white',
    borderWidth: 1,
    // since we give one card at a time we set elevation
    elevation: 1
  },
  text: {
    color: 'black',
    fontSize: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  thumbnail: {

    width: 300,
    height: 300
  },
  // in the abcence of car we set it to the center
  noMoreCards: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
export default autoSubscriber(observer(MatchList))
