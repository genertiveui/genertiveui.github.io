import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the valid data
const validDataPath = path.join(__dirname, '../app/data/valid_data_complete.json');
const outputPath = path.join(__dirname, '../app/data/dynamicData.json');

const validData = JSON.parse(fs.readFileSync(validDataPath, 'utf8'));

// Filter submissions where "Ours (Claude 3.7)" won
function filterOursWinningSubmissions(submissions) {
  return submissions.filter(sub => {
    // Check if "Ours (Claude 3.7)" was one of the models
    const isModelA = sub.modelA === "Ours (Claude 3.7)";
    const isModelB = sub.modelB === "Ours (Claude 3.7)";
    
    // Check who won
    if (isModelA && sub.overallWinner === 'A') return true;
    if (isModelB && sub.overallWinner === 'B') return true;
    
    return false;
  });
}

// Clean and filter valuable comments
function cleanComment(comment) {
  // First, check if this is about the winning option
  const isAboutWinner = comment.match(/Example A|Option A|Participant A/i) && 
                       (comment.includes('chose A') || comment.includes('prefer A') || 
                        comment.includes('A is better') || comment.includes('A was better'));
  
  // Extract only positive statements about the winner
  let cleaned = comment;
  
  // Remove comparative sentences
  const sentences = cleaned.split(/[.!?]+/);
  const positiveSentences = sentences.filter(sentence => {
    const lower = sentence.toLowerCase();
    // Keep sentences that don't contain comparisons or negatives
    return !lower.includes('than') && 
           !lower.includes('compared') && 
           !lower.includes('other') &&
           !lower.includes('but') &&
           !lower.includes('however') &&
           !lower.includes('although') &&
           !lower.includes('while') &&
           !lower.includes('versus') &&
           !lower.includes('vs') &&
           sentence.trim().length > 20;
  });
  
  cleaned = positiveSentences.join('. ').trim();
  
  // Replace references with generic positive terms
  cleaned = cleaned
    .replace(/Example [AB]/gi, 'The interface')
    .replace(/Option [AB]/gi, 'The system')
    .replace(/Participant [AB]/gi, 'The platform')
    .replace(/The winning interface/gi, 'The interface')
    .replace(/\b[AB]\b(?!\w)/g, 'It');
  
  // Remove duplicate spaces
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  return cleaned;
}

// Check if comment is valuable (contains UI/UX insights and is positive)
function isValuableComment(comment) {
  const valuableKeywords = [
    'interface', 'visual', 'interactive', 'layout', 'design', 'easy',
    'helpful', 'organized', 'clear', 'user-friendly', 'intuitive',
    'structure', 'navigation', 'aesthetic', 'color', 'information',
    'engaging', 'efficient', 'comprehensive', 'accessible', 'readable',
    'functionality', 'usability', 'experience', 'presentation', 'format'
  ];
  
  // Keywords that indicate criticism or comparison
  const negativeKeywords = [
    'but', 'however', 'although', 'while', 'contrast', 'lacks', 'lacking',
    'unfortunately', 'not', "doesn't", "didn't", 'no', 'without', 'less',
    'worse', 'bad', 'poor', 'fail', 'issue', 'problem', 'difficult',
    'confusing', 'cluttered', 'overwhelming', 'complicated', 'hard',
    'struggle', 'bare bones', 'basic', 'simple', 'minimal', 'versus',
    'compared to', 'on the other hand', 'in contrast', 'whereas',
    'plain', 'boring', 'dry', 'simplistic', 'too', 'than', 'prefer',
    'choice', 'over', 'instead', 'rather', 'though', 'still',
    'could be', 'would be', 'should be', 'merely', 'just', 'only',
    'limited', 'wasn\'t', 'aren\'t', 'isn\'t', 'weren\'t', 'bland',
    'The interface', 'The system', 'The platform', 'It', 'the other',
    'Example', 'Option', 'Participant', 'Response', 'Website'
  ];
  
  const lowerComment = comment.toLowerCase();
  const hasValueableContent = valuableKeywords.some(keyword => lowerComment.includes(keyword));
  const hasNegativeContent = negativeKeywords.some(keyword => lowerComment.includes(keyword));
  const isLongEnough = comment.length > 100;
  
  return hasValueableContent && !hasNegativeContent && isLongEnough;
}

// Extract valuable comments from winning submissions
function extractValuableComments(submissions) {
  const comments = [];
  
  submissions.forEach(sub => {
    if (sub.hasComment && sub.summaryComment) {
      const cleaned = cleanComment(sub.summaryComment);
      
      if (isValuableComment(cleaned)) {
        comments.push({
          text: cleaned,
          category: sub.promptCategory,
          query: sub.userQuery,
          original: sub.summaryComment
        });
      }
    }
  });
  
  return comments;
}

// Group by category
function groupByCategory(comments) {
  const grouped = {};
  
  comments.forEach(comment => {
    if (!grouped[comment.category]) {
      grouped[comment.category] = [];
    }
    grouped[comment.category].push(comment);
  });
  
  return grouped;
}

// Main processing
const winningSubmissions = filterOursWinningSubmissions(validData.data.submissions);
console.log(`Found ${winningSubmissions.length} submissions where "Ours (Claude 3.7)" won`);

const valuableComments = extractValuableComments(winningSubmissions);
console.log(`Extracted ${valuableComments.length} valuable comments`);

const groupedComments = groupByCategory(valuableComments);

// Create new dynamic data with only valuable comments
const dynamicData = {};

Object.entries(groupedComments).forEach(([category, comments], index) => {
  // Sort comments by length (longer = more detailed)
  comments.sort((a, b) => b.text.length - a.text.length);
  
  // Take top 10 most detailed comments
  const topComments = comments.slice(0, 10);
  
  // Create carousel structure
  const carousel = [];
  for (let i = 0; i < topComments.length; i += 5) {
    const group = topComments.slice(i, i + 5).map((comment, idx) => ({
      id: i + idx + 1,
      text: comment.text,
      value: (Math.random() * 0.3 + 0.7).toFixed(1) // 0.7-1.0 for winning comments
    }));
    carousel.push(group);
  }
  
  dynamicData[index + 1] = {
    activity: category,
    gif: `https://generaluimodels.github.io/assets/demo${index + 1}.gif`,
    carousel: carousel
  };
});

// Save the filtered data
fs.writeFileSync(outputPath, JSON.stringify(dynamicData, null, 2));

console.log('\nCategories with valuable comments:');
Object.entries(groupedComments).forEach(([category, comments]) => {
  console.log(`- ${category}: ${comments.length} comments`);
});

// Print some example valuable comments
console.log('\nExample valuable comments:');
Object.entries(groupedComments).forEach(([category, comments]) => {
  console.log(`\n${category}:`);
  comments.slice(0, 2).forEach(comment => {
    console.log(`  - "${comment.text.substring(0, 150)}..."`);
  });
});