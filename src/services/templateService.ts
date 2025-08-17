/**
 * Article Template Service
 * 
 * This service manages article templates for consistent content creation.
 * Templates provide predefined structures for different types of articles.
 */

export interface ArticleTemplate {
  id: string;
  name: string;
  category: 'tutorial' | 'review' | 'case-study' | 'news' | 'documentation' | 'custom';
  description: string;
  content: string;
  metadata: {
    title: string;
    excerpt: string;
    tags: string[];
    category: string;
    featured?: boolean;
    readingTime?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export class TemplateService {
  private static readonly STORAGE_KEY = 'article-templates';
  private static readonly CATEGORIES_KEY = 'template-categories';

  /**
   * Get predefined template categories
   */
  static getCategories(): TemplateCategory[] {
    return [
      {
        id: 'tutorial',
        name: 'Tutorial',
        description: 'Step-by-step instructional content',
        icon: '🎓'
      },
      {
        id: 'review',
        name: 'Review',
        description: 'Product or service evaluations',
        icon: '⭐'
      },
      {
        id: 'case-study',
        name: 'Case Study',
        description: 'Detailed analysis and examples',
        icon: '📊'
      },
      {
        id: 'news',
        name: 'News',
        description: 'Current events and announcements',
        icon: '📰'
      },
      {
        id: 'documentation',
        name: 'Documentation',
        description: 'Technical documentation and guides',
        icon: '📚'
      },
      {
        id: 'custom',
        name: 'Custom',
        description: 'User-created templates',
        icon: '🎨'
      }
    ];
  }

  /**
   * Get all available templates
   */
  static getAllTemplates(): ArticleTemplate[] {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    const customTemplates = saved ? JSON.parse(saved) : [];
    
    return [
      ...this.getPredefinedTemplates(),
      ...customTemplates.map((t: any) => ({
        ...t,
        createdAt: new Date(t.createdAt),
        updatedAt: new Date(t.updatedAt)
      }))
    ];
  }

  /**
   * Get templates by category
   */
  static getTemplatesByCategory(category: string): ArticleTemplate[] {
    return this.getAllTemplates().filter(template => template.category === category);
  }

  /**
   * Get a specific template by ID
   */
  static getTemplate(id: string): ArticleTemplate | null {
    const templates = this.getAllTemplates();
    return templates.find(template => template.id === id) || null;
  }

  /**
   * Save a new custom template
   */
  static saveTemplate(template: Omit<ArticleTemplate, 'id' | 'createdAt' | 'updatedAt'>): ArticleTemplate {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    const customTemplates = saved ? JSON.parse(saved) : [];
    
    const newTemplate: ArticleTemplate = {
      ...template,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    customTemplates.push(newTemplate);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(customTemplates));
    
    return newTemplate;
  }

  /**
   * Update an existing template
   */
  static updateTemplate(id: string, updates: Partial<ArticleTemplate>): ArticleTemplate | null {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    const customTemplates = saved ? JSON.parse(saved) : [];
    
    const index = customTemplates.findIndex((t: any) => t.id === id);
    if (index === -1) return null;

    customTemplates[index] = {
      ...customTemplates[index],
      ...updates,
      updatedAt: new Date()
    };

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(customTemplates));
    return customTemplates[index];
  }

  /**
   * Delete a custom template
   */
  static deleteTemplate(id: string): boolean {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    const customTemplates = saved ? JSON.parse(saved) : [];
    
    const filteredTemplates = customTemplates.filter((t: any) => t.id !== id);
    
    if (filteredTemplates.length === customTemplates.length) {
      return false; // Template not found
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredTemplates));
    return true;
  }

  /**
   * Create article from template
   */
  static createArticleFromTemplate(templateId: string, customizations?: {
    title?: string;
    slug?: string;
    tags?: string[];
    category?: string;
  }): { content: string; metadata: any } | null {
    const template = this.getTemplate(templateId);
    if (!template) return null;

    const metadata = {
      ...template.metadata,
      ...(customizations?.title && { title: customizations.title }),
      ...(customizations?.tags && { tags: customizations.tags }),
      ...(customizations?.category && { category: customizations.category }),
      slug: customizations?.slug || this.slugify(customizations?.title || template.metadata.title),
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return {
      content: template.content,
      metadata
    };
  }

  /**
   * Get predefined templates
   */
  private static getPredefinedTemplates(): ArticleTemplate[] {
    return [
      {
        id: 'tutorial-basic',
        name: 'Basic Tutorial',
        category: 'tutorial',
        description: 'Standard tutorial template with sections for introduction, steps, and conclusion',
        content: `# {{title}}

## Introduction

{{introduction}}

## Prerequisites

Before starting this tutorial, make sure you have:

- Prerequisite 1
- Prerequisite 2
- Prerequisite 3

## Step-by-Step Guide

### Step 1: {{step1_title}}

{{step1_content}}

### Step 2: {{step2_title}}

{{step2_content}}

### Step 3: {{step3_title}}

{{step3_content}}

## Troubleshooting

Common issues and solutions:

**Issue 1**: Problem description
**Solution**: Solution description

**Issue 2**: Problem description
**Solution**: Solution description

## Conclusion

{{conclusion}}

## Additional Resources

- [Resource 1](https://example.com)
- [Resource 2](https://example.com)
- [Resource 3](https://example.com)
`,
        metadata: {
          title: 'Tutorial Template',
          excerpt: 'A comprehensive tutorial guide',
          tags: ['tutorial', 'guide', 'how-to'],
          category: 'Tutorial',
          readingTime: 10
        },
        createdAt: new Date('2025-08-16'),
        updatedAt: new Date('2025-08-16')
      },
      {
        id: 'review-product',
        name: 'Product Review',
        category: 'review',
        description: 'Template for reviewing products or services',
        content: `# {{product_name}} Review

## Overview

{{overview}}

## Key Features

### Feature 1: {{feature1_name}}
{{feature1_description}}

### Feature 2: {{feature2_name}}
{{feature2_description}}

### Feature 3: {{feature3_name}}
{{feature3_description}}

## Pros and Cons

### Pros ✅
- Pro 1
- Pro 2
- Pro 3

### Cons ❌
- Con 1
- Con 2
- Con 3

## Performance

{{performance_analysis}}

## Pricing

{{pricing_information}}

## Comparison

How does {{product_name}} compare to alternatives?

| Feature | {{product_name}} | Alternative 1 | Alternative 2 |
|---------|------------------|---------------|---------------|
| Feature 1 | ✅ | ❌ | ✅ |
| Feature 2 | ✅ | ✅ | ❌ |
| Feature 3 | ❌ | ✅ | ✅ |

## Final Verdict

**Rating**: ⭐⭐⭐⭐⭐ (X/5)

{{final_thoughts}}

## Who Should Use This?

{{target_audience}}
`,
        metadata: {
          title: 'Product Review Template',
          excerpt: 'Comprehensive product evaluation',
          tags: ['review', 'product', 'evaluation'],
          category: 'Review',
          readingTime: 8
        },
        createdAt: new Date('2025-08-16'),
        updatedAt: new Date('2025-08-16')
      },
      {
        id: 'case-study-analysis',
        name: 'Case Study Analysis',
        category: 'case-study',
        description: 'Template for detailed case study analysis',
        content: `# Case Study: {{case_title}}

## Executive Summary

{{executive_summary}}

## Background

### The Challenge
{{challenge_description}}

### The Context
{{context_information}}

## Methodology

{{methodology_description}}

## Implementation

### Phase 1: {{phase1_title}}
{{phase1_description}}

### Phase 2: {{phase2_title}}
{{phase2_description}}

### Phase 3: {{phase3_title}}
{{phase3_description}}

## Results

### Key Metrics
- Metric 1: {{metric1_result}}
- Metric 2: {{metric2_result}}
- Metric 3: {{metric3_result}}

### Quantitative Results
{{quantitative_results}}

### Qualitative Results
{{qualitative_results}}

## Lessons Learned

### What Worked Well
- Success point 1
- Success point 2
- Success point 3

### Challenges Faced
- Challenge 1
- Challenge 2
- Challenge 3

### Key Takeaways
{{key_takeaways}}

## Recommendations

{{recommendations}}

## Conclusion

{{conclusion}}
`,
        metadata: {
          title: 'Case Study Template',
          excerpt: 'Detailed analysis and findings',
          tags: ['case-study', 'analysis', 'research'],
          category: 'Case Study',
          readingTime: 12
        },
        createdAt: new Date('2025-08-16'),
        updatedAt: new Date('2025-08-16')
      }
    ];
  }

  /**
   * Generate unique ID for templates
   */
  private static generateId(): string {
    return 'template-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Convert string to URL-friendly slug
   */
  private static slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
