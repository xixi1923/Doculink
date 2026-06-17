export default function TermsOfService() {
  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: 'By accessing or using DocuLink, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.'
    },
    {
      title: '2. Use License',
      content: 'Permission is granted to temporarily download one copy of the materials (information or software) on DocuLink for personal, non-commercial transitory viewing only.'
    },
    {
      title: '3. Disclaimer',
      content: 'The materials on DocuLink are provided on an "as is" basis. DocuLink makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability.'
    },
    {
      title: '4. Limitations',
      content: 'In no event shall DocuLink or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on DocuLink.'
    }
  ]

  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">Terms of Service</h1>
        <p className="text-gray-500 dark:text-gray-400">Last updated: June 17, 2024</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-[40px] border border-gray-100 dark:border-gray-700 p-10 shadow-sm space-y-10">
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
             If you have any questions about these Terms, please contact us at legal@doculink.com.
           </p>
        </div>
      </div>
    </div>
  )
}
