export interface Artist {
  id: string,
  name: string,
  comment: string,
  image_url: string,
  description: string,
}

export function isArtist(obj: object): obj is Artist {
  return ('id' in obj) && ('name' in obj) && ('comment' in obj)
    && ('image_url' in obj) && ('description' in obj);
}

export const artistAtsuki = {
  id: "atsuki_takahashi",
  name: "Atsuki Takahashi",
  comment: "アートのようなコード。コードになれないアート。",
  image_url: "https://firebasestorage.googleapis.com/v0/b/artell-gallery.appspot.com/o/artists%2Fmyself.jpg?alt=media&token=86f76b38-3f9c-40c5-ad4a-36cd0fe29c6c",
  description: "東京工業大学卒業失敗野郎。Rustacean。",
};

export const artistYuzuka = {
  id: "yuzuka_nakata",
  name: "Yuzuka Nakata",
  comment: "12人の友達",
  image_url: "https://firebasestorage.googleapis.com/v0/b/artell-gallery.appspot.com/o/artists%2Fartist1.png?alt=media&token=10ccc042-974a-4379-8e45-3caec7ab9720",
  description: "木曾路はすべて山の中である。あるところは岨づたいに行く崖の道であり、あるところは数十間の深さに臨む木曾川の岸であり、あるところは山の尾をめぐる谷の入り口である。一筋の街道はこの深い森林地帯を貫いていた。東ざかいの桜沢から、西の十曲峠まで、木曾十一宿はこの街道に添うて、二十二里余にわたる長い谿谷の間に散在していた。道路の位置も幾たびか改まったもので、古道はいつのまにか深い山間に埋もれた。名高い桟も"
};
