interface PrinciplesPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function PrinciplesPage({ params }: PrinciplesPageProps) {
  const { slug } = await params

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-light text-gray-900 mb-8">
          Principle: {slug}
        </h1>
        <p className="text-lg text-gray-700">
          Detailed information about this principle.
        </p>
      </div>
    </div>
  )
}
