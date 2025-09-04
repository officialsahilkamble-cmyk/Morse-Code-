import type { Level } from './types';

export const MORSE_CODE_MAP: { [key: string]: string } = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..',
  '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
  '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----',
};

// Character learning order based on the Koch method principle (starting simple)
const ALL_CHARS_IN_ORDER = "ETIANMSURWDKGOHVF_L_PJBXCYZQ_54_3_2_16_7_8_90".replace(/_/g, '').split('');

// Word lists for level generation
const WORDS_3 = ["THE", "AND", "FOR", "ARE", "BUT", "NOT", "YOU", "ALL", "ANY", "CAN", "HAD", "HER", "WAS", "ONE", "OUR", "OUT", "DAY", "GET", "HAS", "HIM", "HIS", "HOW", "MAN", "NEW", "NOW", "OLD", "SEE", "TWO", "WAY", "WHO", "BOY", "DID", "ITS", "LET", "PUT", "SAY", "SHE", "TOO", "USE"];
const WORDS_4 = ["THAT", "WITH", "HAVE", "THIS", "WILL", "YOUR", "FROM", "THEY", "KNOW", "WANT", "BEEN", "GOOD", "MUCH", "SOME", "TIME", "VERY", "WHEN", "COME", "HERE", "JUST", "LIKE", "LONG", "MAKE", "MANY", "MORE", "ONLY", "OVER", "SUCH", "TAKE", "THAN", "THEM", "WELL", "WERE"];
const WORDS_5 = ["ABOUT", "ABOVE", "AFTER", "AGAIN", "BELOW", "COULD", "EVERY", "FIRST", "FOUND", "GREAT", "HOUSE", "LARGE", "LEARN", "NEVER", "OTHER", "PLACE", "PLANT", "POINT", "RIGHT", "SMALL", "SOUND", "SPELL", "STILL", "STUDY", "THEIR", "THERE", "THESE", "THING", "THINK", "THREE", "WATER", "WHERE", "WHICH", "WORLD", "WOULD", "WRITE"];
const WORDS_6_PLUS = ["ALWAYS", "ANIMAL", "ANSWER", "BECOME", "BETTER", "BLACK", "BRING", "CARRY", "CHANGE", "CREATE", "DIFFER", "ENOUGH", "EXAMPLE", "FAMILY", "FATHER", "FOLLOW", "FRIEND", "GROUND", "GROW", "HAPPEN", "HEARD", "IMPORTANT", "KNOWLEDGE", "LETTER", "LIGHT", "LITTLE", "MOTHER", "MYSELF", "NEARLY", "NUMBER", "PEOPLE", "PICTURE", "QUESTION", "REMEMBER", "SCHOOL", "SECOND", "SENTENCE", "SHOULD", "SOMETHING", "THOUGHT", "TOGETHER", "TURNING", "USUALLY", "VOICE", "WALKED", "WHITE", "WITHOUT", "WONDER"];

// --- Level Generation Logic ---

const shuffleArray = <T>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const generateLevels = (): Level[] => {
  const levels: Level[] = [];
  let learnedChars: string[] = [];

  // Part 1: Character Introduction (36 levels)
  for (let i = 0; i < ALL_CHARS_IN_ORDER.length; i++) {
    const newChar = ALL_CHARS_IN_ORDER[i];
    learnedChars.push(newChar);
    const practiceChars = shuffleArray([...learnedChars]).slice(0, 7);
    levels.push({
      name: `Introducing: ${newChar}`,
      challenges: shuffleArray([newChar, ...practiceChars.filter(c => c !== newChar).slice(0, 6)]),
    });
  }
  
  // Part 2: Character Review (20 levels)
  for (let i = 0; i < 20; i++) {
      levels.push({
          name: `Character Review ${i + 1}`,
          challenges: shuffleArray([...ALL_CHARS_IN_ORDER]).slice(0, 10),
      });
  }

  // Part 3: Word Practice
  const createWordLevels = (wordList: string[], wordsPerLevel: number, namePrefix: string) => {
    const shuffledWords = shuffleArray([...wordList]);
    for (let i = 0; i < shuffledWords.length; i += wordsPerLevel) {
      const chunk = shuffledWords.slice(i, i + wordsPerLevel);
      if (chunk.length > 0) {
        levels.push({
          name: `${namePrefix} Practice #${Math.floor(i / wordsPerLevel) + 1}`,
          challenges: chunk,
        });
      }
    }
  };

  createWordLevels(WORDS_3, 5, "3-Letter Word");
  createWordLevels(WORDS_4, 5, "4-Letter Word");
  createWordLevels(WORDS_5, 5, "5-Letter Word");
  createWordLevels(WORDS_6_PLUS, 5, "Advanced Word");
  
  // Combine all word lists for final mixed practice
  const allWords = [...WORDS_3, ...WORDS_4, ...WORDS_5, ...WORDS_6_PLUS];
  for(let i = 0; i < 20; i++) {
     createWordLevels(allWords, 7, `Mixed Word Review`);
  }

  // Ensure we have over 1000 levels by adding more mixed reviews if needed
  while(levels.length < 1001) {
    createWordLevels(shuffleArray(allWords).slice(0, 100), 10, 'Expert Challenge');
  }

  return levels;
};

export const ALL_LEVELS: Level[] = generateLevels();
