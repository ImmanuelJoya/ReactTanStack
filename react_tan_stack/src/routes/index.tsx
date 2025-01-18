import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

interface Post {
  id: number;
  title: string;
  body: string;
}

const fetchPosts = async (): Promise<Post[]> => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts')
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  const { 
    data: posts, 
    isLoading, 
    isError, 
    error 
  } = useQuery<Post[], Error>({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  })

  if (isLoading) {
    return <div>Loading posts...</div>
  }

  if (isError) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div className="p-4">
      <h3 className="text-2xl font-bold mb-4">Welcome Home!</h3>
      <h4 className="text-xl mb-2">Latest Posts:</h4>
      <div className="space-y-4">
        {posts?.slice(0, 5).map((post) => (
          <div key={post.id} className="bg-gray-600 p-3 rounded">
            <h5 className="font-semibold">{post.title}</h5>
            <p>{post.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}