import React, { useState } from 'react';
import { useFlashcardStore } from '../store/useFlashcardStore';

const langCodes = {
  Telugu: 'te',
  Hindi: 'hi',
  Spanish: 'es',
  French: 'fr',
};

// Alternative translation service that supports CORS
const translateWithMyMemory = async (text, targetLang) => {
  const response = await fetch(
    `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`
  );
  if (!response.ok) throw new Error('Translation failed');
  const data = await response.json();
  return data.responseData.translatedText;
};

// Fallback: Simple dictionary for common words
const basicDictionary = {
  te: {
    'hello': 'హలో',
    'goodbye': 'వీడ్కోలు',
    'thank you': 'ధన్యవాదాలు',
    'please': 'దయచేసి',
    'yes': 'అవును',
    'no': 'లేదు',
    'water': 'నీరు',
    'food': 'ఆహారం',
    'house': 'ఇల్లు',
    'car': 'కారు',
    'book': 'పుస్తకం',
    'friend': 'స్నేహితుడు',
    'family': 'కుటుంబం',
    'love': 'ప్రేమ',
    'happy': 'సంతోషం',
    'sad': 'దుఃఖం'
  },
  hi: {
    'hello': 'नमस्ते',
    'goodbye': 'अलविदा',
    'thank you': 'धन्यवाद',
    'please': 'कृपया',
    'yes': 'हाँ',
    'no': 'नहीं',
    'water': 'पानी',
    'food': 'खाना',
    'house': 'घर',
    'car': 'कार',
    'book': 'किताब',
    'friend': 'दोस्त',
    'family': 'परिवार',
    'love': 'प्यार',
    'happy': 'खुश',
    'sad': 'उदास'
  },
  es: {
    'hello': 'hola',
    'goodbye': 'adiós',
    'thank you': 'gracias',
    'please': 'por favor',
    'yes': 'sí',
    'no': 'no',
    'water': 'agua',
    'food': 'comida',
    'house': 'casa',
    'car': 'coche',
    'book': 'libro',
    'friend': 'amigo',
    'family': 'familia',
    'love': 'amor',
    'happy': 'feliz',
    'sad': 'triste'
  },
  fr: {
    'hello': 'bonjour',
    'goodbye': 'au revoir',
    'thank you': 'merci',
    'please': 's\'il vous plaît',
    'yes': 'oui',
    'no': 'non',
    'water': 'eau',
    'food': 'nourriture',
    'house': 'maison',
    'car': 'voiture',
    'book': 'livre',
    'friend': 'ami',
    'family': 'famille',
    'love': 'amour',
    'happy': 'heureux',
    'sad': 'triste'
  }
};

function Flashcards() {
  const { flashcards, addFlashcard } = useFlashcardStore();
  const [term, setTerm] = useState('');
  const [translation, setTranslation] = useState('');
  const [language, setLanguage] = useState('Telugu');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (term && translation) {
      addFlashcard(term, translation);
      setTerm('');
      setTranslation('');
    }
  };

  const handleTranslate = async () => {
    if (!term || !language) return;
    setLoading(true);
    
    try {
      const targetLang = langCodes[language];
      let translatedText = '';

      // First try: Check basic dictionary
      const lowerTerm = term.toLowerCase().trim();
      if (basicDictionary[targetLang] && basicDictionary[targetLang][lowerTerm]) {
        translatedText = basicDictionary[targetLang][lowerTerm];
      } else {
        // Second try: Use MyMemory API (has CORS support)
        try {
          translatedText = await translateWithMyMemory(term, targetLang);
        } catch (apiError) {
          console.warn('API translation failed, using fallback');
          // Fallback: Suggest manual entry
          alert(`Automatic translation not available. Please enter the translation manually.\n\nTip: You can also add common words to our built-in dictionary.`);
          return;
        }
      }

      setTranslation(translatedText);
    } catch (err) {
      console.error('Translation error:', err.message);
      alert('Translation failed. Please enter the translation manually.');
    } finally {
      setLoading(false);
    }
  };

  const getSuggestion = () => {
    const targetLang = langCodes[language];
    const lowerTerm = term.toLowerCase().trim();
    if (basicDictionary[targetLang] && basicDictionary[targetLang][lowerTerm]) {
      return basicDictionary[targetLang][lowerTerm];
    }
    return null;
  };

  const suggestion = getSuggestion();

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Flashcards</h2>
      
      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-sm text-yellow-800">
          <strong>Translation Options:</strong>
          <br />• Built-in dictionary for common words
          <br />• Online translation service (MyMemory API)
          <br />• Manual entry when automatic translation fails
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2 mb-4">
        <div className="flex gap-2">
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Term (e.g., hello, water, friend)"
            className="border p-2 flex-1 rounded"
          />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            {Object.keys(langCodes).map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleTranslate}
            disabled={loading || !term}
            className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white px-4 py-2 rounded"
          >
            {loading ? 'Translating...' : 'Translate'}
          </button>
        </div>
        
        {suggestion && (
          <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
            💡 Suggestion: "{suggestion}"
          </div>
        )}
        
        <input
          value={translation}
          onChange={(e) => setTranslation(e.target.value)}
          placeholder={`Translation in ${language}`}
          className="border p-2 w-full rounded"
        />
        
        <button 
          type="submit" 
          disabled={!term || !translation}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded"
        >
          Add Flashcard
        </button>
      </form>
      
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">Your Flashcards ({flashcards.length})</h3>
        {flashcards.length === 0 ? (
          <p className="text-gray-500 italic">No flashcards yet. Add some above!</p>
        ) : (
          <ul className="space-y-2">
            {flashcards.map((card) => (
              <li key={card.id} className="bg-white shadow-sm border p-3 rounded hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center">
                  <div>
                    <strong className="text-blue-600">{card.term}</strong>
                    <span className="mx-2 text-gray-400">→</span>
                    <span className="text-green-600">{card.translation}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Flashcards;