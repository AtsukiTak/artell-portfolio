import * as firebase from 'firebase/app';
import 'firebase/firestore';
import * as D from '@mojotech/json-type-validation';

export interface Artist {
  uid: string;
  name: string;
  email: string;
  sumbnailUrl: string;
  comment: string;
  description: string;
  twitter: string;
  facebook: string;
  instagram: string;
}

export interface Art {
  id: string;
  title: string;
  artistUid: string;
  sumbnailUrl: string;
  widthMM: number;
  heightMM: number;
  description: string;
  materials: string;
  priceYen: number;
}

interface StoredArtist {
  name: string;
  email: string;
  comment: string;
  description: string;
  twitter: string;
  facebook: string;
  instagram: string;
}

export interface StoredArt {
  title: string;
  widthMM: number;
  heightMM: number;
  description: string;
  materials: string;
  priceYen: number;
}

/*
 * =====================
 * Artist
 * ====================
 */

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

export function fetchArtistByName(name: string): Promise<Artist | null> {
  return firebase
    .firestore()
    .collection('artists')
    .where('name', '==', name)
    .limit(1)
    .get()
    .then(snapshot => {
      if (snapshot.docs.length === 1) {
        return constructArtist(snapshot.docs[0]);
      } else {
        throw new Error('Artist not found');
      }
    });
}

function constructArtist(
  doc: firebase.firestore.DocumentSnapshot,
): Promise<Artist | null> {
  const data = doc.data();
  if (data === undefined) {
    return Promise.resolve(null);
  }
  const artist = StoredArtistDecoder.runWithException(data);
  const id = doc.id;
  return fetchSumbnailUrlOfArtist(id).then(url => ({
    uid: id,
    sumbnailUrl: url,
    ...artist,
  }));
}

const StoredArtistDecoder: D.Decoder<StoredArtist> = D.object({
  name: D.string(),
  email: D.string(),
  comment: D.string(),
  description: D.string(),
  twitter: D.string(),
  facebook: D.string(),
  instagram: D.string(),
});

function fetchSumbnailUrlOfArtist(artistUid: string): Promise<string> {
  return firebase
    .storage()
    .ref(`artists/${artistUid}/sumbnail.jpg`)
    .getDownloadURL()
    .then(url => url as string, fetchDefaultSumbnailUrlOfArtist);
}

function fetchDefaultSumbnailUrlOfArtist(): Promise<string> {
  return firebase
    .storage()
    .ref(`artists/default/sumbnail.jpg`)
    .getDownloadURL()
    .then(url => url as string);
}

export function createArtist(fbuser: firebase.User): Promise<void> {
  const name = fbuser.displayName;
  const email = fbuser.email;
  if (name === null || email === null) {
    return Promise.reject(new Error('name or email is missing'));
  }
  return firebase
    .firestore()
    .collection('artists')
    .doc(fbuser.uid)
    .set({
      name: name,
      email: email,
      comment: '',
      description: '',
      twitter: '',
      facebook: '',
      instagram: '',
    });
}

export function updateArtist(
  fbuser: firebase.User,
  artist: StoredArtist,
): Promise<void> {
  return firebase
    .firestore()
    .collection('artists')
    .doc(fbuser.uid)
    .set(artist);
}

export function updateArtistSumbnail(
  fbUser: firebase.User,
  base64: string,
): Promise<void> {
  return firebase
    .storage()
    .ref(`/artists/${fbUser.uid}/sumbnail.jpg`)
    .putString(base64, 'base64', {contentType: 'image/jpeg'})
    .then();
}

/*
 * =====================
 * Art
 * ====================
 */

export function fetchArtsOfArtist(artistUid: string): Promise<Art[]> {
  return firebase
    .firestore()
    .collection('artists')
    .doc(artistUid)
    .collection('arts')
    .get()
    .then(snapshot =>
      Promise.all(
        snapshot.docs.map(doc =>
          // この場合はconstructArtは常にPromise<Art>を返す
          constructArt(artistUid, doc).then(art => art as Art),
        ),
      ),
    );
}

export function fetchArtByTitle(
  artistUid: string,
  title: string,
): Promise<Art | null> {
  return firebase
    .firestore()
    .collection('artists')
    .doc(artistUid)
    .collection('arts')
    .where('title', '==', title)
    .limit(1)
    .get()
    .then(snapshot => {
      if (snapshot.docs.length === 1) {
        return constructArt(artistUid, snapshot.docs[0]);
      } else {
        throw new Error('Art not found');
      }
    });
}

function constructArt(
  artistUid: string,
  doc: firebase.firestore.DocumentSnapshot,
): Promise<Art | null> {
  const data = doc.data();
  if (data === undefined) {
    return Promise.resolve(null);
  }
  const art = StoredArtDecoder.runWithException(data);
  const id = doc.id;
  return fetchSumbnailUrlOfArt(artistUid, id).then(url => ({
    id: id,
    artistUid: artistUid,
    sumbnailUrl: url,
    ...art,
  }));
}

const StoredArtDecoder = D.object({
  title: D.string(),
  widthMM: D.number(),
  heightMM: D.number(),
  description: D.string(),
  materials: D.string(),
  priceYen: D.number(),
});

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
        throw new Error(`error : ${maybeURL}`);
      }
    });
}

export function createArt(
  fbuser: firebase.User,
  art: StoredArt,
): Promise<string> {
  return firebase
    .firestore()
    .collection('artists')
    .doc(fbuser.uid)
    .collection('arts')
    .add(art)
    .then(doc => doc.id);
}

export function updateArt(
  fbuser: firebase.User,
  artId: string,
  art: StoredArt,
): Promise<void> {
  return firebase
    .firestore()
    .collection('artists')
    .doc(fbuser.uid)
    .collection('arts')
    .doc(artId)
    .set(art);
}

export function updateArtSumbnail(
  fbUser: firebase.User,
  artId: string,
  base64: string,
): Promise<void> {
  return firebase
    .storage()
    .ref(`/artists/${fbUser.uid}/arts/${artId}/sumbnail.jpg`)
    .putString(base64, 'base64', {contentType: 'image/jpeg'})
    .then();
}
