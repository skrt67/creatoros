# Configuration de l'Upload et du Traitement de Vidéos

## 📋 Vue d'ensemble

Vidova peut maintenant traiter des vidéos uploadées directement (en plus de YouTube) avec le pipeline complet :
- ✅ Upload de fichiers vidéo (MP4, MOV, AVI, WebM, MPEG)
- ✅ Extraction automatique de l'audio (FFmpeg)
- ✅ Transcription avec AssemblyAI
- ✅ Génération de contenu avec Gemini AI
- ✅ Suggestions de clips viraux

## 🔧 Dépendances requises

### 1. FFmpeg (pour extraction audio)

**Installation sur le serveur de production :**

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install ffmpeg -y

# macOS
brew install ffmpeg

# Vérifier l'installation
ffmpeg -version
```

### 2. Variables d'environnement

Assure-toi que ces variables sont configurées :

```bash
ASSEMBLYAI_API_KEY=your_assemblyai_key
GEMINI_API_KEY=your_gemini_key  # Optionnel mais recommandé
```

## 📁 Structure de fichiers

```
backend/
├── uploads/              ← Vidéos uploadées (ignoré par git)
│   ├── {uuid}.mp4       
│   ├── {uuid}.mov       
│   └── ...
├── temp/                 ← Fichiers audio temporaires (auto-nettoyés)
│   ├── {uuid}.mp3
│   └── ...
└── app/
    └── routes/
        └── videos.py     ← Route d'upload + traitement
```

## 🚀 Workflow de traitement

1. **Upload** : Fichier vidéo uploadé → sauvegardé dans `uploads/`
2. **Validation** : Type de fichier et quotas utilisateur vérifiés
3. **Extraction audio** : FFmpeg extrait l'audio en MP3
4. **Transcription** : AssemblyAI transcrit l'audio
5. **Génération** : Gemini génère blog, Twitter, LinkedIn, TikTok
6. **Clips** : Suggestions de clips viraux créées
7. **Nettoyage** : Fichier audio temporaire supprimé

## 🔒 Sécurité

- ✅ Validation des types de fichiers autorisés
- ✅ Noms de fichiers uniques (UUID) pour éviter les collisions
- ✅ Vérification de l'ownership du workspace
- ✅ Respect des limites d'usage (FREE: 3/mois, PRO: illimité)
- ✅ Nettoyage automatique en cas d'erreur

## 📊 Formats supportés

**Vidéo :**
- MP4 (video/mp4)
- MOV (video/quicktime)
- AVI (video/x-msvideo)
- WebM (video/webm)
- MPEG (video/mpeg)

**Sortie audio :**
- MP3 (libmp3lame, qualité 2)

## ⚠️ Notes importantes

1. **FFmpeg requis** : Sans FFmpeg, le système tentera d'utiliser le fichier vidéo directement (moins fiable)
2. **Espace disque** : Les vidéos uploadées sont stockées localement, surveiller l'espace disque
3. **Cleanup** : Implémenter un job de nettoyage périodique pour les anciens fichiers
4. **Production** : Considérer un stockage cloud (S3, GCS) pour la scalabilité

## 🔄 Redéploiement

Après avoir pushé ces changements :

1. **Installer FFmpeg sur le serveur**
2. **Redéployer le backend** (Railway/Render)
3. **Vérifier les variables d'env**
4. **Tester avec un fichier**

## 📝 Logs de débogage

Surveiller ces logs lors du traitement :

```
🎬 Starting processing for uploaded video: {filename}
🎵 Extracting audio to: {audio_path}
✅ Audio extracted successfully
📝 Transcribing audio with AssemblyAI...
✅ Transcription completed: {X} characters
🤖 Generating content with Gemini...
✂️ Generating viral clip suggestions...
✅ Uploaded video {filename} processed successfully
```

## 🆘 Troubleshooting

**Erreur "FFmpeg not found"**
→ Installer FFmpeg sur le serveur

**Erreur "AssemblyAI API key not configured"**
→ Vérifier la variable d'environnement `ASSEMBLYAI_API_KEY`

**Erreur "Transcription failed"**
→ Vérifier le format audio/vidéo et les crédits AssemblyAI

**Erreur "CORS policy"**
→ Backend pas déployé ou CORS mal configuré
