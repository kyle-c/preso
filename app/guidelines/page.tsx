import Link from "next/link"

export default function GuidelinesPage() {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="animate-in fade-in duration-500">
          <div className="border-l-4 border-cyan-500 pl-8 mb-12">
            <p className="text-sm font-bold text-cyan-600 uppercase mb-2">Designing for Presence</p>
            <h1 className="text-5xl text-gray-900 leading-tight">
              Félix UX Guidelines
            </h1>
          </div>
          
          <div className="pl-8 space-y-8 mb-16">
            <div className="space-y-6">
              <p className="text-xl text-gray-900 leading-relaxed">
                Remittances aren't transactions—they're <span className="font-bold">acts of presence</span>. When someone sends money through Félix, they're <span className="font-bold">showing up for family</span> back home. When they build credit here, they're ensuring <span className="font-bold">future presence</span>—the ability to <span className="font-bold">stay available</span> for the people they love.
              </p>

              <p className="text-base text-gray-900 leading-relaxed">
                But presence isn't just about today—it's about building the <span className="font-bold">capability to show up tomorrow</span>.
              </p>

              <p className="text-base text-gray-900 leading-relaxed">
                The product should make users <span className="font-bold">stronger over time</span>: more knowledgeable about their finances, more confident in their decisions, more capable of building the future they want.
              </p>

              <p className="text-base text-gray-900 leading-relaxed">
                Félix <span className="font-bold">grows with users</span>—from their first send home to comprehensive financial management across borders. We <span className="font-bold">meet people where they are</span>, then <span className="font-bold">gradually reveal new possibilities</span> as they're ready. <span className="font-bold">Future presence</span> requires <span className="font-bold">capability across your entire financial life</span>, and we're here for that <span className="font-bold">full journey</span>.
              </p>

              <div>
                <p className="text-base font-medium text-gray-900 mb-4">
                  This means:
                </p>

                <ul className="space-y-3 text-base text-gray-900">
                  <li className="flex">
                    <span className="text-cyan-600 mr-4">—</span>
                    <span>Language that reflects <span className="font-bold">relationships</span>, not just transactions</span>
                  </li>
                  <li className="flex">
                    <span className="text-cyan-600 mr-4">—</span>
                    <span>Interfaces that <span className="font-bold">teach</span> financial concepts without condescension</span>
                  </li>
                  <li className="flex">
                    <span className="text-cyan-600 mr-4">—</span>
                    <span>Features that <span className="font-bold">increase capability</span>, not just provide convenience</span>
                  </li>
                  <li className="flex">
                    <span className="text-cyan-600 mr-4">—</span>
                    <span><span className="font-bold">Progressive revelation</span> of tools as users are ready for them</span>
                  </li>
                  <li className="flex">
                    <span className="text-cyan-600 mr-4">—</span>
                    <span>Celebrations that <span className="font-bold">acknowledge growth</span>, not just completion</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="pl-8">
            <Link
              href="/principles"
              className="inline-block px-12 py-4 bg-gray-900 text-white text-sm font-medium tracking-wide uppercase rounded-sm hover:bg-cyan-600 transition-colors cursor-pointer"
            >
              Our Principles
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
