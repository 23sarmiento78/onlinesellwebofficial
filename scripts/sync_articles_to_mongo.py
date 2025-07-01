import os
import frontmatter
from pymongo import MongoClient
from glob import glob
from datetime import datetime

# Configuración de MongoDB desde variables de entorno
MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017')
DB_NAME = os.getenv('MONGODB_DB', 'hgaruna')
COLLECTION = os.getenv('MONGODB_COLLECTION', 'articles')

ARTICLES_PATH = os.path.join(os.path.dirname(__file__), '../src/content/articulos/*.md')

client = MongoClient(MONGODB_URI)
db = client[DB_NAME]
collection = db[COLLECTION]

def sync_articles():
    files = glob(ARTICLES_PATH)
    print(f"Encontrados {len(files)} artículos para sincronizar...")
    for file in files:
        post = frontmatter.load(file)
        data = dict(post)
        data['title'] = post.get('title', '')
        data['date'] = post.get('date', datetime.now().isoformat())
        data['author'] = post.get('author', '')
        data['tags'] = post.get('tags', [])
        data['image'] = post.get('image', '')
        data['content'] = post.content
        # Usar el nombre del archivo como slug único
        data['slug'] = os.path.splitext(os.path.basename(file))[0]
        # Insertar o actualizar por slug
        collection.update_one({'slug': data['slug']}, {'$set': data}, upsert=True)
        print(f"Sincronizado: {data['title']} ({data['slug']})")
    print("Sincronización completada.")

if __name__ == "__main__":
    sync_articles()
