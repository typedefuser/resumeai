import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { PlusCircle, FileText, Edit, Search, MoreVertical } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem,DropdownMenuTrigger } from "../components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog"
import Navbar from '../components/Navbar'
import {Label} from '../components/ui/label'
import { colorGenerator, getResumesbyUserId, ResumeDash,createResumebyUserId, deleteResumebyId } from '../services/apiservices/resumeService'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../UserContext'


export default function Dashboard() {
  const [resumes, setResumes] = useState<Array<ResumeDash>>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newResumeName, setNewResumeName] = useState('')
  const [isLoading, setIsLoading] = useState(true) 
  const {user}=useUser()
  const generateColor = colorGenerator()
  const navigate=useNavigate();

  useEffect(() => {
    const fetchResumes = async () => {
      console.log(user)
      if(!user) return;
      setIsLoading(true)
      const fetchedResumes = await getResumesbyUserId(user.userId)
      setResumes(fetchedResumes)
      setIsLoading(false) 
    }
    fetchResumes()
  }, [])

  const handleCreateResume = async () => {
    if(!user) return;
    if (newResumeName.trim()) {
      const newResume = await createResumebyUserId(user.email, newResumeName)
      setResumes([...resumes, newResume])
      setIsCreateModalOpen(false)
      setNewResumeName('')
    }
  }

  const handleEditResume = async (id: number) => {
     navigate(`/home/${id}`)
  }

  const handleDeleteResume = async (id: number) => {
    await deleteResumebyId(id);
    setResumes(resumes.filter(resume => resume.resumeId !== id))
  }

  const filteredResumes = resumes.filter(resume => 
    resume.resumeName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">My Resumes</h1>
            <Button onClick={() => setIsCreateModalOpen(true)} className="bg-blue-500 hover:bg-blue-600">
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

          {isLoading ? ( // Conditional rendering for loading state
            <div className="text-center py-4">Loading resumes...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResumes.map((resume) => (
                <Card key={resume.resumeId} className="overflow-hidden transition-shadow duration-300 hover:shadow-lg">
                  <div className={`h-2 ${generateColor.next().value}`} />
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center text-lg">
                      <FileText className="mr-2 h-5 w-5 text-gray-500" />
                      {resume.resumeName}
                    </CardTitle>
                    <CardDescription>Last modified: {resume.lastModified}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">Click to view or edit this resume.</p>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditResume(resume.resumeId)}>
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditResume(resume.resumeId)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteResume(resume.resumeId)} className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Resume</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newResumeName}
                onChange={(e) => setNewResumeName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCreateResume}>Create Resume</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}