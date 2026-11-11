import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { initialCourses } from '../data/courses';
import { readStorage, writeStorage } from '../utils/storage';

const LMSContext = createContext(null);

const defaultProfile = {
  name: 'Arjun Reddy',
  email: 'arjun.reddy@example.com',
  phone: '+91 98765 43210',
  role: 'Student',
  bio: 'Curious learner exploring web development, design and technology.',
};

export function LMSProvider({ children }) {
  const [courses, setCourses] = useState(() => readStorage('lms_courses', initialCourses));
  const [enrolled, setEnrolled] = useState(() => readStorage('lms_enrolled', ['react-fundamentals']));
  const [completed, setCompleted] = useState(() => readStorage('lms_completed', {}));
  const [quizResults, setQuizResults] = useState(() => readStorage('lms_quiz_results', {}));
  const [profile, setProfile] = useState(() => readStorage('lms_profile', defaultProfile));
  const [role, setRole] = useState(() => readStorage('lms_role', 'student'));
  const [toast, setToast] = useState(null);

  useEffect(() => writeStorage('lms_courses', courses), [courses]);
  useEffect(() => writeStorage('lms_enrolled', enrolled), [enrolled]);
  useEffect(() => writeStorage('lms_completed', completed), [completed]);
  useEffect(() => writeStorage('lms_quiz_results', quizResults), [quizResults]);
  useEffect(() => writeStorage('lms_profile', profile), [profile]);
  useEffect(() => writeStorage('lms_role', role), [role]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  const notify = useCallback((message, type = 'success') => setToast({ message, type, key: Date.now() }), []);

  const getCourse = useCallback(id => courses.find(c => c.id === id), [courses]);

  // Only count completed lessons that still exist in the course (admin may edit lessons).
  const completedIds = useCallback(
    course => {
      if (!course) return [];
      const valid = new Set(course.lessons.map(l => l.id));
      return (completed[course.id] || []).filter(id => valid.has(id));
    },
    [completed]
  );

  const progress = useCallback(
    course => (course?.lessons?.length ? Math.round((completedIds(course).length / course.lessons.length) * 100) : 0),
    [completedIds]
  );

  const enroll = useCallback(
    (id, title) => {
      setEnrolled(old => (old.includes(id) ? old : [...old, id]));
      notify(`Enrolled${title ? ` in ${title}` : ''}`);
    },
    [notify]
  );

  const unenroll = useCallback(
    (id, title) => {
      setEnrolled(old => old.filter(courseId => courseId !== id));
      notify(`Unenrolled${title ? ` from ${title}` : ''}`, 'info');
    },
    [notify]
  );

  const toggleComplete = useCallback((courseId, lessonId) => {
    setCompleted(old => {
      const current = old[courseId] || [];
      return {
        ...old,
        [courseId]: current.includes(lessonId) ? current.filter(id => id !== lessonId) : [...current, lessonId],
      };
    });
  }, []);

  // Keeps the latest attempt plus the best score and attempt count.
  const saveQuizResult = useCallback((courseId, score, total) => {
    setQuizResults(old => {
      const previous = old[courseId];
      const percentage = total ? Math.round((score / total) * 100) : 0;
      return {
        ...old,
        [courseId]: {
          score,
          total,
          percentage,
          date: new Date().toISOString(),
          attempts: (previous?.attempts || 0) + 1,
          best: Math.max(previous?.best ?? 0, percentage),
        },
      };
    });
  }, []);

  const addCourse = useCallback(course => {
    setCourses(old => [course, ...old]);
    notify('Course created');
  }, [notify]);

  const updateCourse = useCallback(updated => {
    setCourses(old => old.map(course => (course.id === updated.id ? updated : course)));
    notify('Course updated');
  }, [notify]);

  const deleteCourse = useCallback(id => {
    setCourses(old => old.filter(course => course.id !== id));
    setEnrolled(old => old.filter(courseId => courseId !== id));
    setCompleted(old => { const { [id]: _removed, ...rest } = old; return rest; });
    setQuizResults(old => { const { [id]: _removed, ...rest } = old; return rest; });
    notify('Course deleted', 'info');
  }, [notify]);

  const resetProgress = useCallback(() => {
    setCompleted({});
    setQuizResults({});
    notify('Learning progress reset', 'info');
  }, [notify]);

  const value = useMemo(
    () => ({
      courses, enrolled, completed, quizResults, profile, role, toast,
      setRole, setProfile, getCourse, completedIds, progress,
      enroll, unenroll, toggleComplete, saveQuizResult,
      addCourse, updateCourse, deleteCourse, resetProgress, notify,
    }),
    [courses, enrolled, completed, quizResults, profile, role, toast, getCourse, completedIds, progress,
     enroll, unenroll, toggleComplete, saveQuizResult, addCourse, updateCourse, deleteCourse, resetProgress, notify]
  );

  return <LMSContext.Provider value={value}>{children}</LMSContext.Provider>;
}

export const useLMS = () => {
  const context = useContext(LMSContext);
  if (!context) throw new Error('useLMS must be used inside LMSProvider');
  return context;
};
