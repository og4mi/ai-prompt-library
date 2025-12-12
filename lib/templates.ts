import type { Prompt } from "@/types";

export interface PromptTemplate {
  title: string;
  content: string;
  category: string;
  tags: string[];
  aiModel: Prompt["aiModel"];
  notes?: string;
}

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  // CODE CATEGORY (5 templates)
  {
    title: "Code Review",
    content: `Review the following code and provide feedback on:

1. **Code Quality**: Best practices, design patterns, and maintainability
2. **Potential Issues**: Bugs, security vulnerabilities, or edge cases
3. **Performance**: Optimization opportunities
4. **Readability**: Clear naming, comments, and structure

\`\`\`
[Insert your code here]
\`\`\`

Please provide specific, actionable suggestions.`,
    category: "Code",
    tags: ["code-review", "best-practices", "debugging"],
    aiModel: "Claude",
    notes: "Great for comprehensive code reviews",
  },
  {
    title: "Debug Assistant",
    content: `I'm encountering an error and need help debugging:

**Error Message:**
\`\`\`
[Paste error here]
\`\`\`

**Code Context:**
\`\`\`
[Paste relevant code]
\`\`\`

**What I've Tried:**
1. [Attempt 1]
2. [Attempt 2]

Please:
1. Explain the root cause
2. Provide step-by-step fix
3. Suggest prevention strategies
4. Show corrected code`,
    category: "Code",
    tags: ["debugging", "troubleshooting", "error-fixing"],
    aiModel: "ChatGPT",
    notes: "Essential for quick bug fixes",
  },
  {
    title: "API Integration",
    content: `Help me integrate with the following API:

**API:** [API name/endpoint]
**Documentation:** [Link or key details]
**Goal:** [What you're trying to achieve]

**Requirements:**
- [Requirement 1]
- [Requirement 2]

Please provide:
1. Sample code for the integration
2. Error handling best practices
3. Authentication/API key management
4. Example request/response
5. Testing recommendations`,
    category: "Code",
    tags: ["api", "integration", "backend"],
    aiModel: "Claude",
    notes: "Streamlines API integration",
  },
  {
    title: "Refactor Legacy Code",
    content: `I need to refactor this legacy code:

\`\`\`
[Paste legacy code]
\`\`\`

**Current Issues:**
- [Issue 1]
- [Issue 2]

**Goals:**
- Improve readability and maintainability
- Follow modern best practices
- Maintain backward compatibility
- Add proper error handling

Please provide:
1. Refactored version with explanations
2. Key improvements made
3. Migration strategy if needed`,
    category: "Code",
    tags: ["refactoring", "legacy-code", "modernization"],
    aiModel: "Claude",
    notes: "Perfect for code modernization",
  },
  {
    title: "Write Unit Tests",
    content: `Generate comprehensive unit tests for:

\`\`\`
[Paste your code/function]
\`\`\`

**Testing Framework:** [Jest/Mocha/PyTest/etc.]

Please create tests that cover:
1. Happy path scenarios
2. Edge cases
3. Error handling
4. Boundary conditions
5. Mock external dependencies

Include setup, teardown, and clear test descriptions.`,
    category: "Code",
    tags: ["testing", "unit-tests", "quality-assurance"],
    aiModel: "ChatGPT",
    notes: "Ensures code quality and reliability",
  },

  // WRITING CATEGORY (5 templates)
  {
    title: "Blog Post Outline",
    content: `Create a detailed blog post outline for: **[TOPIC]**

Target Audience: [Describe audience]
Desired Tone: [Professional/Casual/Technical/etc.]

Please include:
- 3-5 engaging title options
- Hook/Introduction
- 5-7 main sections with subpoints
- Key takeaways
- Call to action

Focus on providing value and actionable insights.`,
    category: "Writing",
    tags: ["blogging", "content-creation", "outline"],
    aiModel: "ChatGPT",
    notes: "Perfect for content planning",
  },
  {
    title: "Product Description",
    content: `Write a compelling product description for:

**Product Name:** [Name]
**Target Customer:** [Who is this for?]
**Key Features:**
- [Feature 1]
- [Feature 2]
- [Feature 3]

**Unique Value:** [What makes it special?]

Create a description that:
- Grabs attention with a strong hook
- Highlights benefits (not just features)
- Addresses customer pain points
- Includes a clear call-to-action
- Is 100-150 words, SEO-friendly`,
    category: "Writing",
    tags: ["copywriting", "marketing", "product"],
    aiModel: "ChatGPT",
    notes: "Perfect for e-commerce and marketing",
  },
  {
    title: "Social Media Post",
    content: `Create an engaging social media post for:

**Platform:** [Twitter/LinkedIn/Instagram/Facebook]
**Topic:** [What you're posting about]
**Goal:** [Engagement/Traffic/Awareness/Sales]
**Tone:** [Professional/Casual/Inspirational/etc.]

**Key Message:** [Main point]

Include:
- Attention-grabbing opening
- Value proposition or hook
- Relevant hashtags (3-5)
- Call-to-action
- Optional: Emoji usage for engagement`,
    category: "Writing",
    tags: ["social-media", "marketing", "engagement"],
    aiModel: "ChatGPT",
    notes: "Boost your social presence",
  },
  {
    title: "Press Release",
    content: `Write a professional press release:

**Company:** [Company name]
**Announcement:** [What's being announced]
**Date:** [Release date]

**Key Details:**
- Who is involved
- What is happening
- When it's happening
- Where it's taking place
- Why it matters

Include:
- Compelling headline
- Strong lead paragraph
- Supporting quotes
- Company boilerplate
- Media contact information

Keep it newsworthy and concise (400-500 words).`,
    category: "Writing",
    tags: ["press-release", "public-relations", "announcement"],
    aiModel: "Claude",
    notes: "Professional PR writing",
  },
  {
    title: "Technical Documentation",
    content: `Create clear technical documentation for:

**Feature/API/Tool:** [Name]
**Audience:** [Developers/End-users/Admins]

Please document:
1. **Overview:** What it does and why it's useful
2. **Getting Started:** Quick start guide
3. **Core Concepts:** Key terminology and concepts
4. **Usage Examples:** Common use cases with code
5. **API Reference:** Parameters, returns, errors
6. **Troubleshooting:** Common issues and solutions

Use clear language, code examples, and proper formatting.`,
    category: "Writing",
    tags: ["documentation", "technical-writing", "api-docs"],
    aiModel: "Claude",
    notes: "Essential for developer docs",
  },

  // ANALYSIS CATEGORY (5 templates)
  {
    title: "Data Analysis",
    content: `Analyze the following dataset:

**Data:**
[Insert or describe your data]

**Analysis Goals:**
[What insights are you looking for?]

Please provide:
1. Summary statistics
2. Key trends and patterns
3. Notable outliers or anomalies
4. Actionable insights and recommendations
5. Suggested visualizations

Format findings clearly with supporting evidence.`,
    category: "Analysis",
    tags: ["data-analysis", "statistics", "insights"],
    aiModel: "Claude",
    notes: "Excellent for business intelligence",
  },
  {
    title: "Competitive Analysis",
    content: `Perform a competitive analysis for:

**My Product/Service:** [Description]
**Competitors:**
1. [Competitor 1]
2. [Competitor 2]
3. [Competitor 3]

Analyze:
1. **Strengths & Weaknesses:** For each competitor
2. **Market Positioning:** How they position themselves
3. **Pricing Strategy:** Their pricing models
4. **Unique Features:** What sets them apart
5. **Gaps & Opportunities:** Where we can differentiate

Provide actionable recommendations for competitive advantage.`,
    category: "Analysis",
    tags: ["competitive-analysis", "market-research", "strategy"],
    aiModel: "Claude",
    notes: "Strategic business analysis",
  },
  {
    title: "SWOT Analysis",
    content: `Create a comprehensive SWOT analysis for:

**Company/Product/Project:** [Name]
**Context:** [Brief background]

Analyze:

**Strengths:**
- Internal positive factors
- Competitive advantages

**Weaknesses:**
- Internal challenges
- Areas for improvement

**Opportunities:**
- External positive factors
- Growth potential

**Threats:**
- External challenges
- Competitive risks

Provide strategic recommendations based on the analysis.`,
    category: "Analysis",
    tags: ["swot", "strategy", "business-analysis"],
    aiModel: "ChatGPT",
    notes: "Strategic planning tool",
  },
  {
    title: "Customer Feedback Analysis",
    content: `Analyze customer feedback and extract insights:

**Feedback Source:** [Reviews/Surveys/Support tickets/etc.]
**Sample Size:** [Number of responses]

**Feedback:**
[Paste customer feedback here]

Please identify:
1. **Common Themes:** Recurring topics/issues
2. **Sentiment Analysis:** Overall positive/negative/neutral
3. **Pain Points:** Key customer frustrations
4. **Feature Requests:** What customers want
5. **Priority Actions:** Top 3-5 recommendations

Present findings with supporting quotes.`,
    category: "Analysis",
    tags: ["customer-feedback", "sentiment-analysis", "insights"],
    aiModel: "Claude",
    notes: "Understand customer needs",
  },
  {
    title: "Financial Analysis",
    content: `Analyze the following financial data:

**Company/Project:** [Name]
**Time Period:** [Period]

**Financial Data:**
[Paste financial statements/metrics]

Analyze:
1. **Revenue Trends:** Growth patterns
2. **Profitability:** Margins and efficiency
3. **Cost Structure:** Major expense categories
4. **Key Ratios:** Liquidity, leverage, profitability
5. **Recommendations:** Financial health improvements

Highlight risks and opportunities.`,
    category: "Analysis",
    tags: ["financial-analysis", "business-metrics", "finance"],
    aiModel: "ChatGPT",
    notes: "Financial health assessment",
  },

  // CREATIVE CATEGORY (5 templates)
  {
    title: "Creative Story Opener",
    content: `Write an engaging opening for a **[GENRE]** story with these elements:

**Setting:** [Describe time and place]
**Theme:** [Main theme or message]
**Mood:** [Atmosphere you want to create]

The opening should:
- Hook the reader immediately
- Establish setting and mood vividly
- Introduce a compelling character or situation
- Hint at the central conflict
- Be approximately 150-200 words`,
    category: "Creative",
    tags: ["storytelling", "fiction", "creative-writing"],
    aiModel: "ChatGPT",
    notes: "Great for overcoming writer's block",
  },
  {
    title: "Character Development",
    content: `Create a detailed character profile:

**Character Role:** [Protagonist/Antagonist/Supporting]
**Story Genre:** [Genre]

Develop:
1. **Basic Info:** Name, age, appearance
2. **Personality:** Core traits, quirks, mannerisms
3. **Background:** History, formative experiences
4. **Motivation:** What drives them
5. **Flaws & Strengths:** Internal conflicts
6. **Relationships:** Key connections
7. **Character Arc:** How they change

Make them three-dimensional and memorable.`,
    category: "Creative",
    tags: ["character-development", "fiction", "writing"],
    aiModel: "Claude",
    notes: "Build compelling characters",
  },
  {
    title: "Brainstorm Creative Ideas",
    content: `Help me brainstorm creative ideas for:

**Project Type:** [Novel/Script/Campaign/Product/etc.]
**Topic/Theme:** [What it's about]
**Target Audience:** [Who it's for]

**Context:**
[Additional background]

Generate:
- 10-15 unique, creative concepts
- Mix of safe and bold ideas
- Brief explanation for each
- Highlight top 3 most promising

Think outside the box!`,
    category: "Creative",
    tags: ["brainstorming", "ideation", "creativity"],
    aiModel: "ChatGPT",
    notes: "Unlock creative possibilities",
  },
  {
    title: "Dialogue Writing",
    content: `Write engaging dialogue for this scene:

**Characters:** [Names and brief descriptions]
**Scene Context:** [What's happening]
**Scene Goal:** [What needs to be accomplished]
**Tone:** [Tense/Humorous/Romantic/etc.]

The dialogue should:
- Sound natural and character-specific
- Advance the plot or reveal character
- Include subtext where appropriate
- Balance dialogue with action beats
- Be approximately 200-300 words

Include minimal stage directions.`,
    category: "Creative",
    tags: ["dialogue", "screenwriting", "fiction"],
    aiModel: "Claude",
    notes: "Craft realistic conversations",
  },
  {
    title: "World Building",
    content: `Help me build a fictional world:

**Genre:** [Fantasy/Sci-Fi/etc.]
**Core Concept:** [What makes this world unique]

Develop:
1. **Geography:** Key locations and landmarks
2. **History:** Major events that shaped the world
3. **Culture:** Customs, beliefs, social structure
4. **Technology/Magic:** How things work
5. **Politics:** Power structures and conflicts
6. **Economy:** Resources and trade
7. **Unique Elements:** What sets it apart

Create a rich, coherent setting.`,
    category: "Creative",
    tags: ["world-building", "fantasy", "sci-fi"],
    aiModel: "ChatGPT",
    notes: "Build immersive fictional worlds",
  },

  // PRODUCTIVITY CATEGORY (5 templates)
  {
    title: "Meeting Summary",
    content: `Summarize this meeting into a professional memo:

**Meeting Date:** [Date]
**Attendees:** [Names]
**Duration:** [Time]

**Notes:**
[Paste your meeting notes here]

Create a summary including:
- **Key Decisions:** What was decided
- **Action Items:** Tasks, owners, deadlines
- **Discussion Points:** Important topics covered
- **Next Steps:** What happens next
- **Follow-up:** Any pending items

Format as a clear, scannable memo.`,
    category: "Productivity",
    tags: ["meetings", "summary", "action-items"],
    aiModel: "Claude",
    notes: "Saves hours of follow-up time",
  },
  {
    title: "Email Response",
    content: `Help me draft a professional email response:

**Context:** [Explain the situation]
**Tone Needed:** [Professional/Friendly/Formal/etc.]
**Key Points to Address:**
1. [Point 1]
2. [Point 2]
3. [Point 3]

**Desired Outcome:** [What do you want to achieve?]

Please write a clear, concise email that:
- Addresses all points professionally
- Maintains appropriate tone
- Includes a clear call-to-action
- Is well-structured and easy to read`,
    category: "Productivity",
    tags: ["email", "communication", "professional"],
    aiModel: "Claude",
    notes: "Useful for business communication",
  },
  {
    title: "Project Plan",
    content: `Create a detailed project plan for:

**Project Name:** [Name]
**Objective:** [What we're trying to achieve]
**Timeline:** [Duration]
**Team:** [Team members/roles]

Develop a plan including:
1. **Goals & Deliverables:** Clear objectives
2. **Milestones:** Key checkpoints
3. **Task Breakdown:** Specific action items
4. **Timeline:** Gantt-style schedule
5. **Resources:** What's needed
6. **Risks:** Potential issues and mitigation
7. **Success Metrics:** How to measure progress

Format as a comprehensive project roadmap.`,
    category: "Productivity",
    tags: ["project-management", "planning", "organization"],
    aiModel: "Claude",
    notes: "Streamline project execution",
  },
  {
    title: "Standard Operating Procedure",
    content: `Create a standard operating procedure (SOP) for:

**Process:** [Name of the process]
**Purpose:** [Why this process exists]
**Frequency:** [How often it's performed]

Document:
1. **Overview:** Process summary
2. **Prerequisites:** What's needed before starting
3. **Step-by-Step Instructions:** Detailed walkthrough
4. **Roles & Responsibilities:** Who does what
5. **Tools & Resources:** What's required
6. **Quality Checks:** Verification steps
7. **Troubleshooting:** Common issues and solutions

Make it clear enough for a new team member to follow.`,
    category: "Productivity",
    tags: ["sop", "documentation", "process"],
    aiModel: "ChatGPT",
    notes: "Standardize team processes",
  },
  {
    title: "Goal Setting Framework",
    content: `Help me set SMART goals for:

**Area:** [Personal/Professional/Project/etc.]
**Time Frame:** [Quarter/Year/etc.]

For each goal, ensure it's:
- **Specific:** Clearly defined
- **Measurable:** Quantifiable metrics
- **Achievable:** Realistic given resources
- **Relevant:** Aligned with bigger objectives
- **Time-bound:** Clear deadlines

Create 3-5 goals with:
1. Goal statement
2. Success metrics
3. Action steps
4. Timeline
5. Potential obstacles

Format as an actionable plan.`,
    category: "Productivity",
    tags: ["goal-setting", "planning", "smart-goals"],
    aiModel: "Claude",
    notes: "Achieve your objectives",
  },

  // IMAGE GENERATION CATEGORY (5 templates)
  {
    title: "Image Generation - Portrait",
    content: `Professional portrait photo, [SUBJECT DESCRIPTION], studio lighting, 85mm lens, shallow depth of field, sharp focus on eyes, natural skin tones, soft background blur, high detail, photorealistic, 8k resolution, professional photography`,
    category: "Image Generation",
    tags: ["portrait", "photography", "professional"],
    aiModel: "Midjourney",
    notes: "Adjust subject description for different portraits",
  },
  {
    title: "Image Generation - Landscape",
    content: `Breathtaking landscape photo, [LOCATION/SCENE], golden hour lighting, dramatic sky, vivid colors, highly detailed, award-winning photography, National Geographic style, wide angle, 8k resolution, professional composition`,
    category: "Image Generation",
    tags: ["landscape", "photography", "nature"],
    aiModel: "Stable Diffusion",
    notes: "Great for scenic and nature images",
  },
  {
    title: "Image Generation - Product Shot",
    content: `Professional product photography, [PRODUCT], clean white background, studio lighting, perfectly centered, sharp focus, commercial photography, high-end advertising style, detailed texture, 8k resolution, professional composition, no shadows, minimalist aesthetic`,
    category: "Image Generation",
    tags: ["product", "photography", "commercial"],
    aiModel: "Midjourney",
    notes: "Perfect for e-commerce",
  },
  {
    title: "Image Generation - Illustration",
    content: `[STYLE] illustration of [SUBJECT], [COLOR PALETTE], vector art, clean lines, professional design, trending on Dribbble, modern aesthetic, high detail, digital art, smooth gradients, perfect composition

Style options: flat design, isometric, hand-drawn, minimalist, vintage, cyberpunk, watercolor`,
    category: "Image Generation",
    tags: ["illustration", "vector", "design"],
    aiModel: "DALL-E",
    notes: "Versatile illustration styles",
  },
  {
    title: "Image Generation - Logo Design",
    content: `Minimalist logo design for [COMPANY/BRAND], [INDUSTRY], simple geometric shapes, clean lines, modern aesthetic, professional, scalable vector, monochrome with accent color [COLOR], negative space, memorable icon, brand identity, trending design, 4k resolution

Style: modern, minimal, timeless, professional`,
    category: "Image Generation",
    tags: ["logo", "branding", "design"],
    aiModel: "Midjourney",
    notes: "Clean, professional logo concepts",
  },
];
