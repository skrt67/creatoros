#!/usr/bin/env python3
"""Script pour lister les modèles Gemini disponibles"""
import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

api_key = os.getenv("GOOGLE_GEMINI_API_KEY")
genai.configure(api_key=api_key)

print("📋 Modèles Gemini disponibles :\n")
print("=" * 60)

for model in genai.list_models():
    if 'generateContent' in model.supported_generation_methods:
        print(f"\n✅ {model.name}")
        print(f"   Description: {model.description}")
        print(f"   Méthodes supportées: {model.supported_generation_methods}")
