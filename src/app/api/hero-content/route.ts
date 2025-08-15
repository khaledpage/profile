import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const heroContent = {
  de: {
    title: "Willkommen in meinem Portfolio",
    subtitle: "Kreative Webentwicklung & Digitale Lösungen",
    description: "Als leidenschaftlicher Full-Stack-Entwickler erschaffe ich innovative digitale Erlebnisse, die Menschen begeistern und Unternehmen voranbringen.",
    primaryButton: {
      text: "Projekte ansehen",
      link: "#projects"
    },
    secondaryButton: {
      text: "Kontakt aufnehmen",
      link: "#contact"
    }
  },
  en: {
    title: "Welcome to my Portfolio",
    subtitle: "Creative Web Development & Digital Solutions",
    description: "As a passionate Full-Stack Developer, I create innovative digital experiences that inspire people and advance businesses.",
    primaryButton: {
      text: "View Projects",
      link: "#projects"
    },
    secondaryButton: {
      text: "Get in Touch",
      link: "#contact"
    }
  }
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'de';
    
    // Try to load from file first
    try {
      const contentPath = path.join(process.cwd(), 'src/content/hero-i18n.json');
      const fileContent = fs.readFileSync(contentPath, 'utf8');
      const parsed = JSON.parse(fileContent);
      
      if (parsed[lang]) {
        return NextResponse.json(parsed[lang]);
      }
    } catch {
      // Fallback to hardcoded content
    }
    
    // Return hardcoded content or default
    const content = heroContent[lang as keyof typeof heroContent] || heroContent.de;
    
    return NextResponse.json(content);
  } catch (error) {
    console.error('Hero content API error:', error);
    return NextResponse.json(heroContent.de);
  }
}
