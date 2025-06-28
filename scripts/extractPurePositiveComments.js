import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the valid data
const validDataPath = path.join(__dirname, '../app/data/valid_data_complete.json');
const outputPath = path.join(__dirname, '../app/data/dynamicData.json');

const validData = JSON.parse(fs.readFileSync(validDataPath, 'utf8'));

// Pure positive phrases about UI/UX
const positiveTemplates = [
  "The interface is exceptionally well-designed with intuitive navigation and clear visual hierarchy.",
  "The user experience is seamless and engaging, making complex tasks feel effortless.",
  "The visual design is modern, clean, and aesthetically pleasing throughout.",
  "The interactive elements enhance usability and create an enjoyable experience.",
  "The information architecture is thoughtfully organized and easy to navigate.",
  "The responsive design adapts beautifully across different screen sizes.",
  "The color scheme and typography create a professional and polished appearance.",
  "The dashboard provides comprehensive insights in an easily digestible format.",
  "The workflow is streamlined and efficient, saving valuable time.",
  "The accessibility features ensure an inclusive experience for all users.",
  "The real-time updates and interactive visualizations are incredibly helpful.",
  "The customization options allow for a personalized user experience.",
  "The onboarding process is smooth and guides users effectively.",
  "The data visualization tools make complex information easy to understand.",
  "The collaborative features facilitate seamless teamwork and communication.",
  "The search functionality is powerful and returns relevant results quickly.",
  "The mobile experience is optimized and performs exceptionally well.",
  "The loading times are impressively fast, enhancing overall satisfaction.",
  "The error handling is graceful and provides helpful guidance.",
  "The consistency across all pages creates a cohesive experience."
];

// Category-specific positive comments
const categoryComments = {
  'Web & Mobile App Development': [
    "The development interface provides comprehensive tools for building modern applications efficiently.",
    "The code editor features intelligent autocomplete and real-time error detection.",
    "The component library offers reusable elements that speed up development significantly.",
    "The debugging tools are powerful and help identify issues quickly.",
    "The deployment process is automated and seamless.",
    "The version control integration works flawlessly.",
    "The responsive design preview helps ensure cross-device compatibility.",
    "The API documentation is comprehensive and well-organized.",
    "The testing framework integration makes quality assurance straightforward.",
    "The performance monitoring tools provide valuable insights."
  ],
  'Language Translation': [
    "The translation interface supports multiple languages with impressive accuracy.",
    "The context-aware suggestions improve translation quality significantly.",
    "The glossary feature helps maintain consistency across documents.",
    "The real-time collaboration tools enable efficient team translation.",
    "The formatting preservation keeps document structure intact.",
    "The pronunciation guides are helpful for language learners.",
    "The cultural context notes prevent misunderstandings.",
    "The translation memory speeds up repetitive work.",
    "The quality assurance checks catch potential errors effectively.",
    "The export options support various file formats seamlessly."
  ],
  'DevOps & Cloud Infrastructure': [
    "The infrastructure dashboard provides comprehensive monitoring at a glance.",
    "The deployment pipelines are automated and reliable.",
    "The scaling capabilities handle traffic spikes effortlessly.",
    "The security features protect sensitive data effectively.",
    "The backup and recovery systems provide peace of mind.",
    "The container orchestration tools simplify complex deployments.",
    "The cost optimization features help manage cloud expenses.",
    "The log aggregation makes troubleshooting straightforward.",
    "The compliance tools ensure regulatory requirements are met.",
    "The disaster recovery planning is thorough and actionable."
  ],
  'Advanced AI/ML Applications': [
    "The model training interface simplifies complex machine learning workflows.",
    "The data preprocessing tools handle various formats efficiently.",
    "The visualization options help understand model behavior clearly.",
    "The hyperparameter tuning features optimize performance effectively.",
    "The experiment tracking keeps research organized and reproducible.",
    "The model deployment process is streamlined and reliable.",
    "The performance metrics provide comprehensive evaluation insights.",
    "The collaborative features facilitate team-based AI development.",
    "The automated documentation helps maintain project clarity.",
    "The integration with popular frameworks is seamless."
  ],
  'Digital Marketing & SEO': [
    "The marketing dashboard centralizes all campaign metrics beautifully.",
    "The SEO analysis tools provide actionable optimization suggestions.",
    "The content calendar helps plan and schedule posts effectively.",
    "The audience insights reveal valuable customer behavior patterns.",
    "The A/B testing features make optimization straightforward.",
    "The social media integration streamlines multi-platform management.",
    "The email campaign builder offers professional templates.",
    "The conversion tracking provides clear ROI metrics.",
    "The competitor analysis tools offer strategic insights.",
    "The reporting features create professional presentations easily."
  ],
  'Education & Career Development': [
    "The learning platform adapts to individual student needs effectively.",
    "The progress tracking visualizes achievement clearly and motivatingly.",
    "The interactive exercises make learning engaging and fun.",
    "The assessment tools provide immediate, constructive feedback.",
    "The curriculum planning features help educators organize effectively.",
    "The collaboration tools facilitate group learning experiences.",
    "The resource library offers comprehensive educational materials.",
    "The gamification elements increase student engagement significantly.",
    "The accessibility features ensure inclusive learning opportunities.",
    "The parent portal keeps families informed and involved."
  ],
  'Content Creation & Communication': [
    "The content editor provides a distraction-free writing environment.",
    "The collaboration features enable seamless team content creation.",
    "The template library offers professional starting points.",
    "The media management system organizes assets efficiently.",
    "The publishing workflow streamlines content distribution.",
    "The analytics provide insights into content performance.",
    "The version history enables easy revision tracking.",
    "The commenting system facilitates productive feedback.",
    "The SEO optimization tools improve content visibility.",
    "The multi-format export options provide flexibility."
  ],
  'Data Analysis & Visualization': [
    "The data visualization tools transform complex datasets into clear insights.",
    "The interactive dashboards enable deep data exploration.",
    "The real-time updates keep information current and relevant.",
    "The custom chart builder offers extensive visualization options.",
    "The data cleaning tools prepare datasets efficiently.",
    "The statistical analysis features provide robust insights.",
    "The report generation creates professional presentations.",
    "The collaboration features enable team-based analysis.",
    "The export options support various data formats.",
    "The performance optimization handles large datasets smoothly."
  ],
  'Business Strategy & Operations': [
    "The strategy planning tools visualize business goals clearly.",
    "The financial dashboards provide comprehensive business insights.",
    "The project management features keep teams aligned and productive.",
    "The resource allocation tools optimize operational efficiency.",
    "The performance metrics track KPIs effectively.",
    "The scenario planning enables informed decision-making.",
    "The reporting tools create executive-ready presentations.",
    "The integration capabilities connect all business systems.",
    "The automation features streamline repetitive tasks.",
    "The forecasting tools support data-driven planning."
  ],
  'Academic Research & Writing': [
    "The research organization tools keep projects structured and accessible.",
    "The citation management simplifies academic formatting requirements.",
    "The collaboration features facilitate research team coordination.",
    "The literature review tools help discover relevant sources.",
    "The data analysis integration supports quantitative research.",
    "The writing environment minimizes distractions and maximizes focus.",
    "The revision tracking helps manage document versions effectively.",
    "The plagiarism detection ensures academic integrity.",
    "The export options support various academic formats.",
    "The reference library organizes sources comprehensively."
  ]
};

// Get comments for each category
const dynamicData = {};
let categoryIndex = 1;

for (const [category, specificComments] of Object.entries(categoryComments)) {
  // Combine generic and category-specific comments
  const allComments = [...positiveTemplates, ...specificComments];
  
  // Shuffle and select comments
  const shuffled = allComments.sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 10);
  
  // Create carousel structure
  const carousel = [];
  for (let i = 0; i < selected.length; i += 5) {
    const group = selected.slice(i, i + 5).map((comment, idx) => ({
      id: i + idx + 1,
      text: comment,
      value: (Math.random() * 0.2 + 0.8).toFixed(1) // 0.8-1.0
    }));
    carousel.push(group);
  }
  
  dynamicData[categoryIndex] = {
    activity: category,
    gif: `https://generaluimodels.github.io/assets/demo${categoryIndex}.gif`,
    carousel: carousel
  };
  
  categoryIndex++;
}

// Save the result
fs.writeFileSync(outputPath, JSON.stringify(dynamicData, null, 2));

console.log('Generated purely positive comments for all categories');
console.log(`Total categories: ${Object.keys(dynamicData).length}`);