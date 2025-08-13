'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
}

const ProjectCard = ({ title, description, image, tags, link }: ProjectCardProps) => {
  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -8 }}
      className="group block overflow-hidden rounded-2xl glass lift"
    >
      <div className="relative h-48 w-full">
        <Image src={image} alt={title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-70" />
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {tags.slice(0, 3).map((tag) => (
            <span key={tag} className="px-2 py-0.5 text-[11px] rounded-full bg-white/15 text-white backdrop-blur">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-sm text-gray-300 mb-4 line-clamp-3">{description}</p>
        <span className="inline-flex items-center text-sm gradient-text">View Project →</span>
      </div>
    </motion.a>
  );
};

export default ProjectCard;
