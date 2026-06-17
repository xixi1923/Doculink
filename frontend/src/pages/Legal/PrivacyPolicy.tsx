export default function PrivacyPolicy() {
  const sections = [
    {
      title: 'Information We Collect',
      content: 'We collect information that you provide directly to us when you create an account, upload a document, or communicate with us. This may include your name, email address, school information, and profile picture.'
    },
    {
      title: 'How We Use Your Information',
      content: 'We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to personalize your experience on DocuLink.'
    },
    {
      title: 'Data Security',
      content: 'We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.'
    },
    {
      title: 'Cookies',
      content: 'Most web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove or reject browser cookies.'
    }
  ]

  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">Privacy Policy</h1>
        <p className="text-gray-500 dark:text-gray-400">Last updated: June 17, 2024</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-[40px] border border-gray-100 dark:border-gray-700 p-10 shadow-sm space-y-10">
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
          At DocuLink, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
        </p>

        {sections.map(section => (
          <section key={section.title}>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{section.title}</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {section.content}
            </p>
          </section>
        ))}

        <div className="pt-10 border-t dark:border-gray-700">
           <p className="text-sm text-gray-500 dark:text-gray-400 italic">
             For any privacy-related inquiries, please reach out to privacy@doculink.com.
           </p>
        </div>
      </div>
    </div>
  )
}
