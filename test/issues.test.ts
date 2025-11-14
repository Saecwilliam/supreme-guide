1. Das Haupt-Skript: update-gist.js
const { Octokit } = require('@octokit/rest'); // Neueste Version: npm i @octokit/rest

async function updateGist(gistId, authToken, updates) {
  // updates = { oldFileName: { content: 'neuer Text', filename?: 'neuerName.txt' } }
  // Optional: description: 'Neue Beschreibung'

  const octokit = new Octokit({ auth: authToken });

  try {
    const result = await octokit.rest.gists.update({
      gist_id: gistId,
      ...updates, // Mergt files und description rein
    });
    console.log('Gist updated! Neue Files:', result.data.files);
    return result.data;
  } catch (error) {
    console.error('Ups, Fehlgeschlagen:', error.message);
    if (error.status === 404) console.log('Gist-ID checken?');
    if (error.status === 422) console.log('Files-Struktur falsch – Schlüssel muss alter Dateiname sein!');
    throw error;
  }
}

// Beispiel-Use (ersetze mit echten Werten)
async function main() {
  const GIST_ID = 'deine-gist-id-hier'; // z.B. 'a1b2c3d4...'
  const TOKEN = 'ghp_dein-personal-access-token'; // Erstelle einen auf github.com/settings/tokens (Scopes: gist)

  const updates = {
    description: 'Updated via Octokit – easy peasy!',
    files: {
      'alte-datei.js': {  // Schlüssel = ALTER Name!
        content: 'console.log("Hallo aus der API!");', // Pflicht
        filename: 'neue-datei.js' // Optional: Umbenennen
      }
      // Um zu löschen: 'zu-loeschende.txt': null
    }
  };

  await updateGist(GIST_ID, TOKEN, updates);
}

main().catch(console.error);
