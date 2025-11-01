# Stripe Test Cards - Vidova

## Pour tester le paiement Stripe en mode TEST

Utilisez ces informations de carte pour tester les paiements :

### ✅ CARTE DE TEST VALIDE
```
Numéro de carte: 4242 4242 4242 4242
Date d'expiration: N'importe quelle date future (ex: 12/34)
CVC: N'importe quel 3 chiffres (ex: 123)
Code postal: N'importe quel code postal valide (ex: 75001)
```

### Autres cartes de test disponibles:

#### Paiement réussi (authentification 3D Secure)
```
Numéro: 4000 0027 6000 3184
```

#### Paiement refusé - Insufficient funds
```
Numéro: 4000 0000 0000 9995
```

#### Paiement refusé - Carte perdue
```
Numéro: 4000 0000 0000 9987
```

#### Paiement refusé - Carte volée
```
Numéro: 4000 0000 0000 9979
```

## Vérification du mode

Pour vérifier que vous êtes bien en mode TEST:
1. Allez sur la page de paiement
2. Ouvrez la console du navigateur (F12)
3. Vérifiez que l'URL Stripe commence par `https://checkout.stripe.com/c/pay/cs_test_...`
4. Si c'est le cas, vous êtes en mode TEST ✅

## IMPORTANT

⚠️ **NE JAMAIS** utiliser de vraies cartes bancaires en mode TEST
⚠️ **NE JAMAIS** utiliser les cartes de test en mode PRODUCTION

Pour plus d'informations: https://stripe.com/docs/testing
