#!/usr/bin/env python3
"""
Test script pour vérifier que Google Gemini fonctionne
"""
import asyncio
import os
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

async def test_gemini():
    """Test de base de Gemini."""
    
    print("🧪 Test de Google Gemini API\n")
    print("=" * 50)
    
    # Importer le service
    from app.services.gemini_service import GeminiService
    
    # Initialiser
    gemini = GeminiService()
    
    # Vérifier si l'API key est configurée
    if not gemini.api_key:
        print("❌ ERREUR : GOOGLE_GEMINI_API_KEY non trouvée dans .env")
        return
    
    print(f"✅ API Key trouvée : {gemini.api_key[:20]}...")
    
    if not gemini.model:
        print("❌ ERREUR : Le modèle Gemini n'a pas pu être initialisé")
        return
    
    print("✅ Modèle Gemini initialisé avec succès\n")
    
    # Test de transcription
    test_transcript = """
    Bienvenue dans cette vidéo où je vais vous expliquer comment utiliser l'intelligence artificielle 
    pour transformer votre contenu vidéo en articles de blog, posts sur les réseaux sociaux, et bien plus encore. 
    C'est une technique puissante qui va vous faire gagner énormément de temps dans votre stratégie de content marketing.
    
    La première chose à comprendre, c'est que le contenu vidéo est extrêmement riche en information, 
    et avec les bons outils, vous pouvez le réutiliser de multiples façons pour maximiser votre portée.
    """
    
    video_title = "Comment l'IA transforme votre contenu vidéo en machine à contenus"
    
    print("📝 Génération d'un résumé...\n")
    
    try:
        # Tester la génération de résumé
        result = await gemini.generate_video_summary(test_transcript, video_title)
        
        print("✅ SUCCÈS ! Contenu généré :\n")
        print("-" * 50)
        print(result['content'][:500] + "...")
        print("-" * 50)
        print(f"\n📊 Service utilisé : {result['service']}")
        print(f"📊 Nombre de mots : {result.get('word_count', 'N/A')}")
        print(f"📊 Statut : {result['status']}")
        
        print("\n🎉 Test réussi ! Gemini fonctionne correctement !")
        
    except Exception as e:
        print(f"❌ ERREUR lors de la génération : {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_gemini())
