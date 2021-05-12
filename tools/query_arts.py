import firebase_admin
from firebase_admin import firestore
from firebase_admin import credentials

cert_path = "./adminsdk-credential.json"

cred = credentials.Certificate(cert_path)
firebase_admin.initialize_app(cred)

client = firestore.client()
docs = client.collection_group('arts').stream()

for doc_snapshot in docs:
    id = doc_snapshot.id
