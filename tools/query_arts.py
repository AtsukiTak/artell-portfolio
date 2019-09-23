import firebase_admin
from firebase_admin import firestore
from firebase_admin import credentials

cert_path = "./adminsdk-credential.json"

cred = credentials.Certificate(cert_path)
firebase_admin.initialize_app(cred)

client = firestore.client()
docs = client.collection_group('arts').stream()

for doc in docs:
    doc.reference.update({
        'salesPriceYen': doc.get("priceYen"),
        'rentalPriceYen': 4980,
        'priceYen': firestore.DELETE_FIELD,
    })
