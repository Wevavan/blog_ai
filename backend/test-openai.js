require('dotenv').config();
const axios = require('axios');

async function testOpenAI() {
  console.log('🧪 Test de la configuration OpenAI...\n');

  const apiKey = process.env.OPENAI_API_KEY;

  // Vérifier si la clé est configurée
  if (!apiKey || apiKey === 'your_openai_api_key_here') {
    console.log('❌ ERREUR : Clé API OpenAI non configurée');
    console.log('\nÉditez backend/.env et ajoutez votre clé :');
    console.log('OPENAI_API_KEY=sk-votre-clé-ici\n');
    process.exit(1);
  }

  console.log('✓ Clé API trouvée');
  console.log(`  Clé : ${apiKey.substring(0, 10)}...${apiKey.slice(-4)}\n`);

  // Test de l'API
  console.log('📡 Test de connexion à l\'API OpenAI...');

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: 'Dis juste "Bonjour" en un mot'
          }
        ],
        max_tokens: 10
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const reply = response.data.choices[0].message.content;
    console.log(`✓ API OpenAI fonctionne !`);
    console.log(`  Réponse : "${reply}"\n`);

    // Informations sur le modèle
    console.log('📊 Informations :');
    console.log(`  Modèle : ${response.data.model}`);
    console.log(`  Tokens utilisés : ${response.data.usage.total_tokens}`);
    console.log(`  ✅ TOUT FONCTIONNE ! Vous pouvez générer des articles.\n`);

  } catch (error) {
    console.log('❌ ERREUR lors du test API\n');

    if (error.response) {
      console.log(`Status : ${error.response.status}`);
      console.log(`Message : ${error.response.data.error?.message || 'Erreur inconnue'}`);

      if (error.response.status === 401) {
        console.log('\n💡 Clé API invalide. Vérifiez que :');
        console.log('  1. La clé est correcte (commence par sk-)');
        console.log('  2. La clé n\'a pas été révoquée');
      } else if (error.response.status === 429) {
        console.log('\n💡 Quota dépassé. Vérifiez que :');
        console.log('  1. Vous avez des crédits sur votre compte OpenAI');
        console.log('  2. Votre limite de taux n\'est pas atteinte');
      }
    } else {
      console.log('Erreur de connexion :', error.message);
    }

    console.log();
    process.exit(1);
  }
}

testOpenAI();
