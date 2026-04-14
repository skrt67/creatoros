#!/bin/bash

echo "🔍 Test de l'API Vidova"
echo "======================="
echo ""

# URL de l'API
API_URL="https://api.vidova.me"

# Test 1: Health check
echo "1️⃣ Test de santé du serveur..."
HEALTH=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/health" 2>/dev/null)
if [ "$HEALTH" = "200" ]; then
    echo "✅ Serveur en ligne (HTTP $HEALTH)"
else
    echo "❌ Serveur hors ligne ou erreur (HTTP $HEALTH)"
fi
echo ""

# Test 2: Root endpoint
echo "2️⃣ Test de l'endpoint racine..."
ROOT=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/" 2>/dev/null)
if [ "$ROOT" = "200" ]; then
    echo "✅ Endpoint racine accessible (HTTP $ROOT)"
else
    echo "⚠️  Endpoint racine retourne HTTP $ROOT"
fi
echo ""

# Test 3: Auth endpoint
echo "3️⃣ Test de l'endpoint d'authentification..."
AUTH=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/auth/login" 2>/dev/null)
if [ "$AUTH" = "422" ] || [ "$AUTH" = "405" ]; then
    echo "✅ Endpoint auth accessible (HTTP $AUTH - normal sans credentials)"
else
    echo "⚠️  Endpoint auth retourne HTTP $AUTH"
fi
echo ""

# Test 4: CORS headers
echo "4️⃣ Test des headers CORS..."
CORS=$(curl -s -I -X OPTIONS "$API_URL/health" 2>/dev/null | grep -i "access-control-allow-origin")
if [ -n "$CORS" ]; then
    echo "✅ Headers CORS configurés"
    echo "   $CORS"
else
    echo "⚠️  Headers CORS non détectés"
fi
echo ""

echo "======================="
echo "✅ Tests terminés"
