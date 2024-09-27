import axios from "axios";

const apiBaseURL=import.meta.env.VITE_BASE_URL;


export interface ResumeDash{
    resumeName:string;
    resumeId:number;
    lastModified:string;
}

const getCurrentDate = () => {
    const currentDate = new Date();
    return currentDate.toISOString().split('T')[0];
};

export const  getResumesbyUserId= async (userId:number): Promise<ResumeDash[]>=>{
    try{
        const URL=`${apiBaseURL}/resume/${userId}`
        const response= await axios.get(URL,{
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        })
        if(response.status==200){
            console.log("Recieved resumes",response.data)
            return response.data;
        }else{
            throw new Error(`getresumeuserid failed:${response.status}`)
        }

    }catch (error) {
        console.error('Error Fetching resumes:', error);
        throw error; 
    }
}
export const createResumebyUserId= async (userId:string,resumeName:string)=>{
    try{
        const URL=`${apiBaseURL}/resume/create`
        const data={"email":userId,"resumeName":resumeName,"lastModified":getCurrentDate()}
        const response=await axios.post(URL,data,{
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        })
        if(response.status==200){
            console.log('Successfully created a new reusme')
            return response.data;
        }
    }catch(error){
        console.error('Error Creating new resume:',error);
        throw error;
    }
}
export const deleteResumebyId = async (resumeId: number) => {
    try {
        const URL = `${apiBaseURL}/resume/delete/${resumeId}`;
        const token = localStorage.getItem('token');
        
        const response = await axios.post(URL, {}, {  
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 200) {
            console.log('Successfully deleted a resume');
        }
    } catch (error) {
        console.error('Error deleting resume:', error);
        throw error;
    }
};
const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-indigo-500',
];
export function* colorGenerator() {
    let index = 0;
    while (true) {
        yield colors[index];
        index = (index + 1) % colors.length; 
    }
}