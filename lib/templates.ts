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
];
