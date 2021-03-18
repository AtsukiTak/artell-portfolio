ARTELL Portfolio
===

https://portfolio.artell.life

## Start Development Server

`yarn dev`

## Environment Variables

- STRIPE_SK : stripeのシークレットキー
- NEXT_PUBLIC_STRIPE_PK : stripeのパブリックキー
- SERVICE_ACCOUNT_JSON : serviceAccountKey.json


## Firebase Storage CORS

- cors.jsonを編集
- gsutil cors set cors.json gs://artell-portfolio.appspot.com/
