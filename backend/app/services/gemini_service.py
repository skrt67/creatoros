"""
Google Gemini AI Service for content generation - IMPROVED VERSION
Expert-level prompts for natural, engaging, and valuable content
"""
import os
import logging
from typing import Dict, List, Any, Optional
import google.generativeai as genai

logger = logging.getLogger(__name__)

class GeminiService:
    """Service for generating high-quality content using Google Gemini AI."""
    
    # System prompt universel pour toutes les générations
    SYSTEM_CONTEXT = """Tu es un expert en création de contenu digital, spécialisé dans les plateformes Blog, Twitter (X) et LinkedIn.
Ton rôle est de rédiger des textes impactants, authentiques et adaptés à chaque plateforme, en respectant leurs codes, tons et formats spécifiques.

🎯 Objectif :
Créer du contenu captivant, fluide et utile, qui attire l'attention, partage de la valeur et incite à interagir (likes, commentaires, partages, clics).

🧠 Ta méthode :
- Analyse d'abord la demande : le sujet, le ton souhaité, le public visé, et la plateforme cible.
- Adapte ton style selon la plateforme :
  📝 Blog : style fluide, structuré, avec sous-titres (H2/H3), storytelling, mots-clés naturels pour le SEO, phrases engageantes et lisibles.
  🐦 Twitter : style concis, percutant, 1 idée = 1 tweet. Utilise des hooks forts, de l'émotion ou des punchlines. Évite le ton robotique. Peut inclure des threads logiques (1/).
  💼 LinkedIn : ton professionnel, humain et inspirant. Structure en paragraphes courts (1 à 3 lignes), avec une accroche forte, une idée centrale claire et une conclusion engageante (CTA ou question).
- Fais preuve de profondeur et d'authenticité : raconte une idée, une expérience ou une leçon.
- Sois naturel et précis : évite les phrases creuses comme "de nos jours" ou "il est important de noter que".
- Optimise la lisibilité et le rythme : phrases courtes, transitions fluides, mots simples mais percutants.
- Ajoute de la valeur : conseils concrets, anecdotes, chiffres ou réflexions.
- Si tu génères plusieurs formats (blog + Twitter + LinkedIn), adapte chaque version au ton et à la longueur optimale.

💬 Exemple de structure attendue :
Pour un blog : Introduction → Développement clair en 2-3 parties → Conclusion/Call-to-action
Pour Twitter : Hook percutant → développement court en thread → punchline finale
Pour LinkedIn : Phrase d'ouverture forte → 3-4 paragraphes à valeur ajoutée → question ou conclusion engageante

⚙️ Instructions finales :
- Rends chaque texte vivant, humain et crédible.
- Sois créatif et sincère, pas automatique.
- Vérifie toujours la cohérence du ton, la clarté du message et la qualité de l'écriture.
- Si pertinent, propose une idée de visuel ou d'accroche pour accompagner le post."""
    
    def __init__(self, api_key: Optional[str] = None):
        """Initialize Gemini service with improved configuration."""
        self.api_key = api_key or os.getenv("GOOGLE_GEMINI_API_KEY")
        
        if not self.api_key:
            logger.warning("No Gemini API key found. Content generation will be limited.")
            self.model = None
        else:
            genai.configure(api_key=self.api_key)
            # Configuration optimale pour la qualité
            generation_config = {
                "temperature": 0.9,  # Plus créatif
                "top_p": 0.95,
                "top_k": 40,
                "max_output_tokens": 8192,
            }
            self.model = genai.GenerativeModel(
                'gemini-2.0-flash',
                generation_config=generation_config
            )
            logger.info("Gemini service initialized with improved prompts")
    
    async def generate_blog_post(self, transcript: str, video_title: str) -> Dict[str, Any]:
        """
        Generate a professional, engaging blog post from video transcript.
        Optimized for SEO, readability, and value delivery.
        """
        if not self.model:
            return self._generate_demo_content("blog_post", transcript, video_title)
        
        prompt = f"""{self.SYSTEM_CONTEXT}

CONTEXTE :
Tu dois transformer cette transcription vidéo en un article de blog exceptionnel qui :
- Capte l'attention dès la première ligne
- Apporte une réelle valeur au lecteur
- Est structuré de manière logique et fluide
- Sonne naturel et humain, pas généré par IA
- Est optimisé SEO sans paraître forcé

TITRE DE LA VIDÉO : {video_title}

TRANSCRIPTION :
{transcript[:4500]}

INSTRUCTIONS SPÉCIFIQUES :

1. TITRE (max 60 caractères)
   - Accrocheur et précis
   - Contient le mot-clé principal
   - Promet une valeur claire
   - Exemple : "3 erreurs qui sabotent votre productivité (et comment les éviter)"

2. INTRODUCTION (100-150 mots)
   - Commence par un fait surprenant, une question provocante ou une anecdote personnelle
   - Présente le problème ou l'opportunité
   - Annonce la solution sans tout révéler
   - Crée l'envie de lire la suite

3. CORPS DE L'ARTICLE (700-1000 mots)
   - 3 à 5 sections avec sous-titres H2 descriptifs
   - Chaque section apporte un insight concret
   - Utilise des exemples réels, des chiffres, des études
   - Alterne entre explication et storytelling
   - Ajoute des listes à puces pour la lisibilité
   - Inclut des transitions fluides entre sections

4. POINTS CLÉS À RETENIR (3-5 bullets)
   - Synthétise les enseignements principaux
   - Format actionnable

5. CONCLUSION (100-150 mots)
   - Résume la transformation possible
   - Appel à l'action clair et motivant
   - Termine sur une note inspirante ou une question qui fait réfléchir

STYLE :
- Tutoyez le lecteur pour créer proximité
- Phrases de longueur variable (mix court/moyen pour rythme)
- Vocabulaire riche mais accessible
- Exemples concrets et relatable
- Zéro jargon inutile

IMPORTANT : GÉNÈRE UNIQUEMENT LE CONTENU FINAL.
Ne dis PAS "Voici l'article" ou "Absolument, voici..."
Ne parle PAS à l'utilisateur.
GÉNÈRE DIRECTEMENT LE TITRE, puis l'article, sans préambule."""

        try:
            response = self.model.generate_content(prompt)
            content = response.text
            
            return {
                "type": "blog_post",
                "content": content,
                "word_count": len(content.split()),
                "status": "generated",
                "service": "gemini",
                "quality": "premium"
            }
        except Exception as e:
            logger.error(f"Gemini blog post generation failed: {str(e)}")
            return self._generate_demo_content("blog_post", transcript, video_title)
    
    async def generate_twitter_thread(self, transcript: str, video_title: str) -> Dict[str, Any]:
        """Generate a viral-worthy Twitter thread."""
        if not self.model:
            return self._generate_demo_content("twitter_thread", transcript, video_title)
        
        prompt = f"""{self.SYSTEM_CONTEXT}

MISSION : Créer un thread Twitter COURT et PERCUTANT (5-7 tweets MAX)

ANALYSE D'ABORD CES EXEMPLES DE THREADS VIRAUX :

Exemple 1 (Business - 6 tweets) :
1/6 : J'ai passé 10 ans à étudier les meilleurs copywriters. Voici les 4 formules qu'ils utilisent tous 🧵
2/6 : AIDA (Attention, Intérêt, Désir, Action). La plus connue, la plus efficace.
3/6 : PAS (Problème, Agitation, Solution). Tu touches le point de douleur, tu amplifies, tu résous.
4/6 : BAB (Before, After, Bridge). Tu montres le avant/après, puis comment y arriver.
5/6 : 4P (Picture, Promise, Prove, Push). Tu peins l'image, tu promets, tu prouves, tu pousses à l'action.
6/6 : Choisis UNE formule. Maîtrise-la. Les résultats suivront. RT si utile 🔄

Exemple 2 (Tech - 5 tweets) :
1/5 : ChatGPT vient de tout changer. Voici 3 prompts que 99% des gens ne connaissent pas 🧵
2/5 : "Agis comme [expert]. Analyse [sujet]. Donne 3 insights contre-intuitifs." = Or pur.
3/5 : "Explique [concept] à un enfant de 5 ans, puis à un expert." = Clarté maximale.
4/5 : "Liste 10 questions que personne ne pose sur [sujet]." = Angles uniques garantis.
5/5 : Sauvegarde ce thread. Tu me remercieras dans 6 mois. Partage si ça aide 🚀

TITRE VIDÉO : {video_title}
TRANSCRIPTION : {transcript[:2000]}

STRUCTURE DU THREAD (5-7 tweets MAXIMUM) :

Tweet 1 (HOOK) :
- 1 phrase choc, affirmation provocante ou question
- Promet une valeur claire en 1 ligne
- Exemple : "Vous faites cette erreur sur Twitter. Voici comment la corriger 🧵"

Tweets 2-5 (CONTENU - 3 à 4 tweets SEULEMENT) :
- 1 idée = 1 tweet
- Maximum 2 lignes par tweet
- 1 emoji par tweet max
- Phrases ultra-courtes
- Aller à l'essentiel, PAS de blabla

Tweet Final (CTA) :
- 1 phrase de conclusion
- 1 appel à l'action simple
- Exemple : "RT si ça t'a aidé 🔄"

RÈGLES STRICTES :
- MAXIMUM 7 tweets au total
- Chaque tweet = 280 caractères MAX
- Phrases de 10-15 mots maximum
- Numérotation (1/6, 2/6, etc.)
- Supprimer tout ce qui n'est pas essentiel
- Aller DROIT AU BUT

IMPORTANT : GÉNÈRE UNIQUEMENT LES TWEETS.
Ne dis PAS "Voici le thread" ou "Absolument".
Ne parle PAS à l'utilisateur.
COMMENCE DIRECTEMENT par "1/X :" sans préambule."""

        try:
            response = self.model.generate_content(prompt)
            content = response.text
            
            return {
                "type": "twitter_thread",
                "content": content,
                "tweet_count": len([t for t in content.split('\n') if t.strip() and not t.strip().startswith('---')]),
                "status": "generated",
                "service": "gemini",
                "quality": "premium"
            }
        except Exception as e:
            logger.error(f"Gemini Twitter thread generation failed: {str(e)}")
            return self._generate_demo_content("twitter_thread", transcript, video_title)
    
    async def generate_linkedin_post(self, transcript: str, video_title: str) -> Dict[str, Any]:
        """Generate a thought-leadership LinkedIn post."""
        if not self.model:
            return self._generate_demo_content("linkedin_post", transcript, video_title)
        
        prompt = f"""{self.SYSTEM_CONTEXT}

OBJECTIF : Créer un post LinkedIn qui positionne comme expert et génère des interactions

VIDÉO : {video_title}
TRANSCRIPTION : {transcript[:3500]}

STRUCTURE DU POST (250-350 mots) :

1. HOOK (2-3 lignes)
   - Commence par une observation contre-intuitive ou une mini-histoire
   - Crée la connexion émotionnelle immédiate
   - Exemple : "Hier, j'ai vu un CEO refuser une augmentation de 30%. Voici pourquoi c'était la meilleure décision de sa carrière..."

2. CONTEXTE (1 paragraphe)
   - Pose le problème ou l'opportunité
   - Rend le sujet relatable pour ton audience
   - Utilise "nous" pour inclure

3. INSIGHTS PRINCIPAUX (3-4 points)
   - Chaque point = 1-2 lignes
   - Mix de principe + exemple concret
   - Utilise des emojis subtils (📌 ✅ 💡)
   - Espacé avec des sauts de ligne pour lisibilité

4. LEÇON PERSONNELLE (1 paragraphe)
   - Ce que TU as appris
   - Vulnérabilité ou échec transformé
   - Rend humain et authentique

5. CALL TO ACTION
   - Question ouverte pour générer commentaires
   - Invite au partage si pertinent
   - Ton = curieux, pas vendeur

6. HASHTAGS (6-8 max)
   - Mix de larges (#Leadership) et niche (#B2BSales)
   - À la fin, après ligne vide

STYLE LINKEDIN :
- Professionnel MAIS conversationnel
- Storytelling > théorie
- Authentique et vulnérable
- Sauts de ligne généreux
- Exemples chiffrés si possible
- Tone = "collegue qui partage" pas "prof qui enseigne"

IMPORTANT : GÉNÈRE UNIQUEMENT LE POST FINAL.
Ne dis PAS "Voici le post" ou "Voilà".
Ne parle PAS à l'utilisateur.
COMMENCE DIRECTEMENT par le hook du post, sans préambule."""

        try:
            response = self.model.generate_content(prompt)
            content = response.text
            
            return {
                "type": "linkedin_post",
                "content": content,
                "word_count": len(content.split()),
                "status": "generated",
                "service": "gemini",
                "quality": "premium"
            }
        except Exception as e:
            logger.error(f"Gemini LinkedIn post generation failed: {str(e)}")
            return self._generate_demo_content("linkedin_post", transcript, video_title)
    
    async def generate_tiktok(self, transcript: str, video_title: str) -> Dict[str, Any]:
        """Generate a viral TikTok script."""
        if not self.model:
            return self._generate_demo_content("tiktok", transcript, video_title)
        
        prompt = f"""{self.SYSTEM_CONTEXT}

MISSION : Créer un script TikTok viral qui capte l'attention en 3 secondes et retient jusqu'à la fin

ANALYSE D'ABORD CES EXEMPLES DE SCRIPTS TIKTOK VIRAUX :

Exemple 1 (Business - 45 secondes) :
[HOOK - 0:00-0:03] STOP ! Tu perds de l'argent chaque jour sans le savoir.
[PROMISE - 0:03-0:08] Je vais te montrer les 3 erreurs qui coûtent cher.
[POINT 1 - 0:08-0:18] Erreur #1 : Tu ne factures pas ton temps. [pause] Chaque heure = 50€ minimum.
[transition] Mais c'est pas tout...
[POINT 2 - 0:18-0:28] Erreur #2 : Tu offres trop de services. [pause] Spécialise-toi. Tu factureras 3x plus.
[transition] Et voilà le pire...
[POINT 3 - 0:28-0:38] Erreur #3 : Tu travailles seul. [pause] Délègue ou reste fauché.
[CTA - 0:38-0:45] Commente "argent" pour la Part 2. Et sauvegarde ce TikTok maintenant.

Exemple 2 (Tech - 30 secondes) :
[HOOK - 0:00-0:03] Personne te dit ça sur ChatGPT...
[PROMISE - 0:03-0:06] Mais ce prompt change TOUT.
[CONTENU - 0:06-0:24]
[texte à l'écran : "Le Prompt"]
"Agis comme un expert. Trouve 10 erreurs dans mon texte. Classe-les par gravité."
[pause]
Simple. Puissant. Efficace.
[CTA - 0:24-0:30] Essaie maintenant. Puis reviens me dire merci en commentaire 🚀

SUJET : {video_title}
CONTENU SOURCE : {transcript[:4000]}

STRUCTURE (durée vidéo : 30-60 secondes) :

1. HOOK (3 premières secondes) - CRITIQUE !
   - Phrase choc, question intrigante, ou affirmation surprenante
   - Exemples : "Personne ne parle de ça mais...", "J'ai testé pendant 30 jours et voilà ce qui s'est passé", "Stop ! Ne fais surtout pas ça..."
   - Doit créer un pattern interrupt

2. PROMISE (5 secondes)
   - Annonce rapide de ce qu'ils vont apprendre/découvrir
   - Crée l'anticipation
   - Exemple : "Je vais te montrer les 3 erreurs qui te coûtent cher"

3. CONTENU (30-40 secondes)
   - 3 points maximum, très courts
   - 1 idée = 1 phrase percutante
   - Rythme rapide, pas de blabla
   - Transitions fluides ("Ensuite...", "Mais voilà le truc...", "Et c'est pas fini...")

4. CALL-TO-ACTION (5 secondes)
   - Engagement : "Commente ton avis", "Sauvegarde pour plus tard", "Partage à quelqu'un qui en a besoin"
   - Tease : "Part 2 en commentaire si tu veux la suite"

FORMAT :
- Écris le texte tel qu'il sera DIT (pas lu)
- Indique les moments de pause : [pause]
- Suggère les transitions visuelles : [texte à l'écran : "Point 1"]
- Garde un ton conversationnel, direct, énergique

STYLE TIKTOK :
- Phrase courtes et percutantes
- Langage simple et direct (pas de jargon)
- Émojis OK si pertinent
- Énergie et authenticité > perfection
- Parle comme à un pote

IMPORTANT : GÉNÈRE UNIQUEMENT LE SCRIPT FINAL.
Ne dis PAS "Voici le script" ou "Absolument".
Ne parle PAS à l'utilisateur.
COMMENCE DIRECTEMENT par [HOOK - 0:00-0:03] sans préambule."""

        try:
            response = self.model.generate_content(prompt)
            content = response.text
            
            return {
                "type": "tiktok",
                "content": content,
                "word_count": len(content.split()),
                "status": "generated",
                "service": "gemini",
                "quality": "premium"
            }
        except Exception as e:
            logger.error(f"Gemini TikTok generation failed: {str(e)}")
            return self._generate_demo_content("tiktok", transcript, video_title)
    
    async def generate_instagram_caption(self, transcript: str, video_title: str) -> Dict[str, Any]:
        """Generate an Instagram caption that stops the scroll."""
        if not self.model:
            return self._generate_demo_content("instagram_caption", transcript, video_title)
        
        prompt = f"""{self.SYSTEM_CONTEXT}

DÉFI : Créer une caption Instagram qui arrête le scroll et génère de l'engagement

VIDÉO : {video_title}
TRANSCRIPTION : {transcript[:2500]}

STRUCTURE (180-250 mots) :

1. PREMIÈRE LIGNE (Hook crucial)
   - 5-8 mots MAX
   - Doit intriguer ou provoquer
   - PAS de "Swipe pour voir" ou générique
   - Exemple : "J'ai tout perdu à 30 ans. Voici ce que j'ai appris..."

2. STORYTELLING (3-4 paragraphes courts)
   - Commence par une mini-histoire ou situation
   - Crée connexion émotionnelle
   - Amène naturellement au message
   - Sauts de ligne après chaque phrase/idée

3. VALEUR / INSIGHT (2-3 paragraphes)
   - Leçon principale
   - Conseil actionnable
   - Exemples concrets
   - Format lisible (emojis bullets OK)

4. ENGAGEMENT
   - Question qui invite au commentaire
   - Ou demande de partager expérience
   - Authentique, pas forcé

5. CTA SUBTIL
   - Save si utile
   - Partage à qui ça peut aider
   - Check la bio si pertinent

6. HASHTAGS (15-20)
   - Ligne vide avant
   - Mix : 3 gros (#lifestyle)
   - 7-8 moyens (#entrepreneurlife)  
   - 7-8 petits/niche (#solopreneur2024)
   - Pertinents au contenu

STYLE INSTAGRAM :
- Émojis stratégiques (2-4 max avant hashtags)
- Authentique et vulnérable
- Phrases COURTES
- Sauts ligne généreux
- Ton = Ami proche qui partage
- Pas de caps lock ou ponctuation excessive

GÉNÈRE LA CAPTION COMPLÈTE."""

        try:
            response = self.model.generate_content(prompt)
            content = response.text
            
            return {
                "type": "instagram_caption",
                "content": content,
                "character_count": len(content),
                "status": "generated",
                "service": "gemini",
                "quality": "premium"
            }
        except Exception as e:
            logger.error(f"Gemini Instagram caption generation failed: {str(e)}")
            return self._generate_demo_content("instagram_caption", transcript, video_title)
    
    async def generate_video_summary(self, transcript: str, video_title: str) -> Dict[str, Any]:
        """Generate a compelling video summary."""
        if not self.model:
            return self._generate_demo_content("summary", transcript, video_title)
        
        prompt = f"""{self.SYSTEM_CONTEXT}

OBJECTIF : Créer un résumé qui donne envie de regarder la vidéo complète

VIDÉO : {video_title}
TRANSCRIPTION : {transcript[:3500]}

STRUCTURE (200-300 mots) :

1. PHRASE D'ACCROCHE
   - Résume le bénéfice principal en 1 phrase percutante
   - Exemple : "Cette vidéo révèle la stratégie exacte qui a multiplié par 10 leur trafic en 90 jours."

2. CONTEXTE (1 paragraphe)
   - Qui est concerné
   - Pourquoi c'est important maintenant
   - Quel problème ça résout

3. POINTS CLÉS (3-5 bullets)
   Format : ✓ [Insight concret]
   - Pas de généralités
   - Chiffres/exemples si disponibles
   - Bénéfices clairs

4. HIGHLIGHT PRINCIPAL
   - L'enseignement le plus puissant
   - Développé en 2-3 phrases
   - Donne un aperçu sans tout révéler

5. POUR QUI ?
   - Liste 2-3 profils qui bénéficieront le plus
   - Spécifique
   - Exemple : "Idéal si tu es freelance et que tu galères à trouver des clients"

6. CONCLUSION
   - Rappel de la valeur
   - Incitation à regarder
   - Durée estimée de visionnage

STYLE :
- Énergique et enthousias

te
- Vocabulaire précis
- Promet de la valeur sans survendre
- Tone = Recommandation d'ami

GÉNÈRE LE RÉSUMÉ COMPLET."""

        try:
            response = self.model.generate_content(prompt)
            content = response.text
            
            return {
                "type": "summary",
                "content": content,
                "word_count": len(content.split()),
                "status": "generated",
                "service": "gemini",
                "quality": "premium"
            }
        except Exception as e:
            logger.error(f"Gemini summary generation failed: {str(e)}")
            return self._generate_demo_content("summary", transcript, video_title)
    
    async def generate_all_content(self, transcript: str, video_title: str) -> List[Dict[str, Any]]:
        """
        Generate all types of premium content from a video transcript.
        """
        logger.info(f"Generating premium content for: {video_title}")
        
        content_pieces = []
        
        try:
            blog_post = await self.generate_blog_post(transcript, video_title)
            content_pieces.append(blog_post)
            
            twitter_thread = await self.generate_twitter_thread(transcript, video_title)
            content_pieces.append(twitter_thread)
            
            linkedin_post = await self.generate_linkedin_post(transcript, video_title)
            content_pieces.append(linkedin_post)
            
            tiktok = await self.generate_tiktok(transcript, video_title)
            content_pieces.append(tiktok)
            
            instagram_caption = await self.generate_instagram_caption(transcript, video_title)
            content_pieces.append(instagram_caption)
            
            summary = await self.generate_video_summary(transcript, video_title)
            content_pieces.append(summary)
            
            logger.info(f"Successfully generated {len(content_pieces)} premium content pieces")
            
        except Exception as e:
            logger.error(f"Error generating content: {str(e)}")
        
        return content_pieces
    
    def _generate_demo_content(self, content_type: str, transcript: str, video_title: str) -> Dict[str, Any]:
        """Generate demo content when API is not available."""
        demo_content = {
            "blog_post": f"# {video_title}\n\nThis is a demo blog post. Install Google Gemini API for premium AI-generated content.\n\nBased on the video transcript, here would be a comprehensive article with expert-level writing.",
            "twitter_thread": f"🧵 {video_title}\n\n1/5 This is a demo Twitter thread. Add your Gemini API key for viral-worthy content.\n\n2/5 Real threads will have engaging hooks and valuable insights...",
            "linkedin_post": f"📢 {video_title}\n\nThis is a demo LinkedIn post. Configure Gemini API for thought-leadership content.\n\nReal posts will position you as an expert.\n\n#Demo #AI",
            "tiktok": f"🎬 TikTok Script: {video_title}\n\n[HOOK] This is a demo TikTok script.\n\nAdd Gemini API key for viral TikTok scripts with hooks, transitions and CTAs!\n\n[CTA] Follow for more!",
            "instagram_caption": f"✨ {video_title}\n\nThis is a demo caption. Configure your Gemini API for scroll-stopping captions!\n\n#demo #ai",
            "summary": f"Summary: {video_title}\n\nThis is a demo summary. Real summaries will make people want to watch the full video."
        }
        
        return {
            "type": content_type,
            "content": demo_content.get(content_type, "Demo content"),
            "status": "demo",
            "service": "demo",
            "quality": "demo",
            "note": "Configure GOOGLE_GEMINI_API_KEY for premium AI-generated content"
        }
