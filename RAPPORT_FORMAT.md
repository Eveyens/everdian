# Format RAPPORT - Structure JSON

## Structure JSON attendue

### Format standardisé (recommandé)

```json
{
  "type": "rapport",
  "content": "# Titre Principal\n\n## Section 1\n\nContenu de la section 1...\n\n### Sous-section 1.1\n\nDétails de la sous-section.\n\n## Section 2\n\n- Point 1\n- Point 2\n- Point 3\n\n**Conclusion importante**\n\nTexte de conclusion."
}
```

## Support Markdown

Le format rapport supporte les éléments Markdown suivants :

### Titres

- `# Titre` → Titre principal (H1) - Grande taille, bordure bleue en bas
- `## Titre` → Titre de section (H2) - Taille moyenne, bordure grise
- `### Titre` → Sous-titre (H3) - Taille normale, gras

### Formatage

- `**texte**` → Texte en gras
- `- item` → Liste à puces (transformé en • item)

### Exemple complet

```json
{
  "type": "rapport",
  "content": "# Rapport Mensuel - Janvier 2024\n\n## Vue d'ensemble\n\nCe rapport présente les performances du mois de janvier 2024.\n\n### Métriques clés\n\n- Ventes totales : 150 000€\n- Croissance : +15%\n- Nouveaux clients : 45\n\n## Analyse détaillée\n\n### Secteur A\n\nLes ventes du secteur A ont augmenté de 20% par rapport au mois précédent.\n\n### Secteur B\n\nLe secteur B montre une stabilité avec une légère augmentation de 5%.\n\n**Conclusion**\n\nLe mois de janvier a été très positif avec une croissance globale de 15%."
}
```

## Fonctionnalités du composant Rapport

1. **Effets de survol** : Bordure bleue et ombre au survol
2. **Titres formatés** : Support des niveaux H1, H2, H3 avec styles distincts
3. **Bouton de téléchargement** : Visible en haut à droite, télécharge le rapport en .txt
4. **Style élégant** : Dégradé de fond, bordure colorée à gauche, espacement optimisé
5. **Support markdown basique** : Listes, texte en gras, paragraphes

## Différence avec le format TEXT

| Format | Style | Fonctionnalités |
|--------|-------|----------------|
| **text** | Simple, minimal | Texte brut avec pré-formatage |
| **rapport** | Élégant, professionnel | Titres formatés, bouton téléchargement, effets visuels |

## Notes importantes

- Le champ `type` doit être exactement `"rapport"` (en minuscules)
- Le champ `content` contient le texte du rapport avec support Markdown
- Les sauts de ligne sont préservés
- Le fichier téléchargé sera nommé `rapport-YYYY-MM-DD.txt`

