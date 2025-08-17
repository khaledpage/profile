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

  const showContactInfo = config.ui.sections.contact.showContactInfo;
  const showForm = config.ui.sections.contact.showForm;
  const showSocialLinks = config.ui.sections.contact.showSocialLinks;
  const showDownloadCV = config.ui.sections.contact.showDownloadCV;

  return (
    <section id="contact" className="py-20 lg:py-32 relative overflow-hidden">
      <div id="contact-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div id="contact-header" className="text-center mb-16">
          <h2 id="contact-title" className="text-3xl lg:text-5xl font-bold mb-4">
            <span className="gradient-text">{content.title}</span>
          </h2>
          <p id="contact-subtitle" className="text-xl text-theme-secondary max-w-3xl mx-auto">
            {content.subtitle}
          </p>
        </div>

        <div id="contact-content" className={`grid gap-16 ${showContactInfo && showForm ? 'lg:grid-cols-2' : 'justify-center'}`}>
          {/* Contact Info */}
          {showContactInfo && (
            <div id="contact-info-section" className="space-y-8">
              <div id="contact-info-header">
                <h3 id="contact-get-in-touch-title" className="text-2xl font-bold mb-6" style={{ color: 'var(--text)' }}>{content.getInTouch || 'Get In Touch'}</h3>
                <p id="contact-description" className="text-theme-secondary leading-relaxed mb-8">
                  {content.description}
                </p>
              </div>

              <div id="contact-methods" className="space-y-6">
                {content.info?.map((method: any, index: number) => (
                  <div 
                    key={index} 
                    id={`contact-method-${index}`}
                    className="flex items-center space-x-4 p-3 rounded-lg md:hover:bg-white/5 transition-colors touch-manipulation"
                    style={{ touchAction: 'pan-y' }}
                  >
                    <div id={`contact-method-icon-${index}`} className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center border border-primary/30">
                      <span className="text-xl">📧</span>
                    </div>
                    <div id={`contact-method-content-${index}`}>
                      <h4 id={`contact-method-label-${index}`} className="font-semibold" style={{ color: 'var(--text)' }}>{method.label}</h4>
                      <p id={`contact-method-value-${index}`} className="text-gray-300">{method.value}</p>
                    </div>
                  </div>
                )) || (
                  <div id="no-contact-info-message" className="text-center text-gray-400">
                    No contact information found
                  </div>
                )}
              </div>

              {/* Social Links */}
              {showSocialLinks && (
                <div id="contact-social-section" className="pt-8 border-t border-white/10">
                  <h4 id="contact-social-title" className="text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>{content.social?.title || 'Follow Me'}</h4>
                  <div id="contact-social-links" className="flex space-x-4">
                    {config.personal.social?.map((social: any, index: number) => (
                      <a
                        key={index}
                        id={`contact-social-link-${index}`}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center border border-primary/30 md:hover:bg-primary/30 transition-colors touch-manipulation"
                        style={{ touchAction: 'manipulation' }}
                      >
                        <span>🔗</span>
                      </a>
                    )) || (
                      <div id="no-social-links-message" className="text-gray-400 text-sm">
                        No social links found
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Download CV */}
              {showDownloadCV && (
                <div id="contact-cv-section" className="pt-6">
                  <a
                    id="contact-cv-download"
                    href="./assets/Alabsi_Khaled DE_250310.pdf"
                    download
                    className="inline-flex items-center space-x-2 btn-secondary px-6 py-3 rounded-lg touch-manipulation"
                    style={{ touchAction: 'manipulation' }}
                  >
                    <span>📄</span>
                    <span>Download CV</span>
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Contact Form */}
          {showForm && (
            <div 
              id="contact-form-section"
              className={`glass p-8 rounded-2xl border border-white/10 md:hover:border-primary/20 transition-all duration-300 touch-manipulation ${!showContactInfo ? 'max-w-2xl' : ''}`}
              style={{ 
                touchAction: 'pan-y',
                willChange: 'auto'
              }}
            >
              <h3 id="contact-form-title" className="text-2xl font-bold mb-6" style={{ color: 'var(--text)' }}>{content.getInTouch || 'Send Message'}</h3>
              
              <form id="contact-form" onSubmit={handleSubmit} className="space-y-6">
                <div id="contact-form-names" className="grid sm:grid-cols-2 gap-4">
                  <div id="contact-form-name-field">
                    <label htmlFor="name" id="contact-form-name-label" className="block text-sm font-medium text-theme-secondary mb-2">
                      {content.form?.name || 'Name'}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border rounded-lg focus:border-primary/50 focus:outline-none placeholder-gray-400 touch-manipulation"
                      style={{ 
                        backgroundColor: 'var(--surface)', 
                        borderColor: 'var(--border)',
                        color: 'var(--text)',
                        touchAction: 'manipulation'
                      }}
                      placeholder={content.form?.namePlaceholder || 'Your name'}
                    />
                  </div>
                  
                  <div id="contact-form-email-field">
                    <label htmlFor="email" id="contact-form-email-label" className="block text-sm font-medium text-theme-secondary mb-2">
                      {content.form?.email || 'Email'}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border rounded-lg focus:border-primary/50 focus:outline-none placeholder-gray-400 touch-manipulation"
                      style={{ 
                        backgroundColor: 'var(--surface)', 
                        borderColor: 'var(--border)',
                        color: 'var(--text)',
                        touchAction: 'manipulation'
                      }}
                      placeholder={content.form?.emailPlaceholder || 'your@email.com'}
                    />
                  </div>
                </div>

                <div id="contact-form-subject-field">
                  <label htmlFor="subject" id="contact-form-subject-label" className="block text-sm font-medium text-theme-secondary mb-2">
                    {content.form?.subject || 'Subject'}
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border rounded-lg focus:border-primary/50 focus:outline-none placeholder-gray-400 touch-manipulation"
                    style={{ 
                      backgroundColor: 'var(--surface)', 
                      borderColor: 'var(--border)',
                      color: 'var(--text)',
                      touchAction: 'manipulation'
                    }}
                    placeholder={content.form?.subjectPlaceholder || 'Project subject'}
                  />
                </div>

                <div id="contact-form-message-field">
                  <label htmlFor="message" id="contact-form-message-label" className="block text-sm font-medium text-theme-secondary mb-2">
                    {content.form?.message || 'Message'}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border rounded-lg focus:border-primary/50 focus:outline-none placeholder-gray-400 resize-none touch-manipulation"
                    style={{ 
                      backgroundColor: 'var(--surface)', 
                      borderColor: 'var(--border)',
                      color: 'var(--text)',
                      touchAction: 'manipulation'
                    }}
                    placeholder={content.form?.messagePlaceholder || 'Tell me about your project...'}
                  />
                </div>

                <button
                  id="contact-form-submit"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                  style={{ touchAction: 'manipulation' }}
                >
                  {isSubmitting ? (content.form?.sending || 'Sending...') : (content.form?.submit || 'Send Message')}
                </button>

                {submitStatus === 'success' && (
                  <div id="contact-form-success-message" className="text-center text-theme-success font-medium">
                    {content.form?.successMessage || 'Message sent successfully!'}
                  </div>
                )}
              </form>
            </div>
          )}
        </div>
      </div>

      <div id="contact-background-decorations" className="absolute inset-0 pointer-events-none overflow-hidden">
        <div id="contact-bg-decoration-1" className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div id="contact-bg-decoration-2" className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
      </div>
    </section>
  );
};

export default Contact;
