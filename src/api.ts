import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { Artist } from './models/artist';
import { Art } from './models/art';

export function getArtists(): Promise<Artist[]> {
  return firebase
    .firestore()
    .collection("artists")
    .get()
    .then(snapshot => snapshot.docs.map(doc => doc.data() as Artist));
}

export function getArtist(id: string): Promise<Artist> {
  return firebase
    .firestore()
    .collection("artists")
    .doc(id)
    .get()
    .then(snapshot => snapshot.data() as Artist);
}

export function getArt(id: string): Promise<Art> {
  return firebase
    .firestore()
    .collection("arts")
    .doc(id)
    .get()
    .then(snapshot => snapshot.data() as Art);
}

export function getArtsOf(artistId: string): Promise<Art[]> {
  return firebase
    .firestore()
    .collection("arts")
    .where("artist", "==", artistId)
    .get()
    .then(snapshot => snapshot.docs.map(doc => doc.data() as Art));
}
