import { Mail, MapPin, Phone, Send } from 'lucide-react'

export default function ContactUs() {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">Get in Touch</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          Have questions about DocuLink? We're here to help. Send us a message and we'll respond as soon as possible.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Contact Form */}
        <div className="bg-white dark:bg-gray-800 p-10 rounded-[40px] border border-gray-100 dark:border-gray-700 shadow-sm">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-900 border border-transparent focus:border-primary dark:focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-2xl outline-none transition-all dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-900 border border-transparent focus:border-primary dark:focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-2xl outline-none transition-all dark:text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Subject</label>
              <input
                type="text"
                placeholder="How can we help you?"
                className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-900 border border-transparent focus:border-primary dark:focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-2xl outline-none transition-all dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Message</label>
              <textarea
                rows={5}
                placeholder="Write your message here..."
                className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-900 border border-transparent focus:border-primary dark:focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-2xl outline-none transition-all dark:text-white resize-none"
              ></textarea>
            </div>
            <button className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
              <Send size={20} /> Send Message
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="space-y-8 lg:pt-10">
          <div className="flex gap-6 items-start">
            <div className="w-12 h-12 bg-primary/5 dark:bg-primary/10 rounded-2xl flex items-center justify-center text-primary flex-shrink-0">
              <Mail size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">Email Support</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">Typically responds within 24 hours.</p>
              <a href="mailto:support@doculink.com" className="text-primary font-bold hover:underline">support@doculink.com</a>
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <div className="w-12 h-12 bg-primary/5 dark:bg-primary/10 rounded-2xl flex items-center justify-center text-primary flex-shrink-0">
              <MapPin size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">Our Location</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                Phnom Penh, Cambodia<br />
                Tuol Kork, Street 210
              </p>
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <div className="w-12 h-12 bg-primary/5 dark:bg-primary/10 rounded-2xl flex items-center justify-center text-primary flex-shrink-0">
              <Phone size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">Call Us</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">Monday - Friday, 9am - 5pm ICT</p>
              <p className="text-primary font-bold">+855 12 345 678</p>
            </div>
          </div>

          <div className="p-8 bg-gray-50 dark:bg-gray-800/50 rounded-[32px] border border-gray-100 dark:border-gray-700">
            <h4 className="font-bold text-gray-900 dark:text-white mb-2">Connect with us on Social Media</h4>
            <div className="flex gap-4 mt-4">
              {/* Social icons would go here */}
              <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full border border-gray-100 dark:border-gray-700"></div>
              <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full border border-gray-100 dark:border-gray-700"></div>
              <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full border border-gray-100 dark:border-gray-700"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
