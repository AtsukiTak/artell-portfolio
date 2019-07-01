import * as firebase from 'firebase/app';
import 'firebase/firestore';

export interface Artist {
  uid: string;
  displayId: string;
  name: string;
  comment: string;
  sumbnailUrl: string;
  description: string;
}

export interface Art {
  id: string;
  title: string;
  artistUid: string;
  sumbnailUrl: string;
  description: string;
}

interface StoredArtist {
  displayId: string;
  name: string;
  comment: string;
  description: string;
}

export interface StoredArt {
  title: string;
  description: string;
}

// TODO : Pagenation
export function fetchArtists(): Promise<Artist[]> {
  return firebase
    .firestore()
    .collection('artists')
    .get()
    .then(snapshot =>
      Promise.all(
        snapshot.docs.map(doc =>
          // この場合はconstructArtistは常にPromise<Artist>を返す
          constructArtist(doc).then(artist => artist as Artist),
        ),
      ),
    );
}

export function fetchArtist(uid: string): Promise<Artist | null> {
  return firebase
    .firestore()
    .collection('artists')
    .doc(uid)
    .get()
    .then(doc => constructArtist(doc));
}

export function fetchArtistByDisplayId(
  displayId: string,
): Promise<Artist | null> {
  return firebase
    .firestore()
    .collection('artists')
    .where('displayId', '==', displayId)
    .limit(1)
    .get()
    .then(snapshot => {
      if (snapshot.docs.length === 1) {
        return constructArtist(snapshot.docs[0]);
      } else {
        throw 'Artist not found';
      }
    });
}

function constructArtist(
  doc: firebase.firestore.DocumentSnapshot,
): Promise<Artist | null> {
  if (doc.exists) {
    const artist = doc.data() as StoredArtist;
    const id = doc.id;
    return fetchSumbnailUrlOfArtist(id).then(url => ({
      uid: id,
      sumbnailUrl: url,
      ...artist,
    }));
  } else {
    return Promise.resolve(null);
  }
}

function fetchSumbnailUrlOfArtist(artistUid: string): Promise<string> {
  return firebase
    .storage()
    .ref(`artists/${artistUid}/sumbnail.jpg`)
    .getDownloadURL()
    .then(maybeURL => {
      if (typeof maybeURL === 'string') {
        return maybeURL;
      } else {
        throw `error : ${maybeURL}`;
      }
    });
}

export function fetchArtsOfArtist(artistUid: string): Promise<Art[]> {
  return firebase
    .firestore()
    .collection('artists')
    .doc(artistUid)
    .collection('arts')
    .get()
    .then(snapshot =>
      Promise.all(snapshot.docs.map(doc => constructArt(artistUid, doc))),
    );
}

export function fetchArt(artistUid: string, id: string): Promise<Art> {
  return firebase
    .firestore()
    .collection('artists')
    .doc(artistUid)
    .collection('arts')
    .doc(id)
    .get()
    .then(doc => constructArt(artistUid, doc));
}

function constructArt(
  artistUid: string,
  doc: firebase.firestore.DocumentSnapshot,
): Promise<Art> {
  if (doc.exists) {
    const art = doc.data() as StoredArt;
    const id = doc.id;
    return fetchSumbnailUrlOfArt(artistUid, id).then(url => ({
      id: id,
      artistUid: artistUid,
      sumbnailUrl: url,
      ...art,
    }));
  } else {
    throw 'Art not found';
  }
}

function fetchSumbnailUrlOfArt(
  artistUid: string,
  artId: string,
): Promise<string> {
  return firebase
    .storage()
    .ref(`artists/${artistUid}/arts/${artId}/sumbnail.jpg`)
    .getDownloadURL()
    .then(maybeURL => {
      if (typeof maybeURL === 'string') {
        return maybeURL;
      } else {
        throw `error : ${maybeURL}`;
      }
    });
}
