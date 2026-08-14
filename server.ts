import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google GenAI client lazily if key is available
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// AI Generated Custom Roadmap
app.post('/api/ai/generate-roadmap', async (req, res) => {
  try {
    const { name, university, degree, gradYear, targetRole, experienceLevel, weeklyHours, currentSkills } = req.body;
    
    const client = getGeminiClient();
    if (client) {
      const prompt = `You are an elite career development AI.
Generate a structured 5-phase career learning roadmap for a student/professional with the following profile:
- Name: ${name || 'User'}
- University / Background: ${university || 'Self-taught / University'}
- Degree: ${degree || 'Computer Science / Engineering'}
- Graduation / Target Year: ${gradYear || '2025'}
- Target Career Role: ${targetRole || 'Data Scientist'}
- Current Experience Level: ${experienceLevel || 'Intermediate'}
- Weekly Hours Commitment: ${weeklyHours || 12}
- Known Foundation Skills: ${Array.isArray(currentSkills) ? currentSkills.join(', ') : currentSkills || 'Python, SQL'}

Return ONLY a valid JSON object matching this schema without any markdown backticks:
{
  "roleTitle": "${targetRole || 'Data Scientist'}",
  "roleCategory": "string",
  "readinessScore": number (between 30 and 65),
  "acquiredSkillsCount": number,
  "totalRequiredSkillsCount": number (around 20-25),
  "salaryRange": "string (e.g. $115,000 - $175,000)",
  "demandGrowth": "string (e.g. +28% (Very High))",
  "knownSkills": ["string", "string"],
  "learningSkills": [{"name": "string", "progress": number}],
  "neededSkills": [{"name": "string", "priority": "HIGH" | "MEDIUM" | "LOW", "category": "string"}],
  "phases": [
    {
      "phaseNumber": 1,
      "title": "Phase 1: ...",
      "status": "completed",
      "description": "string",
      "tags": ["string", "string"],
      "progress": 100,
      "milestones": [
        {"id": "m1", "title": "string", "completed": true, "type": "concept", "estimatedTime": "4 hrs"}
      ]
    },
    {
      "phaseNumber": 2,
      "title": "Phase 2: ...",
      "status": "in_progress",
      "description": "string",
      "tags": ["string", "string"],
      "progress": 35,
      "milestones": [
        {"id": "m2", "title": "string", "completed": true, "type": "coding", "estimatedTime": "3 hrs"},
        {"id": "m3", "title": "string", "completed": false, "type": "project", "estimatedTime": "5 hrs"}
      ]
    },
    {
      "phaseNumber": 3,
      "title": "Phase 3: ...",
      "status": "locked",
      "description": "string",
      "tags": ["string"],
      "progress": 0,
      "milestones": []
    },
    {
      "phaseNumber": 4,
      "title": "Phase 4: ...",
      "status": "locked",
      "description": "string",
      "tags": ["string"],
      "progress": 0,
      "milestones": []
    },
    {
      "phaseNumber": 5,
      "title": "Phase 5: ...",
      "status": "locked",
      "description": "string",
      "tags": ["string"],
      "progress": 0,
      "milestones": []
    }
  ]
}`;

      const response = await client.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text?.trim() || '';
      const cleanJson = text.replace(/^```json/i, '').replace(/^```/, '').replace(/```$/, '').trim();
      const parsed = JSON.parse(cleanJson);
      return res.json(parsed);
    }
  } catch (error) {
    console.warn('AI Roadmap generation error, falling back to smart generator:', error);
  }

  // Smart Fallback generator
  const targetRole = req.body.targetRole || 'Data Scientist';
  const name = req.body.name || 'Shakeera';
  
  res.json({
    roleTitle: targetRole,
    roleCategory: 'Technology & AI',
    readinessScore: 42,
    acquiredSkillsCount: 8,
    totalRequiredSkillsCount: 20,
    salaryRange: '$110,000 - $170,000',
    demandGrowth: '+25% (High)',
    knownSkills: ['Python', 'SQL', 'Pandas', 'Git', 'Data Cleaning', 'Statistics'],
    learningSkills: [
      { name: 'Core Machine Learning', progress: 60 },
      { name: 'Data Structures & Algorithms', progress: 30 },
      { name: 'Data Visualization', progress: 45 },
    ],
    neededSkills: [
      { name: 'Deep Learning & PyTorch', priority: 'HIGH', category: 'Advanced AI' },
      { name: 'NLP & Transformers', priority: 'MEDIUM', category: 'Language Models' },
      { name: 'Distributed Big Data (Spark)', priority: 'LOW', category: 'Data Engineering' },
      { name: 'MLOps & CI/CD Pipelines', priority: 'MEDIUM', category: 'Deployment' },
    ],
    phases: [
      {
        id: 'p-1',
        phaseNumber: 1,
        title: 'Phase 1: Fundamentals & Tooling',
        status: 'completed',
        description: 'Core programming proficiency, version control, and data manipulation basics.',
        tags: ['Python', 'SQL', 'Pandas'],
        progress: 100,
        milestones: [
          { id: 'm-1-1', title: 'Python essentials & data types mastery', completed: true, type: 'concept', estimatedTime: '4 hrs' },
          { id: 'm-1-2', title: 'Relational database querying with complex SQL queries', completed: true, type: 'coding', estimatedTime: '5 hrs' },
        ],
      },
      {
        id: 'p-2',
        phaseNumber: 2,
        title: 'Phase 2: Core Problem Solving & DSA',
        status: 'in_progress',
        description: 'Algorithmic efficiency, data structure implementations, and coding interviews.',
        tags: ['Arrays & Hash Maps', 'Binary Search', 'Trees & Graphs'],
        progress: 35,
        milestones: [
          { id: 'm-2-1', title: 'Two-pointer and sliding window algorithmic patterns', completed: true, type: 'coding', estimatedTime: '4 hrs' },
          { id: 'm-2-2', title: 'Binary Search Trees & traversal algorithms', completed: false, type: 'coding', estimatedTime: '6 hrs' },
          { id: 'm-2-3', title: 'Time & space complexity analysis (Big-O notation)', completed: false, type: 'quiz', estimatedTime: '3 hrs' },
        ],
      },
      {
        id: 'p-3',
        phaseNumber: 3,
        title: 'Phase 3: Domain Foundations & Statistics',
        status: 'locked',
        description: 'Inferential statistics, hypothesis testing, and exploratory analysis.',
        tags: ['Probability', 'Hypothesis Testing', 'EDA'],
        progress: 0,
        milestones: [
          { id: 'm-3-1', title: 'Probability distributions and statistical significance', completed: false, type: 'concept', estimatedTime: '5 hrs' },
        ],
      },
      {
        id: 'p-4',
        phaseNumber: 4,
        title: 'Phase 4: Advanced Modeling & Applied Systems',
        status: 'locked',
        description: 'Supervised/unsupervised models, ensemble methods, and validation strategies.',
        tags: ['Scikit-Learn', 'Feature Engineering', 'Evaluation'],
        progress: 0,
        milestones: [
          { id: 'm-4-1', title: 'Model selection, cross-validation & bias-variance tradeoff', completed: false, type: 'concept', estimatedTime: '6 hrs' },
        ],
      },
      {
        id: 'p-5',
        phaseNumber: 5,
        title: 'Phase 5: Production Capstone & Job-Readiness',
        status: 'locked',
        description: 'Portfolio capstone project, system design architecture, and interview prep.',
        tags: ['Production Deployment', 'Portfolio Capstone', 'Interview Prep'],
        progress: 0,
        milestones: [
          { id: 'm-5-1', title: 'End-to-End deployed portfolio project with live web UI', completed: false, type: 'project', estimatedTime: '15 hrs' },
        ],
      },
    ],
  });
});

// AI Topic Explainer / Tutor
app.post('/api/ai/explain-topic', async (req, res) => {
  try {
    const { topic, role, context } = req.body;
    const client = getGeminiClient();
    if (client) {
      const prompt = `You are a world-class technical mentor helping a student preparing for the role of ${role || 'Data Scientist'}.
Explain the topic "${topic}" in a clear, highly engaging, and structured way.

Include:
1. Quick Concept Summary (2-3 sentences)
2. Real-World Industry Analogy
3. Key Principles / Syntax or Pattern Cheat Sheet (with a clean, formatted code snippet if applicable)
4. 2 Common Interview Gotchas / Pitfalls to avoid
5. 1 Practice Challenge with a brief hint.

Keep the formatting clean with markdown headings and bullet points.`;

      const response = await client.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
      });

      return res.json({ explanation: response.text || '' });
    }
  } catch (err) {
    console.warn('AI Explainer error:', err);
  }

  // Fallback explanation
  const topic = req.body.topic || 'Data Structures & Algorithms';
  res.json({
    explanation: `### What is ${topic}?
${topic} forms the backbone of modern software engineering and computational data analysis. It allows you to organize data efficiently and write optimized algorithms that scale with large inputs.

### 💡 Real-World Analogy
Think of choosing data structures like organizing a warehouse: an Array is a sequential shelf of numbered boxes, a Hash Map is an automated index robot that jumps straight to an item in $O(1)$ time, and a Binary Search Tree is a branching filing cabinet sorted alphabetically.

### 🚀 Key Takeaways & Cheat Sheet
- **Arrays / Lists**: Best for direct indexed access ($O(1)$) and cache-locality.
- **Hash Maps**: Key-value lookups with average $O(1)$ insertion, search, and deletion.
- **Binary Search**: Logarithmic $O(\\log N)$ search over sorted sequences.
- **Trees & Graphs**: Hierarchical and networked relationships (traversed with DFS and BFS).

### ⚠️ Top Interview Gotchas
1. Forgetting edge cases (empty collections, single element, duplicates).
2. Assuming hash maps are always $O(1)$ without considering worst-case hash collisions.

### 🎯 Practice Challenge
Given an array of numbers, find if any two numbers sum to a target value in $O(N)$ time.
*Hint: Use a Hash Set to track seen numbers in a single linear pass.*`,
  });
});

// AI Quick Quiz Generator
app.post('/api/ai/generate-quiz', async (req, res) => {
  try {
    const { topic, role } = req.body;
    const client = getGeminiClient();
    if (client) {
      const prompt = `Generate a 3-question multiple choice quiz testing practical knowledge of "${topic || 'Data Science & Algorithms'}" for a ${role || 'Data Scientist'}.

Return ONLY a JSON array of 3 objects without markdown wrappers:
[
  {
    "id": "q1",
    "question": "string",
    "options": ["string", "string", "string", "string"],
    "correctIndex": number (0 to 3),
    "explanation": "string explaining why this option is correct"
  }
]`;

      const response = await client.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });

      const text = response.text?.trim() || '';
      const cleanJson = text.replace(/^```json/i, '').replace(/^```/, '').replace(/```$/, '').trim();
      const parsed = JSON.parse(cleanJson);
      return res.json({ questions: parsed });
    }
  } catch (err) {
    console.warn('AI Quiz error:', err);
  }

  // Fallback Quiz
  res.json({
    questions: [
      {
        id: 'q1',
        question: 'What is the average time complexity of searching an element in a balanced Hash Map?',
        options: ['O(N)', 'O(log N)', 'O(1)', 'O(N log N)'],
        correctIndex: 2,
        explanation: 'Hash maps compute a hash index for direct memory addressing, yielding average O(1) constant time lookup.',
      },
      {
        id: 'q2',
        question: 'In Pandas, which method is best suited to split data into groups and apply summary statistics?',
        options: ['df.filter()', 'df.groupby()', 'df.pivot_table()', 'df.concat()'],
        correctIndex: 1,
        explanation: 'df.groupby() implements the split-apply-combine paradigm to calculate aggregations across categories.',
      },
      {
        id: 'q3',
        question: 'Which technique is primarily used to prevent overfitting in deep neural networks?',
        options: ['Dropout & L2 Regularization', 'Increasing Learning Rate', 'Removing Validation Set', 'Using Linear Activation Only'],
        correctIndex: 0,
        explanation: 'Dropout randomly deactivates neurons during training to prevent co-adaptation and improve model generalization.',
      },
    ],
  });
});

// Vite middleware for dev / static for prod
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CareerPath AI server running at http://localhost:${PORT}`);
  });
}

start();
