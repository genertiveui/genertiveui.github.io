import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the JSON files
const validDataPath = path.join(__dirname, '../app/data/valid_data_complete.json');
const promptsPath = path.join(__dirname, '../app/data/prompts.json');
const outputPath = path.join(__dirname, '../app/data/dynamicData.json');

const validData = JSON.parse(fs.readFileSync(validDataPath, 'utf8'));
const promptsData = JSON.parse(fs.readFileSync(promptsPath, 'utf8'));

// Function to extract valuable comments with rich data
function extractValuableComments(submissions) {
  return submissions
    .filter(sub => sub.hasComment && sub.summaryComment && sub.summaryComment.length > 50)
    .map(sub => ({
      text: sub.summaryComment,
      value: (Math.random() * 0.4 + 0.6).toFixed(1), // Random value between 0.6-1.0
      category: sub.promptCategory,
      interface: sub.winnerInterface,
      query: sub.userQuery,
      promptType: sub.promptType,
      promptSection: sub.promptSection,
      model: sub.winnerModel,
      dimensionScores: sub.dimensionScores || {},
      submissionId: sub.submissionId
    }));
}

// Function to extract high-quality examples from "Ours (Claude 3.7)" model
function extractCategoryData(submissions) {
  const categoryData = {};
  
  submissions.forEach(sub => {
    const category = sub.promptCategory;
    if (!categoryData[category]) {
      categoryData[category] = {
        examples: []
      };
    }
    
    // Only include examples where "Ours (Claude 3.7)" won
    const isOursWinner = (sub.overallWinner === 'A' && sub.modelA === 'Ours (Claude 3.7)') ||
                        (sub.overallWinner === 'B' && sub.modelB === 'Ours (Claude 3.7)');
    
    // Check if this is a comparison between "Ours (Claude 3.7)" and "Text-based"
    const isOursVsTextComparison = (sub.modelA === 'Ours (Claude 3.7)' && sub.interfaceB === 'Text-based') ||
                                   (sub.modelB === 'Ours (Claude 3.7)' && sub.interfaceA === 'Text-based');
    
    // Filter for high-quality examples with good dimension scores
    const hasGoodComment = sub.hasComment && sub.summaryComment && 
                          sub.summaryComment.length > 50 && // Longer, more detailed comments
                          (sub.summaryComment.toLowerCase().includes('better') ||
                           sub.summaryComment.toLowerCase().includes('clear') ||
                           sub.summaryComment.toLowerCase().includes('easy') ||
                           sub.summaryComment.toLowerCase().includes('helpful') ||
                           sub.summaryComment.toLowerCase().includes('interactive') ||
                           sub.summaryComment.toLowerCase().includes('visual') ||
                           sub.summaryComment.toLowerCase().includes('organized') ||
                           sub.summaryComment.toLowerCase().includes('comprehensive') ||
                           sub.summaryComment.toLowerCase().includes('intuitive') ||
                           sub.summaryComment.toLowerCase().includes('user-friendly'));
    
    // Check dimension scores quality (if available)
    const hasGoodDimensionScores = sub.dimensionScores && 
                                  Object.keys(sub.dimensionScores).length > 0 &&
                                  Object.values(sub.dimensionScores).some(score => score >= 4); // At least one dimension >= 4
    
    // Calculate quality score for ranking
    const qualityScore = (sub.summaryComment?.length || 0) + 
                        (hasGoodDimensionScores ? 100 : 0) + 
                        (Object.values(sub.dimensionScores || {}).reduce((sum, score) => sum + score, 0));
    
    // Add high-quality examples (collect all first, then filter to top 3)
    if (isOursWinner && isOursVsTextComparison && hasGoodComment && sub.userQuery && 
        sub.winnerInterface === 'UI-based') { // Only UI-based winners
      
      // Get URLs for comparison - Ours (Claude 3.7) vs Text-based
      const oursUrl = sub.modelA === 'Ours (Claude 3.7)' ? sub.linkAUrl : sub.linkBUrl;
      const textUrl = sub.interfaceA === 'Text-based' ? sub.linkAUrl : sub.linkBUrl;
      
      if (oursUrl && textUrl) {
        categoryData[category].examples.push({
          query: sub.userQuery,
          oursUrl: oursUrl,
          textUrl: textUrl,
          comment: sub.summaryComment,
          interface: 'UI-based',
          model: 'Ours (Claude 3.7)',
          commentLength: sub.commentLength || sub.summaryComment.length,
          dimensionScores: sub.dimensionScores || {},
          qualityScore: qualityScore,
          submissionId: sub.submissionId
        });
      }
    }
  });
  
  // Sort examples by quality score and select top 3
  Object.keys(categoryData).forEach(category => {
    categoryData[category].examples.sort((a, b) => b.qualityScore - a.qualityScore);
    // Keep only top 3 examples per category
    categoryData[category].examples = categoryData[category].examples.slice(0, 3);
  });
  
  return categoryData;
}

// Function to group comments by category
function groupCommentsByCategory(comments) {
  const grouped = {};
  comments.forEach(comment => {
    if (!grouped[comment.category]) {
      grouped[comment.category] = [];
    }
    grouped[comment.category].push(comment);
  });
  return grouped;
}

// Function to create carousel structure
function createCarousel(comments, limit = 10) {
  const selected = comments.slice(0, limit);
  const carousel = [];
  
  // Split into groups of 5
  for (let i = 0; i < selected.length; i += 5) {
    const group = selected.slice(i, i + 5).map((comment, idx) => ({
      id: i + idx + 1,
      text: comment.text,
      value: comment.value
    }));
    carousel.push(group);
  }
  
  return carousel;
}

// Extract all valuable comments and category data
const allComments = extractValuableComments(validData.data.submissions);
const groupedComments = groupCommentsByCategory(allComments);
const categoryExamples = extractCategoryData(validData.data.submissions);

// Create the dynamic data structure
const dynamicData = {};
const categories = Object.keys(groupedComments);

// Map categories to meaningful activity names
const categoryToActivity = {
  'Web & Mobile App Development': 'Web & Mobile App Development',
  'Language Translation': 'Language Translation',
  'DevOps & Cloud Infrastructure': 'DevOps & Cloud Infrastructure',
  'Advanced AI/ML Applications': 'Advanced AI/ML Applications',
  'Digital Marketing & SEO': 'Digital Marketing & SEO',
  'Education & Career Development': 'Education & Career Development',
  'Content Creation & Communication': 'Content Creation & Communication',
  'Data Analysis & Visualization': 'Data Analysis & Visualization',
  'Business Strategy & Operations': 'Business Strategy & Operations',
  'Academic Research & Writing': 'Academic Research & Writing'
};

// Generate dynamic data for each category
categories.forEach((category, index) => {
  const activityName = categoryToActivity[category] || category;
  const categoryComments = groupedComments[category];
  
  // Select diverse comments that highlight UI preferences
  const uiPreferenceComments = categoryComments.filter(c => 
    c.text.toLowerCase().includes('interface') ||
    c.text.toLowerCase().includes('visual') ||
    c.text.toLowerCase().includes('interactive') ||
    c.text.toLowerCase().includes('layout') ||
    c.text.toLowerCase().includes('design') ||
    c.text.toLowerCase().includes('easy') ||
    c.text.toLowerCase().includes('helpful') ||
    c.text.toLowerCase().includes('better')
  );
  
  // Get real user examples for this category
  const realData = categoryExamples[category] || {};
  
  dynamicData[index + 1] = {
    activity: activityName,
    gif: `https://generaluimodels.github.io/assets/demo${index + 1}.gif`, // Placeholder
    carousel: createCarousel(uiPreferenceComments.length > 0 ? uiPreferenceComments : categoryComments),
    examples: realData.examples || []
  };
});

// No additional prompts data needed - keeping it simple

// Write the output file
fs.writeFileSync(outputPath, JSON.stringify(dynamicData, null, 2));

console.log('Dynamic data generated successfully!');
console.log(`Total activities: ${Object.keys(dynamicData).length}`);
console.log('Categories included:', categories);