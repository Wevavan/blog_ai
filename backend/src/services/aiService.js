// Service de génération de contenu avec IA
// Supporte OpenAI et Anthropic Claude

class AIService {
  constructor() {
    this.provider = process.env.AI_PROVIDER || 'openai'; // 'openai' ou 'anthropic'
    this.apiKey = process.env.AI_API_KEY;
  }

  async generateArticle(topic, options = {}) {
    const {
      category = 'IA Générale',
      tone = 'informatif',
      length = 'moyen'
    } = options;

    try {
      if (this.provider === 'openai') {
        return await this.generateWithOpenAI(topic, category, tone, length);
      } else if (this.provider === 'anthropic') {
        return await this.generateWithAnthropic(topic, category, tone, length);
      } else {
        // Fallback: génération de contenu de démonstration
        return this.generateDemoArticle(topic, category);
      }
    } catch (error) {
      console.error('Erreur génération IA:', error);
      // En cas d'erreur, retourner un contenu de démonstration
      return this.generateDemoArticle(topic, category);
    }
  }

  async generateWithOpenAI(topic, category, tone, length) {
    // Si l'API Key n'est pas configurée, utiliser le mode démo
    if (!this.apiKey) {
      console.log('OpenAI API Key non configurée, utilisation du mode démo');
      return this.generateDemoArticle(topic, category);
    }

    const axios = require('axios');

    const lengthGuide = {
      'court': '400-600 mots',
      'moyen': '800-1000 mots',
      'long': '1500-2000 mots'
    };

    const prompt = `Tu es un expert en intelligence artificielle et en rédaction de contenu technique.

Génère un article de blog complet et professionnel sur le sujet suivant : "${topic}"

Catégorie : ${category}
Ton : ${tone}
Longueur : ${lengthGuide[length] || '800-1000 mots'}

L'article doit contenir :
1. Un titre accrocheur et optimisé SEO (max 60 caractères)
2. Un extrait/résumé captivant (max 160 caractères)
3. Un contenu structuré avec des sous-titres (utilise ## pour les H2 et ### pour les H3)
4. Des exemples concrets et des explications claires
5. Une conclusion
6. 5-7 tags pertinents

Le contenu doit être au format Markdown et doit être informatif, engageant et accessible.

Retourne UNIQUEMENT un objet JSON avec cette structure exacte :
{
  "title": "Le titre de l'article",
  "excerpt": "L'extrait court",
  "content": "Le contenu complet en Markdown",
  "tags": ["tag1", "tag2", "tag3"],
  "metaDescription": "Description SEO de 150-160 caractères"
}`;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Tu es un expert rédacteur d\'articles sur l\'IA. Tu réponds toujours avec un JSON valide.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 3000
      },
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error('Format de réponse invalide');
  }

  async generateWithAnthropic(topic, category, tone, length) {
    // Si l'API Key n'est pas configurée, utiliser le mode démo
    if (!this.apiKey) {
      console.log('Anthropic API Key non configurée, utilisation du mode démo');
      return this.generateDemoArticle(topic, category);
    }

    const axios = require('axios');

    const lengthGuide = {
      'court': '400-600 mots',
      'moyen': '800-1000 mots',
      'long': '1500-2000 mots'
    };

    const prompt = `Tu es un expert en intelligence artificielle et en rédaction de contenu technique.

Génère un article de blog complet et professionnel sur le sujet suivant : "${topic}"

Catégorie : ${category}
Ton : ${tone}
Longueur : ${lengthGuide[length] || '800-1000 mots'}

L'article doit contenir :
1. Un titre accrocheur et optimisé SEO (max 60 caractères)
2. Un extrait/résumé captivant (max 160 caractères)
3. Un contenu structuré avec des sous-titres (utilise ## pour les H2 et ### pour les H3)
4. Des exemples concrets et des explications claires
5. Une conclusion
6. 5-7 tags pertinents

Le contenu doit être au format Markdown et doit être informatif, engageant et accessible.

Retourne UNIQUEMENT un objet JSON avec cette structure exacte :
{
  "title": "Le titre de l'article",
  "excerpt": "L'extrait court",
  "content": "Le contenu complet en Markdown",
  "tags": ["tag1", "tag2", "tag3"],
  "metaDescription": "Description SEO de 150-160 caractères"
}`;

    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      },
      {
        headers: {
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.content[0].text;
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error('Format de réponse invalide');
  }

  generateDemoArticle(topic, category) {
    // Contenu de démonstration quand l'API n'est pas configurée
    return {
      title: `${topic} : Guide Complet`,
      excerpt: `Découvrez tout ce qu'il faut savoir sur ${topic} dans ce guide complet et accessible à tous.`,
      content: `## Introduction

${topic} est un sujet fascinant qui mérite notre attention. Dans cet article, nous allons explorer en profondeur ce concept.

## Qu'est-ce que ${topic} ?

Il s'agit d'un domaine en pleine évolution qui transforme notre façon de travailler et d'interagir avec la technologie.

### Les fondamentaux

Pour comprendre ${topic}, il est important de maîtriser quelques concepts de base :

- **Concept 1** : Explication du premier concept important
- **Concept 2** : Explication du deuxième concept
- **Concept 3** : Explication du troisième concept

## Applications pratiques

${topic} trouve de nombreuses applications dans le monde réel :

### Dans l'industrie

Les entreprises utilisent ${topic} pour améliorer leur efficacité et leur productivité.

### Dans la recherche

Les chercheurs explorent de nouvelles façons d'utiliser ${topic} pour résoudre des problèmes complexes.

## Avantages et défis

### Avantages

- Efficacité accrue
- Automatisation des tâches répétitives
- Nouvelles opportunités d'innovation

### Défis à relever

- Questions éthiques
- Besoin de formation
- Adaptation technologique

## Conclusion

${topic} représente une opportunité majeure pour l'avenir. En comprenant ses principes et ses applications, nous pouvons mieux nous préparer aux changements à venir.`,
      tags: [category, 'Intelligence Artificielle', 'Technologie', 'Innovation', 'Futur'],
      metaDescription: `Guide complet sur ${topic}. Découvrez les concepts, applications et enjeux de cette technologie d'avenir.`
    };
  }
}

module.exports = new AIService();
