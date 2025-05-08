import { Link } from 'react-router-dom'
import { Card } from '../components/Card'

const NotFound = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <Card className="max-w-md mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-6">Page Not Found</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <Link to="/" className="btn-primary">
          Back to Home
        </Link>
      </Card>
    </div>
  )
}

export default NotFound
