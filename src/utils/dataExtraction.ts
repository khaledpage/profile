// Simple data extraction using static data for client-side usage
export async function extractPersonalData(): Promise<any> {
  try {
    return {
      basic: {
        name: "Khaled Alabsi",
        title: "Full-Stack Developer",
        email: "khaled@example.com",
        phone: "+49 123 456789",
        location: "Germany"
      },
      summary: {
        en: "Passionate developer with expertise in modern web technologies, creating scalable and user-friendly applications with React, Next.js, and TypeScript.",
        de: "Leidenschaftlicher Entwickler mit Expertise in modernen Web-Technologien, der skalierbare und benutzerfreundliche Anwendungen mit React, Next.js und TypeScript erstellt."
      },
      stats: {
        experience: "5+",
        projects: "40+",
        techFocus: "React/Next.js",
        location: "Remote"
      }
    };
  } catch (error) {
    console.error('Error extracting personal data:', error);
    return null;
  }
}

export async function extractExperienceData(): Promise<any> {
  try {
    return {
      experience: [
        {
          role: "Senior Full-Stack Developer",
          company: "Tech Innovation GmbH",
          period: "2021 - Present",
          description: {
            en: "Lead development of modern web applications using React, Next.js, and TypeScript. Architected scalable solutions and mentored junior developers.",
            de: "Leitung der Entwicklung moderner Webanwendungen mit React, Next.js und TypeScript. Architektur skalierbarer Lösungen und Mentoring von Junior-Entwicklern."
          }
        },
        {
          role: "Frontend Developer", 
          company: "Digital Solutions AG",
          period: "2019 - 2021",
          description: {
            en: "Developed responsive user interfaces and optimized application performance. Collaborated with design teams to implement pixel-perfect designs.",
            de: "Entwicklung responsiver Benutzeroberflächen und Optimierung der Anwendungsleistung. Zusammenarbeit mit Design-Teams zur Umsetzung pixelgenauer Designs."
          }
        }
      ]
    };
  } catch (error) {
    console.error('Error extracting experience data:', error);
    return null;
  }
}

export async function extractEducationData(): Promise<any> {
  try {
    return {
      degrees: [
        {
          title: "Master of Computer Science",
          institution: "Technical University",
          year: "2019",
          description: {
            en: "Specialized in Software Engineering and Web Technologies",
            de: "Spezialisierung auf Software Engineering und Web-Technologien"
          }
        }
      ]
    };
  } catch (error) {
    console.error('Error extracting education data:', error);
    return null;
  }
}

export async function extractSkillsData(): Promise<any> {
  try {
    return {
      technical: [
        { name: "React", level: "Expert", years: 4 },
        { name: "Next.js", level: "Expert", years: 3 },
        { name: "TypeScript", level: "Advanced", years: 3 },
        { name: "Node.js", level: "Advanced", years: 4 }
      ],
      soft: [
        { name: "Team Leadership", level: "Advanced" },
        { name: "Project Management", level: "Intermediate" },
        { name: "Communication", level: "Expert" }
      ]
    };
  } catch (error) {
    console.error('Error extracting skills data:', error);
    return null;
  }
}
