import { action } from 'mobx'
import firebase from 'firebase'
import MobxFirebaseStore from 'mobx-firebase-store'

export default class MatchStore extends MobxFirebaseStore {
  constructor() {
    super(firebase.database().ref())
    firebase.auth().onAuthStateChanged((user) => {
      this.user = user;
    })
  }
  resolveFirebaseQuery(sub) {
    //write turnery operatory to say if this.user exists it will query the database
    return this.user ? this.fb.child(sub.path).orderByChild('viewedBy/'+this.user.uid).equalTo(null).limitToLast(10) : []
  }

  @action
  markViewed(post) {
    let updates = {}
    updates['viewedBy/' + this.user.uid] = true
    //it will take object with single key value paire or an object of multiple atomically
    this.fb.child('posts').child(post).update(updates)
  }
// mobx firebase stores specific method
  subs() {
    return [{
      // object needs specific keys
      subKey: 'matches',
      // the path in our database to get to our data
      path: 'posts',
      asList: true, // was as last
      user: this.user
    }]
  }
}
