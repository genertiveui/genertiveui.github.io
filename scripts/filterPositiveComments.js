import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the valid data
const validDataPath = path.join(__dirname, '../app/data/valid_data_complete.json');
const outputPath = path.join(__dirname, '../app/data/dynamicData.json');

const validData = JSON.parse(fs.readFileSync(validDataPath, 'utf8'));

// Positive keywords that indicate good UI/UX
const positiveKeywords = [
  'excellent', 'great', 'amazing', 'wonderful', 'fantastic', 'perfect',
  'beautiful', 'clean', 'clear', 'intuitive', 'user-friendly', 'efficient',
  'helpful', 'engaging', 'interactive', 'organized', 'professional',
  'polished', 'comprehensive', 'easy', 'straightforward', 'accessible',
  'impressive', 'seamless', 'smooth', 'elegant', 'modern', 'attractive',
  'appealing', 'satisfying', 'enjoyable', 'delightful', 'pleasant',
  'effective', 'powerful', 'robust', 'well-designed', 'well-organized',
  'well-structured', 'thoughtful', 'innovative', 'creative', 'smart'
];

// Extract only positive sentences from comments
function extractPositiveSentences(comment) {
  const sentences = comment.split(/[.!?]+/).filter(s => s.trim().length > 20);
  const positiveSentences = [];
  
  for (const sentence of sentences) {
    const lower = sentence.toLowerCase();
    
    // Skip sentences with any negative indicators
    if (lower.includes('but') || lower.includes('however') || 
        lower.includes('although') || lower.includes('though') ||
        lower.includes('while') || lower.includes('compared') ||
        lower.includes('than') || lower.includes('versus') ||
        lower.includes('other') || lower.includes('instead') ||
        lower.includes('rather') || lower.includes('prefer') ||
        lower.includes('not') || lower.includes("n't") ||
        lower.includes('too') || lower.includes('only') ||
        lower.includes('just') || lower.includes('merely') ||
        lower.includes('lack') || lower.includes('without') ||
        lower.includes('less') || lower.includes('more') ||
        lower.includes('better') || lower.includes('worse') ||
        lower.includes('plain') || lower.includes('boring') ||
        lower.includes('simple') || lower.includes('basic') ||
        lower.includes('could') || lower.includes('should') ||
        lower.includes('would') || lower.includes('might')) {
      continue;
    }
    
    // Check if sentence contains positive keywords
    const hasPositive = positiveKeywords.some(keyword => lower.includes(keyword));
    if (hasPositive) {
      positiveSentences.push(sentence.trim());
    }
  }
  
  return positiveSentences;
}

// Create pure positive comments
function createPositiveComment(sentences) {
  if (sentences.length === 0) return null;
  
  // Join sentences and clean up
  let comment = sentences.join('. ').trim();
  
  // Remove any remaining references to options/examples
  comment = comment
    .replace(/Example [AB]/gi, '')
    .replace(/Option [AB]/gi, '')
    .replace(/Participant [AB]/gi, '')
    .replace(/Response [AB]/gi, '')
    .replace(/Website [AB]/gi, '')
    .replace(/The (winning|other) (interface|option|example)/gi, '')
    .replace(/\b[AB]\b(?!\w)/g, '')
    .replace(/The interface/gi, 'The interface')
    .replace(/The system/gi, 'The system')
    .replace(/The platform/gi, 'The platform')
    .replace(/It /g, 'It ')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Ensure comment is substantial
  if (comment.length < 50) return null;
  
  return comment;
}

// Process submissions
const winningSubmissions = validData.data.submissions.filter(sub => {
  const isModelA = sub.modelA === "Ours (Claude 3.7)";
  const isModelB = sub.modelB === "Ours (Claude 3.7)";
  
  if (isModelA && sub.overallWinner === 'A') return true;
  if (isModelB && sub.overallWinner === 'B') return true;
  
  return false;
});

console.log(`Found ${winningSubmissions.length} winning submissions`);

// Extract positive comments
const positiveComments = [];

for (const sub of winningSubmissions) {
  if (sub.hasComment && sub.summaryComment) {
    const positiveSentences = extractPositiveSentences(sub.summaryComment);
    const cleanComment = createPositiveComment(positiveSentences);
    
    if (cleanComment) {
      positiveComments.push({
        text: cleanComment,
        category: sub.promptCategory,
        query: sub.userQuery
      });
    }
  }
}

console.log(`Extracted ${positiveComments.length} purely positive comments`);

// Group by category
const groupedComments = {};
positiveComments.forEach(comment => {
  if (!groupedComments[comment.category]) {
    groupedComments[comment.category] = [];
  }
  groupedComments[comment.category].push(comment);
});

// Create final data structure
const dynamicData = {};

Object.entries(groupedComments).forEach(([category, comments], index) => {
  // Sort by length and take best comments
  comments.sort((a, b) => b.text.length - a.text.length);
  const topComments = comments.slice(0, 10);
  
  // Create carousel
  const carousel = [];
  for (let i = 0; i < topComments.length; i += 5) {
    const group = topComments.slice(i, i + 5).map((comment, idx) => ({
      id: i + idx + 1,
      text: comment.text,
      value: (Math.random() * 0.2 + 0.8).toFixed(1) // 0.8-1.0
    }));
    carousel.push(group);
  }
  
  dynamicData[index + 1] = {
    activity: category,
    gif: `https://generaluimodels.github.io/assets/demo${index + 1}.gif`,
    carousel: carousel
  };
});

// Save the result
fs.writeFileSync(outputPath, JSON.stringify(dynamicData, null, 2));

console.log('\nCategories with positive comments:');
Object.entries(groupedComments).forEach(([category, comments]) => {
  console.log(`- ${category}: ${comments.length} comments`);
  
  // Show a sample comment
  if (comments.length > 0) {
    console.log(`  Sample: "${comments[0].text.substring(0, 100)}..."`);
  }
});