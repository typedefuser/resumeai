import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { PlusCircle, FileText, Edit, Search, MoreVertical } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem,DropdownMenuTrigger } from "../components/ui/dropdown-menu"


const initialResumes = [
  { id: 1, title: 'Software Engineer Resume', lastModified: '2023-05-15', color: 'bg-blue-500' },
  { id: 2, title: 'Product Manager Resume', lastModified: '2023-06-02', color: 'bg-green-500' },
  { id: 3, title: 'Data Analyst Resume', lastModified: '2023-06-10', color: 'bg-purple-500' },
  { id: 4, title: 'UX Designer Resume', lastModified: '2023-06-15', color: 'bg-yellow-500' },
  { id: 5, title: 'Marketing Specialist Resume', lastModified: '2023-06-20', color: 'bg-red-500' },
  { id: 6, title: 'Project Manager Resume', lastModified: '2023-06-25', color: 'bg-indigo-500' },
]

export default function Dashboard() {
  const [resumes, setResumes] = useState(initialResumes)
  const [searchTerm, setSearchTerm] = useState('')

  const handleCreateResume = () => {
    console.log('Creating new resume')
  }

  const handleEditResume = (id: number) => {
    console.log(`Editing resume with id: ${id}`)
  }

  const handleDeleteResume = (id: number) => {
    setResumes(resumes.filter(resume => resume.id !== id))
  }

  const filteredResumes = resumes.filter(resume => 
    resume.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-100">
   

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">My Resumes</h1>
            <Button onClick={handleCreateResume} className="bg-blue-500 hover:bg-blue-600">
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Resume
            </Button>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search resumes..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResumes.map((resume) => (
              <Card key={resume.id} className="overflow-hidden transition-shadow duration-300 hover:shadow-lg">
                <div className={`h-2 ${resume.color}`} />
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <FileText className="mr-2 h-5 w-5 text-gray-500" />
                    {resume.title}
                  </CardTitle>
                  <CardDescription>Last modified: {resume.lastModified}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">Click to view or edit this resume.</p>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditResume(resume.id)}>
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditResume(resume.id)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteResume(resume.id)} className="text-red-600">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}