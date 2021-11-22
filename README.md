ARTELL Portfolio
===

https://portfolio.artell.life

## Start Development Server

`yarn dev`

## Environment Variables

`npx vercel env pull` で開発環境用の環境変数をvercelから取得し、 .env ファイルに反映させることができる。

- STRIPE_SK : stripeのシークレットキー
- NEXT_PUBLIC_STRIPE_PK : stripeのパブリックキー
- NEXT_PUBLIC_FIREBASE_ENV : "staging" | "production"
- FIREBASE_PROJECT_ID : firebase admin sdk の初期化に必要な情報
- FIREBASE_CLIENT_EMAIL : firebase admin sdk の初期化に必要な情報
- FIREBASE_PRIVATE_KEY : firebase admin sdk の初期化に必要な情報


## Firebase Storage CORS

- cors.jsonを編集
- gsutil cors set cors.json gs://artell-portfolio.appspot.com/
