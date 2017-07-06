import { action } from 'mobx'
import firebase from 'firebase'
import MobxFirebaseStore from 'mobx-firebase-store'

import RNFetchBlob from 'react-native-fetch-blob'

const Blob = RNFetchBlob.polyfill.Blob
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob
// reference to our firebase database note post
const base = 'posts'

export default class PostStore extends MobxFirebaseStore {
  constructor() {
    super(firebase.database().ref())
    firebase.auth().onAuthStateChanged((user) => {
      this.user = user;
      if(user)
        this.storage = firebase.storage().ref(user.uid)
    })
  }

  subs() {
    return [{
      subKey: base,
      asList: true,
      path: base
    }]
  }

  @action
  add(text, url) {
    let post = { text: text, created: Date.now(), user: this.user.uid, url: url}
//we push an empty post under our post gotten back unique key related to it
    let key = this.fb.child(base).push().key
    // firebase updates to multiple place at the same time
    let updates = {}
    updates['/' + base + '/' + key] = post
    updates['/' + this.user.uid + '/history/' + key] = true
    this.fb.update(updates)
  }
 // the purpose of the action method below is to post our
 // image to firebase storage and then get its url back.
  @action
  postImage(img, cb) {
    let uri = RNFetchBlob.wrap(img.path)
    Blob.build(uri, {type: img.type})
      .then((blob) => {
        this.storage
          .child(img.fileName)
          .put(blob, {contentType: img.type})
            .then((snap) => {
              cb(snap)
              blob.close()
            }, (err) => {console.log('err', err)}).catch((err) => {console.log('catch', err)})
      })
  }
  // that will get the url to download this image
  getImage(location) {
    return this.storage.child(location).getDownloadURL()
  }
}
