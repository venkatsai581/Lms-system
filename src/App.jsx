import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import { useLMS } from './context/LMSContext';
import Dashboard from './pages/Dashboard';import Catalogue from './pages/Catalogue';import CourseDetails from './pages/CourseDetails';import MyCourses from './pages/MyCourses';import LessonViewer from './pages/LessonViewer';import Quiz from './pages/Quiz';import Profile from './pages/Profile';import AdminCourses from './pages/AdminCourses';import NotFound from './pages/NotFound';
function AdminRoute({children}){const {role}=useLMS();return role==='admin'?children:<Navigate to="/" replace/>;}
export default function App(){return <Routes><Route element={<AppLayout/>}><Route index element={<Dashboard/>}/><Route path="catalogue" element={<Catalogue/>}/><Route path="courses/:id" element={<CourseDetails/>}/><Route path="my-courses" element={<MyCourses/>}/><Route path="learn/:id" element={<LessonViewer/>}/><Route path="quiz/:id" element={<Quiz/>}/><Route path="profile" element={<Profile/>}/><Route path="admin" element={<AdminRoute><AdminCourses/></AdminRoute>}/><Route path="*" element={<NotFound/>}/></Route></Routes>}
