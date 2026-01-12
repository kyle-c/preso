interface PrinciplesPageProps {
  params: {
    slug: string
  }
}

export default function PrinciplesPage({ params }: PrinciplesPageProps) {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-light text-gray-900 mb-8">
          Principle: {params.slug}
        </h1>
        <p className="text-lg text-gray-700">
          Detailed information about this principle.
        </p>
      </div>
    </div>
  )
}
