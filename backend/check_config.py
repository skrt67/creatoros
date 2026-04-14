#!/usr/bin/env python3
"""
Script de diagnostic pour vérifier la configuration du backend
"""

import os
import sys
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

def check_config():
    print("=" * 60)
    print("🔍 DIAGNOSTIC DE CONFIGURATION BACKEND")
    print("=" * 60)
    print()
    
    # Variables critiques
    critical_vars = {
        "DATABASE_URL": os.getenv("DATABASE_URL"),
        "JWT_SECRET": os.getenv("JWT_SECRET"),
        "ASSEMBLYAI_API_KEY": os.getenv("ASSEMBLYAI_API_KEY"),
        "GEMINI_API_KEY": os.getenv("GEMINI_API_KEY"),
    }
    
    # Variables optionnelles
    optional_vars = {
        "RESEND_API_KEY": os.getenv("RESEND_API_KEY"),
        "TEMPORAL_HOST": os.getenv("TEMPORAL_HOST"),
        "TEMPORAL_PORT": os.getenv("TEMPORAL_PORT"),
        "PORT": os.getenv("PORT"),
        "ENVIRONMENT": os.getenv("ENVIRONMENT"),
    }
    
    print("📋 VARIABLES CRITIQUES:")
    print("-" * 60)
    all_critical_ok = True
    for key, value in critical_vars.items():
        if value:
            # Masquer la valeur pour la sécurité
            masked_value = value[:10] + "..." if len(value) > 10 else "***"
            print(f"✅ {key}: {masked_value}")
        else:
            print(f"❌ {key}: NON CONFIGURÉ")
            all_critical_ok = False
    
    print()
    print("📋 VARIABLES OPTIONNELLES:")
    print("-" * 60)
    for key, value in optional_vars.items():
        if value:
            masked_value = value[:10] + "..." if len(value) > 10 else value
            print(f"✅ {key}: {masked_value}")
        else:
            print(f"⚠️  {key}: Non configuré")
    
    print()
    print("=" * 60)
    
    if all_critical_ok:
        print("✅ TOUTES LES VARIABLES CRITIQUES SONT CONFIGURÉES")
        print("=" * 60)
        return 0
    else:
        print("❌ CERTAINES VARIABLES CRITIQUES MANQUENT")
        print("=" * 60)
        print()
        print("💡 ACTIONS À FAIRE:")
        print("1. Vérifiez que le fichier .env existe dans le dossier backend/")
        print("2. Assurez-vous que toutes les clés API sont configurées")
        print("3. Redémarrez le serveur après avoir modifié le .env")
        return 1

if __name__ == "__main__":
    sys.exit(check_config())
