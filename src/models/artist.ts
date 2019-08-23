import * as firebase from 'firebase/app';
import 'firebase/firestore';
import * as D from '@mojotech/json-type-validation';

import {request, Method} from 'api';

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
    readonly arts: Art[],
  ) {}

  getArt(title: string): Art | undefined {
    return this.arts.find(art => art.title === title);
  }
}

export class Art {
  constructor(
    readonly id: string,
    readonly title: string,
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
  return Promise.all([
    fetchSumbnailUrlOfArtist(id),
    fetchArtsOfArtist(id),
  ]).then(
    ([url, arts]) =>
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
        arts,
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
        return null;
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
  return fetchSumbnailUrlOfArt(artistUid, id).then(
    url =>
      new Art(
        id,
        art.title,
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

/*
 * ===============
 * Create Art
 * ===============
 */
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

/*
 * ===============
 * Update Art
 * ===============
 */
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

/*
 * =================
 * Buy Art
 * =================
 */
declare const Stripe: any;

// - パブリックキーやAPIエンドポイントが誤った値に変更されると危険
// - これらの値は頻繁に更新されない
// - 外部に晒しても問題ない
// 以上の理由から、これらの値はハードコーディングする
const [stripePubKey, createSessionUrl] = (() => {
  const apiBaseUrl =
    'https://us-central1-artell-portfolio.cloudfunctions.net/stripe';
  const env = process.env.NODE_ENV;
  if (env === 'development' || env === 'test') {
    return ['pk_test_ofrOScu6Vyu1aKzd35untuIj', `${apiBaseUrl}/test/session`];
  } else if (env === 'production') {
    return ['pk_live_Iu2DCSkAphvtpDWy2SvMlqUQ', `${apiBaseUrl}/session`];
  } else {
    throw new Error(`Unexpected NODE_ENV : ${env}`);
  }
})();

const stripe = Stripe(stripePubKey);

export function buyArt(artistUid: string, artId: string): Promise<void> {
  return request({
    method: Method.POST,
    url: createSessionUrl,
    body: {
      artistUid,
      artId,
    },
    decoder: BuyArtDecoder,
  })
    .then(sessionId =>
      stripe.redirectToCheckout({
        sessionId,
      }),
    )
    .then(res => console.log(res));
}

const BuyArtDecoder: D.Decoder<string> = D.object({
  id: D.string(),
}).map(({id}) => id);
