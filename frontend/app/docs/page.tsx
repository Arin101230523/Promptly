'use client';
import React, { useState } from 'react';
import { Book, Code, Zap, Settings, Users, Copy, CheckCircle, ExternalLink, Search, X } from 'lucide-react';

import Navigation from '../../components/landing/Navigation';
import Footer from '../../components/landing/Footer';


const CodeBlock: React.FC<{ children: string; language?: string }> = ({ children, language = 'javascript' }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-gray-900/50 rounded-lg border border-white/10 text-xs sm:text-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-2 sm:px-4 py-2 border-b border-white/10 gap-2 sm:gap-0">
        <span className="text-xs sm:text-sm text-gray-400">{language}</span>
        <button
          onClick={copyToClipboard}
          className="flex items-center space-x-1 text-xs sm:text-sm text-gray-400 hover:text-white transition-colors"
        >
          {copied ? <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" /> : <Copy className="w-3 h-3 sm:w-4 sm:h-4" />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <pre className="p-2 sm:p-4 overflow-x-auto">
        <code className="text-xs sm:text-sm text-gray-300">{children}</code>
      </pre>
    </div>
  );
};

const Docs = () => {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('getting-started');
  const [searchTerm, setSearchTerm] = useState('');

  const sections = [
    { id: 'getting-started', title: 'Getting Started', icon: Zap },
    { id: 'authentication', title: 'Authentication', icon: Settings },
    { id: 'api-reference', title: 'API Reference', icon: Code },
    { id: 'examples', title: 'Examples', icon: Book },
    { id: 'community', title: 'Community', icon: Users },
  ];

  // Filter sections by search term
  const filteredSections = searchTerm.trim()
    ? sections.filter(section => section.title.toLowerCase().includes(searchTerm.trim().toLowerCase()))
    : sections;

  const renderContent = () => {
    switch (activeSection) {
      case 'getting-started':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-orange-300 mb-4">Getting Started (Work In Progress)</h2>
              <p className="text-xl text-gray-300 mb-6">Welcome to Promptly! This guide will help you get up and running in minutes.</p>
            </div>

            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-2xl font-semibold text-blue-200 mb-4">Quick Setup</h3>
              <div className="space-y-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-100 mb-2">1. Create Your Account</h4>
                  <p className="text-gray-300 text-sm">Sign up for a free Promptly account to get started with prompt management and API access.</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-100 mb-2">2. Get Your API Key</h4>
                  <p className="text-gray-300 text-sm">Navigate to your dashboard and generate your first API key for authentication.</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-100 mb-2">3. Make Your First Request</h4>
                  <p className="text-gray-300 text-sm">Use our simple REST API to create and manage your prompts programmatically.</p>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-purple-500 pl-6">
              <h3 className="text-2xl font-semibold text-purple-200 mb-4">Installation</h3>
              <p className="text-gray-300 mb-4">Install our SDK for your preferred programming language:</p>
              <div className="space-y-4">
                <CodeBlock language="bash">
npm install @promptly/sdk
</CodeBlock>
                <CodeBlock language="python">
pip install promptly-sdk
</CodeBlock>
                <CodeBlock language="bash">
go get github.com/promptly/go-sdk
</CodeBlock>
              </div>
            </div>

            <div className="border-l-4 border-green-500 pl-6">
              <h3 className="text-2xl font-semibold text-green-200 mb-4">Your First Prompt</h3>
              <p className="text-gray-300 mb-4">Here&#39;s how to create and execute your first prompt:</p>
              <CodeBlock language="javascript">
{`import { Promptly } from '@promptly/sdk';

const client = new Promptly({
  apiKey: 'your-api-key-here'
});

// Create a new prompt
const prompt = await client.prompts.create({
  name: 'Welcome Message',
  template: 'Hello {{name}}, welcome to {{platform}}!',
  variables: ['name', 'platform']
});

// Execute the prompt
const result = await client.prompts.execute(prompt.id, {
  name: 'John',
  platform: 'Promptly'
});

console.log(result.output); // "Hello John, welcome to Promptly!"
`}</CodeBlock>
            </div>
          </div>
        );

      case 'authentication':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-green-300 mb-4">Authentication</h2>
              <p className="text-xl text-gray-300 mb-6">Learn how to authenticate your requests and manage API keys securely.</p>
            </div>

            <div className="border-l-4 border-green-500 pl-6">
              <h3 className="text-2xl font-semibold text-green-200 mb-4">API Key Authentication</h3>
              <p className="text-gray-300 mb-4">All API requests require authentication using your API key in the Authorization header:</p>
              <CodeBlock language="bash">
{`curl -X GET "https://api.promptly.com/v1/prompts" \\
  -H "Authorization: Bearer your-api-key-here" \\
  -H "Content-Type: application/json"
`}</CodeBlock>
            </div>

            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-2xl font-semibold text-blue-200 mb-4">Managing API Keys</h3>
              <div className="space-y-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-100 mb-2">Creating API Keys</h4>
                  <p className="text-gray-300 text-sm mb-2">Generate new API keys from your dashboard:</p>
                  <ol className="list-decimal list-inside text-sm text-gray-300 space-y-1">
                    <li>Navigate to Settings → API Keys</li>
                    <li>Click &quot;Generate New Key&quot;</li>
                    <li>Give your key a descriptive name</li>
                    <li>Set appropriate permissions</li>
                    <li>Copy and store your key securely</li>
                  </ol>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-100 mb-2">Key Permissions</h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="text-sm">
                      <p className="font-medium text-green-300">Read Permissions:</p>
                      <ul className="text-gray-300 space-y-1">
                        <li>• View prompts</li>
                        <li>• Execute prompts</li>
                        <li>• Access analytics</li>
                      </ul>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-orange-300">Write Permissions:</p>
                      <ul className="text-gray-300 space-y-1">
                        <li>• Create prompts</li>
                        <li>• Update prompts</li>
                        <li>• Delete prompts</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-orange-500 pl-6">
              <h3 className="text-2xl font-semibold text-orange-200 mb-4">Security Best Practices</h3>
              <div className="grid gap-4">
                <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg p-4 border border-orange-500/30">
                  <h4 className="font-semibold text-orange-100 mb-2">🔒 Keep Keys Secure</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Never commit API keys to version control</li>
                    <li>• Use environment variables for key storage</li>
                    <li>• Rotate keys regularly</li>
                    <li>• Use different keys for different environments</li>
                  </ul>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-100 mb-2">Environment Variables</h4>
                  <CodeBlock language="bash">
{`# .env file
PROMPTLY_API_KEY=your-api-key-here
PROMPTLY_BASE_URL=https://api.promptly.com/v1
`}</CodeBlock>
                </div>
              </div>
            </div>
          </div>
        );

      case 'api-reference':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-purple-300 mb-4">API Reference</h2>
              <p className="text-xl text-gray-300 mb-6">Complete reference for all Promptly API endpoints and methods.</p>
            </div>

            <div className="border-l-4 border-purple-500 pl-6">
              <h3 className="text-2xl font-semibold text-purple-200 mb-4">Base URL</h3>
              <CodeBlock language="text">
https://api.promptly.com/v1
              </CodeBlock>
            </div>

            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-2xl font-semibold text-blue-200 mb-4">Prompts Endpoints</h3>
              <div className="space-y-6">
                <div className="bg-white/5 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-blue-100">GET /prompts</h4>
                    <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-sm">GET</span>
                  </div>
                  <p className="text-gray-300 mb-4">Retrieve all prompts for your account.</p>
                  <CodeBlock language="bash">
{`curl -X GET "https://api.promptly.com/v1/prompts" \\
  -H "Authorization: Bearer your-api-key"
`}</CodeBlock>
                  <div className="mt-4">
                    <h5 className="font-medium text-blue-200 mb-2">Response:</h5>
                    <CodeBlock language="json">
{`{
  "prompts": [
    {
      "id": "prompt_123",
      "name": "Welcome Message",
      "template": "Hello {{name}}!",
      "variables": ["name"],
      "created_at": "2025-01-01T00:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "per_page": 20
}`}</CodeBlock>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-blue-100">POST /prompts</h4>
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-sm">POST</span>
                  </div>
                  <p className="text-gray-300 mb-4">Create a new prompt.</p>
                  <CodeBlock language="bash">
{`curl -X POST "https://api.promptly.com/v1/prompts" \\
  -H "Authorization: Bearer your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Greeting",
    "template": "Hello {{name}}, welcome to {{platform}}!",
    "variables": ["name", "platform"]
  }'
`}</CodeBlock>
                </div>

                <div className="bg-white/5 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-blue-100">POST /prompts/:id/execute</h4>
                    <span className="px-2 py-1 bg-orange-500/20 text-orange-300 rounded text-sm">POST</span>
                  </div>
                  <p className="text-gray-300 mb-4">Execute a prompt with variables.</p>
                  <CodeBlock language="bash">
{`curl -X POST "https://api.promptly.com/v1/prompts/prompt_123/execute" \\
  -H "Authorization: Bearer your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "variables": {
      "name": "John",
      "platform": "Promptly"
    }
  }'
`}</CodeBlock>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-green-500 pl-6">
              <h3 className="text-2xl font-semibold text-green-200 mb-4">Error Handling</h3>
              <p className="text-gray-300 mb-4">The API uses conventional HTTP response codes to indicate success or failure:</p>
              <div className="grid gap-3">
                <div className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                  <span className="font-medium">200 - OK</span>
                  <span className="text-green-300">Success</span>
                </div>
                <div className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                  <span className="font-medium">400 - Bad Request</span>
                  <span className="text-orange-300">Invalid request</span>
                </div>
                <div className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                  <span className="font-medium">401 - Unauthorized</span>
                  <span className="text-red-300">Invalid API key</span>
                </div>
                <div className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                  <span className="font-medium">429 - Too Many Requests</span>
                  <span className="text-yellow-300">Rate limit exceeded</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'examples':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-orange-300 mb-4">Examples</h2>
              <p className="text-xl text-gray-300 mb-6">Real-world examples and use cases to help you get the most out of Promptly.</p>
            </div>

            <div className="border-l-4 border-orange-500 pl-6">
              <h3 className="text-2xl font-semibold text-orange-200 mb-4">Email Templates</h3>
              <p className="text-gray-300 mb-4">Create dynamic email templates with personalized content:</p>
              <CodeBlock language="javascript">
{`// Create an email welcome template
const emailTemplate = await client.prompts.create({
  name: 'Welcome Email',
  template: \`
Subject: Welcome to {{company_name}}, {{first_name}}!

Hi {{first_name}},

Welcome to {{company_name}}! We're excited to have you on board.

Your account details:
- Email: {{email}}
- Plan: {{subscription_plan}}
- Start Date: {{start_date}}

Best regards,
The {{company_name}} Team
  \`,
  variables: ['first_name', 'company_name', 'email', 'subscription_plan', 'start_date']
});

// Execute the template
const welcomeEmail = await client.prompts.execute(emailTemplate.id, {
  first_name: 'Sarah',
  company_name: 'Promptly',
  email: 'sarah@example.com',
  subscription_plan: 'Pro',
  start_date: '2025-01-15'
});
`}</CodeBlock>
            </div>

            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-2xl font-semibold text-blue-200 mb-4">Chatbot Responses</h3>
              <p className="text-gray-300 mb-4">Build intelligent chatbot responses with context:</p>
              <CodeBlock language="python">
{`import promptly

client = promptly.Client(api_key="your-api-key")

# Create a customer support response template
support_template = client.prompts.create(
    name="Customer Support Response",
    template="""
Hello {{customer_name}},

Thank you for contacting us about {{issue_type}}.

{{#if priority == "high"}}
We understand this is urgent and will prioritize your request.
{{/if}}

Based on your description: "{{customer_message}}"

Here's how we can help:
{{solution_steps}}

If you need further assistance, please don't hesitate to reach out.

Best regards,
{{agent_name}}
Customer Support Team
    """,
    variables=["customer_name", "issue_type", "priority", "customer_message", "solution_steps", "agent_name"]
)

# Generate a response
response = client.prompts.execute(support_template.id, {
    "customer_name": "Alex Johnson",
    "issue_type": "billing inquiry",
    "priority": "high",
    "customer_message": "I was charged twice for my subscription",
    "solution_steps": "1. We'll investigate the duplicate charge\\n2. Process a refund within 3-5 business days\\n3. Send you a confirmation email",
    "agent_name": "Mike"
})
`}</CodeBlock>
            </div>

            <div className="border-l-4 border-green-500 pl-6">
              <h3 className="text-2xl font-semibold text-green-200 mb-4">Content Generation</h3>
              <p className="text-gray-300 mb-4">Generate blog posts, social media content, and marketing copy:</p>
              <CodeBlock language="javascript">
{`// Blog post outline generator
const blogOutline = await client.prompts.create({
  name: 'Blog Post Outline',
  template: \`
# {{title}}

## Introduction
{{introduction_hook}}

## Main Points
{{#each main_points}}
### {{this.heading}}
{{this.description}}

{{/each}}

## Conclusion
{{conclusion_summary}}

---
Target Audience: {{target_audience}}
Word Count: {{word_count}}
SEO Keywords: {{seo_keywords}}
  \`,
  variables: ['title', 'introduction_hook', 'main_points', 'conclusion_summary', 'target_audience', 'word_count', 'seo_keywords']
});

// Generate a tech blog outline
const outline = await client.prompts.execute(blogOutline.id, {
  title: 'The Future of AI in Web Development',
  introduction_hook: 'Artificial Intelligence is revolutionizing how we build and interact with websites.',
  main_points: [
    {
      heading: 'AI-Powered Code Generation',
      description: 'How AI tools are helping developers write better code faster.'
    },
    {
      heading: 'Intelligent User Experiences',
      description: 'Creating personalized and adaptive web interfaces.'
    },
    {
      heading: 'Automated Testing and Optimization',
      description: 'Using AI to improve website performance and reliability.'
    }
  ],
  conclusion_summary: 'AI will continue to transform web development, making it more efficient and user-focused.',
  target_audience: 'Web developers and tech enthusiasts',
  word_count: '1500-2000 words',
  seo_keywords: 'AI web development, artificial intelligence, code generation'
});
`}</CodeBlock>
            </div>

            <div className="border-l-4 border-purple-500 pl-6">
              <h3 className="text-2xl font-semibold text-purple-200 mb-4">API Integration</h3>
              <p className="text-gray-300 mb-4">Integrate Promptly with your existing applications:</p>
              <CodeBlock language="javascript">
{`// Express.js integration example
const express = require('express');
const { Promptly } = require('@promptly/sdk');

const app = express();
const promptly = new Promptly({ apiKey: process.env.PROMPTLY_API_KEY });

app.use(express.json());

// Endpoint to generate personalized notifications
app.post('/api/notifications', async (req, res) => {
  try {
    const { userId, notificationType, data } = req.body;
    
    // Get the appropriate template
    const template = await promptly.prompts.findByName(\`notification_\${notificationType}\`);
    
    // Generate the notification
    const notification = await promptly.prompts.execute(template.id, {
      user_name: data.userName,
      action: data.action,
      timestamp: new Date().toISOString(),
      ...data
    });
    
    res.json({
      success: true,
      notification: notification.output
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
`}</CodeBlock>
            </div>
          </div>
        );

      case 'community':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-pink-300 mb-4">Community</h2>
              <p className="text-xl text-gray-300 mb-6">Join our growing community of developers and prompt engineers.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="border-l-4 border-pink-500 pl-6">
                <h3 className="text-2xl font-semibold text-pink-200 mb-4">Connect With Us</h3>
                <div className="space-y-4">
                  <a href="#" className="flex items-center space-x-3 bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <ExternalLink className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-pink-100">Discord Server</h4>
                      <p className="text-sm text-gray-400">Join our Discord for real-time discussions</p>
                    </div>
                  </a>
                  <a href="#" className="flex items-center space-x-3 bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                      <ExternalLink className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-pink-100">GitHub</h4>
                      <p className="text-sm text-gray-400">Contribute to our open-source projects</p>
                    </div>
                  </a>
                  <a href="#" className="flex items-center space-x-3 bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <ExternalLink className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-pink-100">Community Forum</h4>
                      <p className="text-sm text-gray-400">Ask questions and share knowledge</p>
                    </div>
                  </a>
                </div>
              </div>

              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="text-2xl font-semibold text-blue-200 mb-4">Resources</h3>
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-100 mb-2">📚 Tutorials</h4>
                    <p className="text-sm text-gray-300">Step-by-step guides for common use cases</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-100 mb-2">🎥 Video Guides</h4>
                    <p className="text-sm text-gray-300">Watch our YouTube channel for video tutorials</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-100 mb-2">📖 Blog</h4>
                    <p className="text-sm text-gray-300">Latest updates, tips, and best practices</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-100 mb-2">🔧 Tools</h4>
                    <p className="text-sm text-gray-300">Community-built tools and integrations</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-green-500 pl-6">
              <h3 className="text-2xl font-semibold text-green-200 mb-4">Contributing</h3>
              <p className="text-gray-300 mb-4">Help us improve Promptly and build the future of prompt management:</p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-lg p-4 text-center">
                  <Code className="w-8 h-8 mx-auto mb-3 text-green-400" />
                  <h4 className="font-semibold text-green-100 mb-2">Code</h4>
                  <p className="text-sm text-gray-300">Contribute to our SDKs and tools</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 text-center">
                  <Book className="w-8 h-8 mx-auto mb-3 text-green-400" />
                  <h4 className="font-semibold text-green-100 mb-2">Documentation</h4>
                  <p className="text-sm text-gray-300">Help improve our docs and guides</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 text-center">
                  <Users className="w-8 h-8 mx-auto mb-3 text-green-400" />
                  <h4 className="font-semibold text-green-100 mb-2">Community</h4>
                  <p className="text-sm text-gray-300">Help other users and share knowledge</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-950 via-purple-900 to-blue-900 text-white">
      <Navigation />

  <div className="flex-1 flex flex-col lg:flex-row pt-16">
        {/* Sidebar for desktop */}
        <div className="hidden lg:block lg:static lg:inset-0 w-64 bg-black/20 backdrop-blur-xl border-r border-white/10">
          <div className="p-4 sm:p-6">
            <div className="relative mb-4 sm:mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search docs..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
              />
            </div>
            <nav className="space-y-1 sm:space-y-2">
              {filteredSections.length === 0 ? (
                <div className="text-orange-400 px-3 py-2">No matching docs found.</div>
              ) : (
                filteredSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => {
                        setActiveSection(section.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-2 rounded-lg text-left transition-colors text-xs sm:text-base ${
                        activeSection === section.id
                          ? 'bg-blue-500/20 text-orange-300 border border-orange-500/30'
                          : 'text-gray-300 hover:text-orange-300 hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>{section.title}</span>
                    </button>
                  );
                })
              )}
            </nav>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed top-16 left-0 right-0 z-50 w-full h-[calc(100vh-4rem)] bg-black/20 backdrop-blur-xl border-r border-white/10 lg:hidden">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h2 className="text-lg font-bold text-white">Documentation</h2>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="w-5 h-5 text-gray-400 cursor-pointer" />
              </button>
            </div>
            <div className="p-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search docs..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs"
                />
              </div>
              <nav className="space-y-1">
                {filteredSections.length === 0 ? (
                  <div className="text-gray-400 px-3 py-2">No matching docs found.</div>
                ) : (
                  filteredSections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => {
                          setActiveSection(section.id);
                          setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center space-x-2 px-2 py-2 rounded-lg text-left transition-colors text-xs ${
                          activeSection === section.id
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'text-gray-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{section.title}</span>
                      </button>
                    );
                  })
                )}
              </nav>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <div className="lg:hidden p-2 sm:p-4 border-b border-white/10">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex items-center space-x-2 text-gray-300 hover:text-white text-base cursor-pointer"
            >
              <Search className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>Search</span>
            </button>
          </div>

          <main className="max-w-full sm:max-w-4xl mx-auto py-4 sm:py-8 px-2 sm:px-6">
            {renderContent()}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Docs;