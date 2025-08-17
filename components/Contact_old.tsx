import React, { useState } from 'react';
import config from '@/lib/config';

const iconMap = {
  'Mail': '✉️',
  'MessageSquare': '💬',
  'Phone': '📞',
  'MapPin': '📍',
  'Github': '⚫',
  'Linkedin': '🔵',
  'Twitter': '🐦',
  'Globe': '🌐',
};

const Contact = () => {
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
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">
            <span className="gradient-text">{config.contact.title}</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {config.contact.subtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Get in Touch</h3>
              <p className="text-gray-300 leading-relaxed mb-8">
                I'm always open to discussing new opportunities, creative projects, 
                and interesting challenges. Let's create something amazing together!
              </p>
            </div>

            {/* Contact Cards */}
            <div className="space-y-4">
              {config.contact.info.map((item, index) => {
                const iconEmoji = iconMap[item.icon as keyof typeof iconMap] || '📧';
                
                return (
                  <div
                    key={index}
                    className="glass p-6 rounded-xl border border-white/10 hover:border-primary/30 transition-all duration-300 group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 glass rounded-lg flex items-center justify-center border border-primary/20 group-hover:border-primary/40 transition-colors">
                        <span className="text-xl">{iconEmoji}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">{item.label}</h4>
                        <p className="text-gray-300">{item.value}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Follow Me</h4>
              <div className="flex space-x-4">
                {config.personal.social.map((social) => {
                  const iconEmoji = iconMap[social.icon as keyof typeof iconMap] || '🔗';
                  
                  return (
                    <a
                      key={social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 glass rounded-lg flex items-center justify-center border border-white/10 hover:border-primary/30 transition-all duration-300 group"
                    >
                      <span className="text-xl group-hover:scale-110 transition-transform">
                        {iconEmoji}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="glass p-8 rounded-2xl border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-6">Send a Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 glass rounded-lg border border-white/10 bg-white/5 text-white placeholder-gray-400 focus:border-primary/50 focus:outline-none transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 glass rounded-lg border border-white/10 bg-white/5 text-white placeholder-gray-400 focus:border-primary/50 focus:outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 glass rounded-lg border border-white/10 bg-white/5 text-white placeholder-gray-400 focus:border-primary/50 focus:outline-none transition-colors"
                  placeholder="Project discussion"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 glass rounded-lg border border-white/10 bg-white/5 text-white placeholder-gray-400 focus:border-primary/50 focus:outline-none transition-colors resize-none"
                  placeholder="Tell me about your project or idea..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full btn-primary py-4 text-lg font-semibold transition-all duration-300 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending...</span>
                  </span>
                ) : (
                  'Send Message'
                )}
              </button>

              {/* Submit Status */}
              {submitStatus === 'success' && (
                <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 text-center">
                  ✅ Message sent successfully! I'll get back to you soon.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-center">
                  ❌ Something went wrong. Please try again or use the contact information above.
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="text-center">
            <div className="glass p-6 rounded-xl border border-white/10 max-w-2xl mx-auto">
              <h3 className="text-xl font-bold gradient-text mb-3">
                Let's Build Something Great Together
              </h3>
              <p className="text-gray-300 mb-4">
                Whether it's a web application, mobile app, or custom solution, 
                I'm here to help bring your ideas to life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={`mailto:${config.personal.email}`}
                  className="btn-primary px-6 py-3"
                >
                  📧 Email Me
                </a>
                <a
                  href={config.personal.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary px-6 py-3"
                >
                  📄 Download Resume
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
      </div>
    </section>
  );
};

export default Contact;