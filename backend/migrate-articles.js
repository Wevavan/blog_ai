require('dotenv').config();
const mongoose = require('mongoose');
const Article = require('./src/models/Article');

// Fonction de conversion Markdown -> HTML (même que dans adminController)
function convertMarkdownToHTML(markdown) {
  if (!markdown) return '';

  let html = markdown;

  // Headers (ordre important: du plus spécifique au moins spécifique)
  html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Bold (avant italic pour éviter les conflits)
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Code inline
  html = html.replace(/`(.+?)`/g, '<code>$1</code>');

  // Links
  html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');

  // Lists - mieux gérer les listes
  const lines = html.split('\n');
  let inList = false;
  const processedLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.match(/^[\-\*] /)) {
      if (!inList) {
        processedLines.push('<ul>');
        inList = true;
      }
      processedLines.push(line.replace(/^[\-\*] (.+)$/, '<li>$1</li>'));
    } else if (line.match(/^\d+\. /)) {
      if (!inList) {
        processedLines.push('<ol>');
        inList = true;
      }
      processedLines.push(line.replace(/^\d+\. (.+)$/, '<li>$1</li>'));
    } else {
      if (inList) {
        processedLines.push('</ul>');
        inList = false;
      }
      processedLines.push(line);
    }
  }

  if (inList) {
    processedLines.push('</ul>');
  }

  html = processedLines.join('\n');

  // Paragraphs - séparer les blocs
  const blocks = html.split('\n\n');
  const processedBlocks = blocks.map(block => {
    block = block.trim();
    if (!block) return '';

    // Ne pas envelopper les éléments HTML existants
    if (block.startsWith('<h') ||
        block.startsWith('<ul') ||
        block.startsWith('<ol') ||
        block.startsWith('<li') ||
        block.startsWith('<blockquote')) {
      return block;
    }

    return `<p>${block.replace(/\n/g, '<br>')}</p>`;
  });

  html = processedBlocks.filter(b => b).join('\n\n');

  return html;
}

async function migrateArticles() {
  try {
    console.log('Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connecté à MongoDB');

    // Trouver tous les articles
    const articles = await Article.find({});
    console.log(`\nTrouvé ${articles.length} article(s)`);

    let converted = 0;
    let skipped = 0;

    for (const article of articles) {
      // Vérifier si le contenu contient du markdown brut
      if (article.content.includes('##') || article.content.includes('**')) {
        console.log(`\nConversion: "${article.title}"`);
        const htmlContent = convertMarkdownToHTML(article.content);
        article.content = htmlContent;
        await article.save();
        console.log('  ✓ Converti');
        converted++;
      } else {
        console.log(`\nIgnoré: "${article.title}" (déjà en HTML)`);
        skipped++;
      }
    }

    console.log('\n=============================');
    console.log(`Articles convertis: ${converted}`);
    console.log(`Articles ignorés: ${skipped}`);
    console.log(`Total: ${articles.length}`);
    console.log('=============================\n');

    await mongoose.connection.close();
    console.log('✓ Déconnecté de MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de la migration:', error);
    process.exit(1);
  }
}

migrateArticles();
