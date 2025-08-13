import Header from '@/components/layout/Header';
import Hero from '@/components/sections/Hero';
import ProjectCard from '@/components/ui/ProjectCard';

const projects = [
  {
    title: 'E-Commerce Platform',
    description: 'A modern e-commerce platform built with Next.js and Tailwind CSS',
    image: 'https://source.unsplash.com/800x600/?technology',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    link: '#',
  },
  {
    title: 'Portfolio Website',
    description: 'A responsive portfolio website with smooth animations',
    image: 'https://source.unsplash.com/800x600/?workspace',
    tags: ['React', 'Framer Motion', 'Styled Components'],
    link: '#',
  },
  {
    title: 'Task Management App',
    description: 'A full-stack task management application with real-time updates',
    image: 'https://source.unsplash.com/800x600/?coding',
    tags: ['Node.js', 'Express', 'MongoDB'],
    link: '#',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      
      <section id="projects" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Featured Projects
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.title} {...project} />
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Get in Touch
          </h2>
          
          <div className="max-w-lg mx-auto">
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 transition-colors duration-300"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
