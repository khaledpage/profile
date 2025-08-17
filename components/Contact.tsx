import React, { useState } from 'react';

interface ContactProps {
  content: any;
  config: any;
  currentLanguage: string;
}

const Contact = ({ content, config, currentLanguage }: ContactProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setSubmitStatus('success');
      setIsSubmitting(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset status after 3 seconds
      setTimeout(() => setSubmitStatus('idle'), 3000);
    }, 1000);
  };

  return (
    <section id="contact" className="py-20 lg:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">
            <span className="gradient-text">{content.title}</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {content.subtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">{content.getInTouch || 'Get In Touch'}</h3>
              <p className="text-gray-300 leading-relaxed mb-8">
                {content.description}
              </p>
            </div>

            <div className="space-y-6">
              {content.info?.map((method: any, index: number) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center border border-primary/30">
                    <span className="text-xl">📧</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{method.label}</h4>
                    <p className="text-gray-300">{method.value}</p>
                  </div>
                </div>
              )) || (
                <div className="text-center text-gray-400">
                  No contact information found
                </div>
              )}
            </div>

            {/* Social Links */}
            <div className="pt-8 border-t border-white/10">
              <h4 className="text-lg font-semibold text-white mb-4">{content.social?.title || 'Follow Me'}</h4>
              <div className="flex space-x-4">
                {config.personal.social?.map((social: any, index: number) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center border border-primary/30 hover:bg-primary/30 transition-colors"
                  >
                    <span>🔗</span>
                  </a>
                )) || (
                  <div className="text-gray-400 text-sm">
                    No social links found
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="glass p-8 rounded-2xl border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-6">{content.getInTouch || 'Get In Touch'}</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    {content.form?.name || 'Name'}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-primary/50 focus:outline-none text-white placeholder-gray-400"
                    placeholder={content.form?.namePlaceholder || 'Your name'}
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    {content.form?.email || 'Email'}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-primary/50 focus:outline-none text-white placeholder-gray-400"
                    placeholder={content.form?.emailPlaceholder || 'your@email.com'}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                  {content.form?.subject || 'Subject'}
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-primary/50 focus:outline-none text-white placeholder-gray-400"
                  placeholder={content.form?.subjectPlaceholder || 'Project subject'}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  {content.form?.message || 'Message'}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-primary/50 focus:outline-none text-white placeholder-gray-400 resize-none"
                  placeholder={content.form?.messagePlaceholder || 'Tell me about your project...'}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (content.form?.sending || 'Sending...') : (content.form?.submit || 'Send Message')}
              </button>

              {submitStatus === 'success' && (
                <div className="text-center text-green-400 font-medium">
                  {content.form?.successMessage || 'Message sent successfully!'}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
      </div>
    </section>
  );
};

export default Contact;
