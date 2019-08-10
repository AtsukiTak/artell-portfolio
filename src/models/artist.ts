import * as firebase from 'firebase/app';
import 'firebase/firestore';
import * as D from '@mojotech/json-type-validation';

export class Artist {
  constructor(
    readonly uid: string,
    readonly name: string,
    readonly email: string,
    readonly sumbnailUrl: string,
    readonly comment: string,
    readonly description: string,
    readonly twitter: string,
    readonly facebook: string,
    readonly instagram: string,
  ) {}
}

export class Art {
  constructor(
    readonly id: string,
    readonly title: string,
    readonly artist: Artist,
    readonly sumbnailUrl: string,
    readonly widthMM: number,
    readonly heightMM: number,
    readonly description: string,
    readonly materials: string,
    readonly priceYen: number,
  ) {}
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
 * Get Artist
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
        return null;
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
  return fetchSumbnailUrlOfArtist(id).then(
    url =>
      new Artist(
        id,
        artist.name,
        artist.email,
        url,
        artist.comment,
        artist.description,
        artist.twitter,
        artist.facebook,
        artist.instagram,
      ),
  );
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
  return fetchStorageImageUrl(`artists/${artistUid}/sumbnail.jpg`);
}

function fetchDefaultSumbnailUrlOfArtist(): Promise<string> {
  return fetchStorageImageUrl('artists/default/sumbnail.jpg');
}

function fetchStorageImageUrl(storageRef: string): Promise<string> {
  return firebase
    .storage()
    .ref(storageRef)
    .getDownloadURL()
    .catch(fetchDefaultSumbnailUrlOfArtist);
}

/*
 * ==============
 * Create Artist
 * ==============
 */
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

/*
 * =============
 * Update Artist
 * =============
 */
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
 * Get Art
 * ====================
 */
export function fetchArtsOfArtist(artist: Artist): Promise<Art[]> {
  return firebase
    .firestore()
    .collection('artists')
    .doc(artist.uid)
    .collection('arts')
    .get()
    .then(snapshot =>
      Promise.all(
        snapshot.docs.map(doc =>
          // この場合はconstructArtは常にPromise<Art>を返す
          constructArt(artist, doc).then(art => art as Art),
        ),
      ),
    );
}

export function fetchArtByTitle(
  artist: Artist,
  title: string,
): Promise<Art | null> {
  return firebase
    .firestore()
    .collection('artists')
    .doc(artist.uid)
    .collection('arts')
    .where('title', '==', title)
    .limit(1)
    .get()
    .then(snapshot => {
      if (snapshot.docs.length === 1) {
        return constructArt(artist, snapshot.docs[0]);
      } else {
        return null;
      }
    });
}

function constructArt(
  artist: Artist,
  doc: firebase.firestore.DocumentSnapshot,
): Promise<Art | null> {
  const data = doc.data();
  if (data === undefined) {
    return Promise.resolve(null);
  }
  const art = StoredArtDecoder.runWithException(data);
  const id = doc.id;
  return fetchSumbnailUrlOfArt(artist.uid, id).then(
    url =>
      new Art(
        id,
        art.title,
        artist,
        url,
        art.widthMM,
        art.heightMM,
        art.description,
        art.materials,
        art.priceYen,
      ),
  );
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
    .getDownloadURL();
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
