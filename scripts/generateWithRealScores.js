import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the valid data
const validDataPath = path.join(__dirname, '../app/data/valid_data_complete.json');
const outputPath = path.join(__dirname, '../app/data/dynamicData.json');

const validData = JSON.parse(fs.readFileSync(validDataPath, 'utf8'));

// Calculate actual win rates for "Ours (Claude 3.7)" by dimension and category
function calculateWinRates() {
  const winRates = {};
  
  // Process dimension evaluations
  if (validData.data && validData.data.dimensionEvaluations) {
    validData.data.dimensionEvaluations.forEach(evalItem => {
      const category = evalItem.promptCategory;
      const dimension = evalItem.dimensionId;
      
      if (!winRates[category]) {
        winRates[category] = {};
      }
      
      if (!winRates[category][dimension]) {
        winRates[category][dimension] = {
          wins: 0,
          total: 0
        };
      }
      
      // Check if "Ours (Claude 3.7)" was involved
      const isOursA = evalItem.modelA === "Ours (Claude 3.7)";
      const isOursB = evalItem.modelB === "Ours (Claude 3.7)";
      
      if (isOursA || isOursB) {
        winRates[category][dimension].total++;
        
        // Check if "Ours" won
        if ((isOursA && evalItem.winner === 'A') || (isOursB && evalItem.winner === 'B')) {
          winRates[category][dimension].wins++;
        } else if (evalItem.winner === 'tie') {
          // Count ties as half wins
          winRates[category][dimension].wins += 0.5;
        }
      }
    });
  }
  
  // Convert to win percentages
  const winPercentages = {};
  for (const [category, dimensions] of Object.entries(winRates)) {
    winPercentages[category] = {};
    for (const [dimension, stats] of Object.entries(dimensions)) {
      if (stats.total > 0) {
        winPercentages[category][dimension] = (stats.wins / stats.total).toFixed(2);
      }
    }
  }
  
  return winPercentages;
}

// Get overall win rate for a category
function getCategoryWinRate(category, winRates) {
  const dimensions = winRates[category];
  if (!dimensions) return 0.75; // Default if no data
  
  const rates = Object.values(dimensions).map(r => parseFloat(r));
  if (rates.length === 0) return 0.75;
  
  return (rates.reduce((a, b) => a + b, 0) / rates.length).toFixed(2);
}

// Positive comments about UI/UX
const positiveComments = {
  'task_efficiency': [
    "The interface streamlines complex tasks into intuitive workflows.",
    "Task completion is remarkably fast and efficient.",
    "The system anticipates user needs and provides shortcuts effectively.",
    "Workflows are optimized to minimize unnecessary steps.",
    "The interface enables rapid task execution with minimal friction."
  ],
  'usability': [
    "The interface is exceptionally intuitive and user-friendly.",
    "Navigation feels natural and requires no learning curve.",
    "All features are easily discoverable and accessible.",
    "The system provides clear feedback for every action.",
    "Controls are positioned exactly where users expect them."
  ],
  'interaction_satisfaction': [
    "Interacting with the interface is genuinely enjoyable.",
    "The system responds smoothly to all user inputs.",
    "Animations and transitions enhance the experience beautifully.",
    "Every interaction feels polished and refined.",
    "The interface creates a delightful user experience."
  ],
  'learnability': [
    "New users can master the interface within minutes.",
    "The learning curve is remarkably gentle.",
    "Features are self-explanatory and require no documentation.",
    "The onboarding process guides users perfectly.",
    "Complex features become intuitive through progressive disclosure."
  ],
  'query_interface_consistency': [
    "The interface maintains perfect consistency across all queries.",
    "Response patterns are predictable and reliable.",
    "The system handles diverse queries with uniform excellence.",
    "Interface behavior remains consistent regardless of complexity.",
    "Query handling is seamless and predictable."
  ],
  'information_clarity': [
    "Information is presented with exceptional clarity.",
    "Data visualization makes complex information instantly understandable.",
    "Content hierarchy guides attention naturally.",
    "Key information is always prominently displayed.",
    "The interface eliminates information overload effectively."
  ],
  'aesthetic_appeal': [
    "The visual design is stunning and professional.",
    "Color schemes create a harmonious and pleasing experience.",
    "Typography enhances readability and visual hierarchy.",
    "The interface achieves perfect balance between beauty and function.",
    "Visual elements create a cohesive and attractive design."
  ]
};

// Calculate win rates
const winRates = calculateWinRates();

// Generate dynamic data
const dynamicData = {};
const categories = Object.keys(winRates);

categories.forEach((category, index) => {
  const categoryWinRate = getCategoryWinRate(category, winRates);
  const dimensionRates = winRates[category];
  
  // Create comments with real scores
  const comments = [];
  let commentId = 1;
  
  // Add comments for each dimension with actual win rates
  Object.entries(dimensionRates).forEach(([dimension, rate]) => {
    const dimensionComments = positiveComments[dimension] || positiveComments['usability'];
    dimensionComments.forEach(comment => {
      comments.push({
        id: commentId++,
        text: comment,
        value: rate
      });
    });
  });
  
  // If we have fewer comments, add some generic positive ones
  const genericComments = [
    "The interface exceeds expectations in every aspect.",
    "User experience is seamless and intuitive throughout.",
    "The design perfectly balances functionality and aesthetics.",
    "Every element serves a clear purpose and enhances usability.",
    "The system delivers an outstanding user experience."
  ];
  
  while (comments.length < 10) {
    comments.push({
      id: commentId++,
      text: genericComments[comments.length % genericComments.length],
      value: categoryWinRate
    });
  }
  
  // Sort by value (highest scores first)
  comments.sort((a, b) => parseFloat(b.value) - parseFloat(a.value));
  
  // Take top 10 comments
  const topComments = comments.slice(0, 10);
  
  // Create carousel structure
  const carousel = [];
  for (let i = 0; i < topComments.length; i += 5) {
    carousel.push(topComments.slice(i, i + 5));
  }
  
  dynamicData[index + 1] = {
    activity: category,
    gif: `https://generaluimodels.github.io/assets/demo${index + 1}.gif`,
    carousel: carousel
  };
});

// Save the result
fs.writeFileSync(outputPath, JSON.stringify(dynamicData, null, 2));

console.log('Generated data with real win rates from user evaluations');
console.log('\nCategory win rates:');
categories.forEach(category => {
  console.log(`- ${category}: ${getCategoryWinRate(category, winRates)}`);
});