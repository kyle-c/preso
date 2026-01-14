import Link from "next/link"

export default function PrinciplesPage() {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="animate-in fade-in duration-500">
          <div className="border-l-4 border-cyan-500 pl-8 mb-12">
            <p className="text-sm font-bold text-cyan-600 uppercase mb-2">Designing for Presence</p>
            <h1 className="text-5xl text-gray-900 leading-tight">
              Our Principles
            </h1>
          </div>
          
          <div className="pl-8 space-y-12">
            {/* Principle 1 */}
            <div className="space-y-4">
              <h2 className="text-2xl text-gray-900 font-medium">
                Conversational Transactions, Not Transactional Experiences
              </h2>
              <div className="border-l-2 border-gray-300 pl-4 py-2">
                <p className="text-base text-gray-900 leading-relaxed">
                  If it sounds like software talking to a user, rewrite it. If it sounds like one person simply helping another send money, ship it.
                </p>
              </div>
              <div className="bg-gray-50 border-l-2 border-cyan-500 pl-4 py-3">
                <p className="text-base text-gray-900 leading-relaxed">
                  <span className="font-bold">Presence lens:</span> Use language that acknowledges the relational act "showing up," "being there," "helping" not just the mechanical transfer.
                </p>
              </div>
            </div>

            {/* Principle 2 */}
            <div className="space-y-4">
              <h2 className="text-2xl text-gray-900 font-medium">
                Guide Beginners. Accelerate Regulars.
              </h2>
              <div className="border-l-2 border-gray-300 pl-4 py-2">
                <p className="text-base text-gray-900 leading-relaxed">
                  Guide new users with simple explanation to build trust. As they grow familiar, get them there faster, never removing control or understanding.
                </p>
              </div>
              <div className="bg-gray-50 border-l-2 border-cyan-500 pl-4 py-3">
                <p className="text-base text-gray-900 leading-relaxed">
                  <span className="font-bold">Presence lens:</span> First sends are significant acts, guide users through them with care and context. Repeat sends are routine presence, make them effortless while building financial knowledge that enables future presence.
                </p>
              </div>
            </div>

            {/* Principle 3 */}
            <div className="space-y-4">
              <h2 className="text-2xl text-gray-900 font-medium">
                Never Leave Users Guessing
              </h2>
              <div className="border-l-2 border-gray-300 pl-4 py-2">
                <p className="text-base text-gray-900 leading-relaxed">
                  Acknowledge what just happened, show what comes next, and set time expectations. If something's processing, loading, or waiting, say so, and say how long.
                </p>
              </div>
              <div className="bg-gray-50 border-l-2 border-cyan-500 pl-4 py-3">
                <p className="text-base text-gray-900 leading-relaxed">
                  <span className="font-bold">Presence lens:</span> When money is in motion, users are emotionally invested in their act of presence reaching its destination. Ambiguity creates anxiety, clarity creates confidence.
                </p>
              </div>
            </div>

            {/* Principle 4 */}
            <div className="space-y-4">
              <h2 className="text-2xl text-gray-900 font-medium">
                Protect Without Blocking
              </h2>
              <div className="border-l-2 border-gray-300 pl-4 py-2">
                <p className="text-base text-gray-900 leading-relaxed">
                  Catch mistakes early through smart defaults, clarifying questions, and real-time validation. Make safety feel like double-checking together, not being doubted or restricted.
                </p>
              </div>
              <div className="bg-gray-50 border-l-2 border-cyan-500 pl-4 py-3">
                <p className="text-base text-gray-900 leading-relaxed">
                  <span className="font-bold">Presence lens:</span> Users are trying to show up for loved ones, our job is to ensure that act of care lands successfully, not to create obstacles that make them feel less capable.
                </p>
              </div>
            </div>

            {/* Principle 5 */}
            <div className="space-y-4">
              <h2 className="text-2xl text-gray-900 font-medium">
                Grow With Users
              </h2>
              <div className="border-l-2 border-gray-300 pl-4 py-2">
                <p className="text-base text-gray-900 leading-relaxed">
                  Reveal new financial tools at relevant moments, not all at once. Let the product grow with users' lives.
                </p>
              </div>
              <div className="bg-gray-50 border-l-2 border-cyan-500 pl-4 py-3">
                <p className="text-base text-gray-900 leading-relaxed">
                  <span className="font-bold">Presence lens:</span> Future presence isn't just about today's remittance, it's about building a complete financial foundation. Guide users from sending money home to managing their entire financial life in the U.S., one empowering step at a time.
                </p>
              </div>
            </div>
          </div>

          <div className="pl-8 mt-12">
            <Link
              href="/guidelines"
              className="inline-block text-base text-gray-900 hover:text-cyan-600 transition-colors"
            >
              ← Back to Guidelines
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
