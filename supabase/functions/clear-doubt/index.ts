
import { corsHeaders } from '../_shared/cors.ts';

const apiKey = Deno.env.get('ONSPACE_AI_API_KEY');
const baseUrl = Deno.env.get('ONSPACE_AI_BASE_URL');

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question, subject, grade } = await req.json();

    if (!question || !subject || !grade) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: question, subject, grade' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const gradeLevel = grade === 'college' ? 'college level' : `grade ${grade}`;
    const complexity = grade === 'college' ? 'advanced, detailed explanations with technical terminology' : `simple language appropriate for ${gradeLevel}`;

    let computerCurriculum = '';
    if (subject === 'computer') {
      computerCurriculum = `

**COMPUTER SCIENCE CURRICULUM (Zero to Hero):**

**LEVEL 1: BASICS (Grades 1-4)**
• **What is a Computer?** - Parts, input/output, basic operations
• **Computer Hardware** - Monitor, keyboard, mouse, CPU, memory
• **Using a Computer** - Turning on/off, opening programs, saving files
• **Internet Basics** - What is internet, web browsers, searching safely
• **Digital Safety** - Passwords, stranger danger online, screen time

**LEVEL 2: FOUNDATION (Grades 5-7)**
• **Introduction to Coding** - What is programming, algorithms, sequences
• **Block-Based Programming** - Scratch, code.org visual programming
• **Problem Solving** - Breaking problems into steps, logical thinking
• **Basic Computer Science** - Binary numbers, how computers think
• **Digital Literacy** - Email, online research, file management
• **Typing Skills** - Touch typing, keyboard shortcuts

**LEVEL 3: INTERMEDIATE (Grades 8-10)**
• **Text-Based Programming** - Python basics, variables, data types
• **Control Structures** - If/else, loops (for, while), conditionals
• **Functions & Methods** - Creating reusable code, parameters, return values
• **Data Structures** - Lists, arrays, dictionaries, sets
• **Debugging** - Finding and fixing errors, testing code
• **Web Basics** - HTML, CSS, creating simple webpages
• **Computer Networks** - How internet works, IP addresses, DNS

**LEVEL 4: ADVANCED (Grades 11-12)**
• **Object-Oriented Programming** - Classes, objects, inheritance, encapsulation
• **Advanced Algorithms** - Sorting (bubble, merge, quick), searching (binary)
• **Recursion** - Recursive functions, base cases, recursive thinking
• **File Handling** - Reading/writing files, JSON, CSV
• **Database Basics** - SQL, tables, queries, relationships
• **Version Control** - Git, GitHub, collaboration
• **Web Development** - JavaScript, responsive design, frameworks basics

**LEVEL 5: PROFESSIONAL (College+)**
• **Advanced Data Structures** - Trees, graphs, hash tables, heaps
• **Algorithm Complexity** - Big O notation, time/space complexity
• **Artificial Intelligence** - Machine learning basics, neural networks
• **Mobile App Development** - React Native, iOS/Android development
• **Cloud Computing** - AWS, Azure, serverless architecture
• **Cybersecurity** - Encryption, authentication, security best practices
• **Software Engineering** - Design patterns, testing, CI/CD, DevOps
• **Advanced Topics** - Blockchain, IoT, quantum computing, AR/VR

When answering computer questions:
- Always use **bold headings** for main topics
- Start from the fundamentals, build up to complexity
- Use real-world analogies and examples
- Include practical applications and career connections
- Encourage hands-on practice with coding examples when relevant`;
    }

    const systemPrompt = `You are an educational AI tutor helping students understand ${subject} concepts. 
Your task is to explain concepts in a clear, easy-to-understand way suitable for ${gradeLevel} students.

Guidelines:
- Use ${complexity}
- Break down complex concepts into smaller parts
- Use relatable examples from everyday life
- Be encouraging and positive
- If the question is not related to ${subject}, politely guide them back to the subject
- Keep answers concise but complete (2-4 paragraphs maximum)
- **USE BOLD FORMATTING** for important headings and key terms
- Structure your answer with clear sections${computerCurriculum}`; // Removed the extra backtick and semicolon here


    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OnSpace AI Error:', errorText);
      return new Response(
        JSON.stringify({ error: `AI service error: ${errorText}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content ?? 'I could not generate an answer. Please try again.';

    return new Response(
      JSON.stringify({ answer }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in clear-doubt function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
