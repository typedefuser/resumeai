import { useState } from 'react'
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import {login,LoginData,SignupData} from '../services/apiservices/loginservice'
import { useNavigate } from 'react-router-dom'
import {Login_Error} from '../types'
import { useUser } from '../UserContext'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const {login_context}= useUser()
  const [_, setError] = useState<Login_Error>({
    errors:[],
    message:'',
    status:'',
    timestamp:''
  })


  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    password: ''
  })
  const [signupData, setSignupData] = useState<SignupData>({
    firstname: '',
    lastname: '',
    email: '',
    password: ''
  })
  const navigate = useNavigate();

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSignupData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const data = isLogin ? loginData : signupData
    try {
        const result = await login(data, isLogin);
        if(result.token){
          localStorage.setItem('token', result.token);
        }
        if(result.user){
          login_context(result.user)
        }
        
        isLogin?navigate('/dashboard'):!isLogin;
    } catch (error) {
      setError(error as Login_Error);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>{isLogin ? 'Login' : 'Sign Up'}</CardTitle>
          <CardDescription>
            {isLogin 
              ? 'Enter your credentials to access your account' 
              : 'Create a new account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" onClick={() => setIsLogin(true)}>Login</TabsTrigger>
              <TabsTrigger value="signup" onClick={() => setIsLogin(false)}>Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="loginEmail">Email</Label>
                  <Input
                    id="loginEmail"
                    name="email"
                    placeholder="john.doe@example.com"
                    type="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loginPassword">Password</Label>
                  <Input
                    id="loginPassword"
                    name="password"
                    type="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    required
                  />
                </div>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstname"
                    placeholder="John"
                    value={signupData.firstname}
                    onChange={handleSignupChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastname"
                    placeholder="Doe"
                    value={signupData.lastname}
                    onChange={handleSignupChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signupEmail">Email</Label>
                  <Input
                    id="signupEmail"
                    name="email"
                    placeholder="john.doe@example.com"
                    type="email"
                    value={signupData.email}
                    onChange={handleSignupChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signupPassword">Password</Label>
                  <Input
                    id="signupPassword"
                    name="password"
                    type="password"
                    value={signupData.password}
                    onChange={handleSignupChange}
                    required
                  />
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleSubmit}>
            {isLogin ? 'Login' : 'Sign Up'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}