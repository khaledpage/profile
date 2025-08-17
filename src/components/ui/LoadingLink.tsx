'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type LoadingLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any; // For other props
};

export default function LoadingLink({ href, children, className, style, ...props }: LoadingLinkProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClick = async (e: React.MouseEvent) => {
    // Don't prevent default for external links or links with target="_blank"
    if (href.startsWith('http') || props.target === '_blank') {
      return;
    }

    e.preventDefault();
    setIsLoading(true);

    // Add a small delay to show the loading state
    setTimeout(() => {
      router.push(href);
    }, 100);
  };

  return (
    <Link
      href={href}
      className={className}
      style={style}
      onClick={handleClick}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <LoadingSpinner />
          Loading...
        </span>
      ) : (
        children
      )}
    </Link>
  );
}

// Loading Spinner Component
function LoadingSpinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}
