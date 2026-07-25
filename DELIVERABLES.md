# Livrables — Intégration Marketing Analytics (GTM / GA4 / Clarity)
Site : svetlanakisselev.com — Dépôt : svetlanakisselev/svetlanakisselev.github.io

## 1. Fichiers modifiés

| Fichier | Modification |
|---|---|
| `index.html`, `about.html`, `collection.html`, `queen-swan.html`, `lacrimae-mundi.html`, `1001-nights.html`, `contact.html`, `chronicles.html`, `subscription-confirmed.html`, `subscription-pending.html` | Ajout du snippet GTM juste après `<head>` et du `<noscript>` GTM juste après `<body>`. Aucune autre ligne touchée. |
| `components/footer.html` | Ajout du 3ᵉ icône social (Etsy), même structure que Instagram/LinkedIn. |
| `images/icons/etsy.svg` | Nouvelle icône (fournie), déjà au bon format/style (trait fin doré `#C9A66B`). |
| `gtm-container-svetlanakisselev.json` | Export du container GTM prêt à importer (Admin → Import Container → Merge → Overwrite). |

Aucun autre fichier (CSS, `script.js`, `newsletter.js`, `contact-form.js`, `data/artworks.json`) n'a été touché — conformément à la consigne "ne pas refactorer le code sans rapport".

## 2. Fonctionnalités implémentées

- **GTM** installé sur les 10 pages, aucune installation directe de GA4 en dehors de GTM.
- **GA4** configuré via une balise "GA4 Configuration" unique (Measurement ID `G-L980DH18YB`), qui se déclenche sur "All Pages".
- **Etsy** : lien ajouté dans le footer des 10 pages (`https://www.etsy.com/shop/UNICULUS`) + tracking `etsy_click`.
- **Microsoft Clarity** installé via balise HTML personnalisée dans GTM (Project ID `xrl65hhl2p`), aucun script dupliqué dans le HTML du site.
- **Mode développeur** : ajoute `?dev=1` une fois à n'importe quelle URL du site → dépose un cookie `sk_dev_mode` (30 jours) → toutes les balises GA4/Clarity sont bloquées tant que le cookie est présent, sur n'importe quel appareil/IP. Pour réactiver le tracking, effacer le cookie `sk_dev_mode` ou naviguer en navigation privée.

## 3. Liste des événements GTM configurés

| Événement GA4 | Déclencheur | Paramètres |
|---|---|---|
| `instagram_click` | Clic sur un lien contenant `instagram.com` | `current_page`, `clicked_url`, `page_title` |
| `etsy_click` | Clic sur un lien contenant `etsy.com` | `page`, `artwork` (nom de la pièce si le clic vient d'un `.piece`, sinon vide), `destination_url` |
| `email_click` | Clic sur un lien `mailto:` | `page`, `clicked_url` — **aucun lien mailto n'existe actuellement sur le site**, voir section 5 |
| `cta_click` | Clic sur les éléments `.enter-link`, `.threshold__enter`, `.home__cta`, `.piece__images-toggle` | `cta_label`, `cta_destination`, `page_path` |
| `artwork_opened` | Clic sur une image zoomable (`.piece__image--zoomable`) | `artwork_title`, `page_path` |
| `artwork_viewed` | Un `.piece` reste visible ≥ 50 % à l'écran pendant ≥ 3 s (une fois par pièce) | `artwork_title`, `page_path` |
| `scroll_depth` | Seuils 25 / 50 / 75 / 90 / 100 % | `percent_scrolled`, `page_path` |
| `page_view`, `session_start`, `user_engagement`, `scroll` (90 %), `outbound_click`, `file_download` | **Google Analytics Enhanced Measurement** (natif GA4, aucune config GTM nécessaire) | — |

**Choix volontaire** : `outbound_click` et `file_download` ne sont *pas* recréés en GTM personnalisé — Enhanced Measurement de GA4 les couvre déjà nativement (implémentation recommandée par Google), ce qui évite tout doublon. Pour le scroll, Enhanced Measurement ne couvre que 90 % ; le trigger GTM `scroll_depth` couvre les 5 seuils demandés — il faut désactiver le toggle "Scrolls" dans Enhanced Measurement (GA4 → Admin → Flux de données → Enhanced measurement) pour éviter un doublon `scroll` / `scroll_depth`.

**Parcours interne (Home → Collections → About → Contact)** : ne nécessite pas d'événement dédié — utilisable directement dans une exploration d'entonnoir GA4 (Explore → Funnel exploration) à partir des `page_view` déjà collectés par page.

## 4. Conversions GA4 recommandées

À marquer comme conversion clé dans GA4 (Admin → Events → toggle "Mark as conversion") :
- `etsy_click` (intention d'achat)
- `email_click` (une fois le lien mailto ajouté — ou un événement équivalent côté formulaire, voir ci-dessous)
- `artwork_opened` (engagement fort avec une pièce)
- `instagram_click` (secondaire, à suivre sans forcément en faire une conversion)

## 5. Point important à trancher — formulaire de contact

Le formulaire de `contact.html` est géré par `js/contact-form.js` (fetch vers un Worker Cloudflare, sans rechargement de page) : **ni un lien mailto, ni une soumission de formulaire native**. Résultat : aucun déclencheur GTM standard ne peut le capter automatiquement sans une petite modification du script existant (un simple `dataLayer.push({event: 'contact_form_submit'})` ajouté dans le callback de succès de `contact-form.js`, juste après la ligne qui affiche "message reçu"). C'est la seule touche de JS que je recommande d'ajouter — dites-moi si vous voulez que je la fasse, et je modifierai uniquement `js/contact-form.js` (une ligne).

## 6. Recommandations SEO

- Aucune régression : le HTML `<head>` reste inchangé à l'exception des deux snippets GTM, insérés avant tout autre `<meta>`/`<link>` — n'affecte ni le title, ni les meta description, ni Open Graph/Twitter Card, ni le JSON-LD.
- Le script GTM est asynchrone (`async=true`), il ne bloque pas le rendu.
- Rien à signaler de nouveau sur `sitemap.xml` / `robots.txt` / canonicals — non touchés par ce travail.

## 7. Observations performance

- Un seul script bloquant ajouté (le petit snippet inline GTM, quelques lignes, exécution quasi instantanée) ; le vrai chargement de `gtm.js` est asynchrone.
- Clarity charge également en asynchrone, via GTM, une seule fois par page (pas de double chargement possible car géré uniquement dans GTM).
- Aucun script supplémentaire n'a été ajouté en dur dans le HTML du site : tout passe par le container GTM, donc évolutif sans retoucher le HTML plus tard (objectif de scalabilité rempli).

## 8. Étapes manuelles restantes (à faire vous-même)

1. **GitHub** : uploader (remplacer) les 10 pages HTML + `components/footer.html` + `images/icons/etsy.svg` via "Add file → Upload files", comme d'habitude.
2. **GTM** : Admin → Import Container → sélectionner `gtm-container-svetlanakisselev.json` → choisir l'espace de travail → "Merge" → "Overwrite conflicting tags" → Confirmer. Puis **Preview** pour tester, puis **Submit/Publish**.
3. **GA4** : vérifier que l'Enhanced Measurement est bien activé (Admin → Flux de données → cliquer sur le flux web) : page_view, scroll, outbound clicks, file downloads, etc. Désactiver le toggle "Scrolls" si vous ne voulez pas de doublon avec `scroll_depth` (voir section 3).
4. **GA4** : marquer les conversions listées en section 4.
5. **Microsoft Clarity** : rien à faire côté Clarity lui-même, le script est injecté par GTM — vérifier dans Clarity → Settings que les données commencent à arriver après publication du container (peut prendre quelques heures).
6. **Search Console** : si pas déjà fait, vérifier la propriété avec `svetlanakisselev.com` (déjà indexable, sitemap déjà en place — rien à changer ici).
7. **Décision en attente** : voulez-vous que j'ajoute le `dataLayer.push` dans `contact-form.js` pour tracker les soumissions réelles du formulaire (section 5) ?
