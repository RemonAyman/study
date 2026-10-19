import React, { useState, useEffect } from "react";
import { 
  db, 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  serverTimestamp 
} from "./firebase";
import { SUBJECTS } from "./data/subjects";
import { soundFx } from "./utils/sound";

import Header from "./components/Header";
import SubjectsHub from "./components/SubjectsHub";
import SubjectWorkspace from "./components/SubjectWorkspace";
import NotesSection from "./components/NotesSection";
import CelebrationModal from "./components/CelebrationModal";

// بيانات ابتدائية واقعية لطلاب الثانوية العامة (علمي)
const INITIAL_TASKS = [
  {
    id: "sample-chem-1",
    subject: "chemistry",
    title: "الباب الأول: العناصر الانتقالية وخواص الحديد",
    type: "شرح",
    priority: "urgent",
    completed: false
  },
  {
    id: "sample-phys-1",
    subject: "physics",
    title: "الفصل الأول: قانونا كيرشوف وتوزيع الجهود",
    type: "حل",
    priority: "urgent",
    completed: false
  },
  {
    id: "sample-bio-1",
    subject: "biology",
    title: "الفصل الأول: الدعامة الفسيولوجية والتركيبية في النبات",
    type: "مراجعة",
    priority: "normal",
    completed: false
  },
  {
    id: "sample-arab-1",
    subject: "arabic",
    title: "الوحدة الأولى نحو: همزة القطع وألف الوصل والمصادر",
    type: "شرح",
    priority: "normal",
    completed: false
  },
  {
    id: "sample-eng-1",
    subject: "english",
    title: "Unit 1: Past Simple vs Past Continuous and Vocab",
    type: "حل",
    priority: "normal",
    completed: false
  },
  {
    id: "sample-geo-1",
    subject: "geology",
    title: "الباب الأول: التراكيب الجيولوجية والفوالق والطيات",
    type: "تلخيص",
    priority: "low",
    completed: false
  }
];

const INITIAL_NOTES = [
  {
    id: "sample-note-1",
    title: "امتحان شامل فيزياء على الفصل الأول",
    content: "امتحان السنتر، التركيز على توصيل المقاومات وتطبيقات كيرشوف وقانون أوم.",
    subject: "physics",
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  },
  {
    id: "sample-note-2",
    title: "تنبيه هام من مستر الكيمياء",
    content: "مراجعة ألوان رواسب الباب الثاني وحفظ حالات تأكسد المنجنيز والكروم جيداً.",
    subject: "chemistry",
    date: null
  }
];

export default function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem("study_v2_tasks");
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem("study_v2_notes");
      return saved ? JSON.parse(saved) : INITIAL_NOTES;
    } catch {
      return INITIAL_NOTES;
    }
  });

  const [activeTab, setActiveTab] = useState("subjects"); // "subjects" | "notes"
  const [currentSubjectId, setCurrentSubjectId] = useState(null); // null = All Subjects Hub
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [celebrationData, setCelebrationData] = useState(null);

  // مزامنة التخزين المحلي
  useEffect(() => {
    localStorage.setItem("study_v2_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("study_v2_notes", JSON.stringify(notes));
  }, [notes]);

  // استرجاع تفضيلات الصوت
  useEffect(() => {
    const savedSound = localStorage.getItem("study_sound");
    if (savedSound !== null) {
      const isSound = savedSound === "true";
      setSoundEnabled(isSound);
      soundFx.toggleSound(isSound);
    }
  }, []);

  // الاستماع اللحظي لقاعدة بيانات Firestore (tasks collection)
  useEffect(() => {
    try {
      const q = query(collection(db, "tasks"));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const remoteTasks = snapshot.docs.map((docSnap) => ({
              id: docSnap.id,
              ...docSnap.data()
            }));
            setTasks(remoteTasks);
          }
        },
        (err) => {
          // التعامل الصامت مع أخطاء الشبكة أو الصلاحيات دون إزعاج المستخدم
          console.warn("Firestore tasks listener:", err);
        }
      );
      return () => unsubscribe();
    } catch (e) {
      console.warn("Firestore init error:", e);
    }
  }, []);

  // الاستماع اللحظي لقاعدة بيانات Firestore (notes collection)
  useEffect(() => {
    try {
      const q = query(collection(db, "notes"));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const remoteNotes = snapshot.docs.map((docSnap) => ({
              id: docSnap.id,
              ...docSnap.data()
            }));
            setNotes(remoteNotes);
          }
        },
        (err) => {
          console.warn("Firestore notes listener:", err);
        }
      );
      return () => unsubscribe();
    } catch (e) {
      console.warn("Firestore init error:", e);
    }
  }, []);

  // تبديل الصوت
  const handleToggleSound = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    soundFx.toggleSound(nextVal);
    localStorage.setItem("study_sound", String(nextVal));
  };

  // إضافة درس متراكم
  const handleAddTask = async (taskData) => {
    soundFx.playAdd();
    const tempId = "local-" + Date.now();
    const newTask = {
      id: tempId,
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString()
    };

    // إضافة محلية فورية للاستجابة السريعة
    setTasks((prev) => [newTask, ...prev]);

    // المزامنة مع كوليكشن tasks في فايربيز
    try {
      const docRef = await addDoc(collection(db, "tasks"), {
        ...taskData,
        completed: false,
        createdAt: serverTimestamp(),
        completedAt: null
      });
      setTasks((prev) => prev.map((t) => t.id === tempId ? { ...t, id: docRef.id } : t));
    } catch (err) {
      console.warn("Firebase task sync:", err);
    }
  };

  // إنجاز الدرس (علامة الصح + الاحتفال + إزالة من الجدول)
  const handleCompleteTask = async (task) => {
    // 1. صوت الاحتفال
    soundFx.playCelebration();

    // 2. نافذة الاحتفال الفخمة مع الكونفيتي والرسالة
    const subjectObj = SUBJECTS.find((s) => s.id === task.subject);
    setCelebrationData({ task, subject: subjectObj });

    // 3. التحديث الفوري لإزالة الدرس من الجدول النشط
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, completed: true, completedAt: new Date().toISOString() } : t))
    );

    // 4. التحديث في فايربيز
    try {
      if (!task.id.startsWith("sample-") && !task.id.startsWith("local-")) {
        const taskRef = doc(db, "tasks", task.id);
        await updateDoc(taskRef, {
          completed: true,
          completedAt: serverTimestamp()
        });
      }
    } catch (err) {
      console.warn("Firebase task complete sync:", err);
    }
  };

  // استرجاع درس للجدول
  const handleToggleUndoTask = async (task) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, completed: false, completedAt: null } : t))
    );
    try {
      if (!task.id.startsWith("sample-") && !task.id.startsWith("local-")) {
        const taskRef = doc(db, "tasks", task.id);
        await updateDoc(taskRef, {
          completed: false,
          completedAt: null
        });
      }
    } catch (err) {
      console.warn("Firebase task undo sync:", err);
    }
  };

  // حذف درس
  const handleDeleteTask = async (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    try {
      if (!taskId.startsWith("sample-") && !taskId.startsWith("local-")) {
        await deleteDoc(doc(db, "tasks", taskId));
      }
    } catch (err) {
      console.warn("Firebase task delete sync:", err);
    }
  };

  // إضافة ملاحظة
  const handleAddNote = async (noteData) => {
    soundFx.playAdd();
    const tempId = "note-" + Date.now();
    const newNote = {
      id: tempId,
      ...noteData,
      createdAt: new Date().toISOString()
    };

    setNotes((prev) => [newNote, ...prev]);

    try {
      const docRef = await addDoc(collection(db, "notes"), {
        ...noteData,
        createdAt: serverTimestamp()
      });
      setNotes((prev) => prev.map((n) => n.id === tempId ? { ...n, id: docRef.id } : n));
    } catch (err) {
      console.warn("Firebase note sync:", err);
    }
  };

  // حذف ملاحظة
  const handleDeleteNote = async (noteId) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
    try {
      if (!noteId.startsWith("sample-") && !noteId.startsWith("note-")) {
        await deleteDoc(doc(db, "notes", noteId));
      }
    } catch (err) {
      console.warn("Firebase note delete sync:", err);
    }
  };

  const selectedSubjectObj = SUBJECTS.find((s) => s.id === currentSubjectId);

  return (
    <div className="app-wrapper">
      {/* الشريط العلوي بدون أي أزرار أو تنبيهات تخص الكود أو الفايربيز */}
      <Header
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === "subjects" && currentSubjectId) {
            // الرجوع لصفحة المواد الرئيسية عند الضغط على التبويب
            setCurrentSubjectId(null);
          }
        }}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        notesCount={notes.length}
      />

      {/* المحتوى الرئيسي */}
      <main>
        {activeTab === "subjects" ? (
          currentSubjectId && selectedSubjectObj ? (
            /* صفحة المادة المختارة وجدولها المباشر */
            <SubjectWorkspace
              subject={selectedSubjectObj}
              tasks={tasks}
              onBackToHub={() => setCurrentSubjectId(null)}
              onSelectSubject={setCurrentSubjectId}
              onAddTask={handleAddTask}
              onCompleteTask={handleCompleteTask}
              onDeleteTask={handleDeleteTask}
              onToggleUndoTask={handleToggleUndoTask}
            />
          ) : (
            /* الواجهة الأولى: كل المواد الستة واضحة ومباشرة أمام الطالب */
            <SubjectsHub
              tasks={tasks}
              onSelectSubject={(id) => setCurrentSubjectId(id)}
            />
          )
        ) : (
          /* خانة الملاحظات ومواعيد الامتحانات */
          <NotesSection
            notes={notes}
            onAddNote={handleAddNote}
            onDeleteNote={handleDeleteNote}
          />
        )}
      </main>

      {/* نافذة الاحتفال المبهجة عند إنجاز المهمة (عاااش مووووت!) */}
      {celebrationData && (
        <CelebrationModal
          task={celebrationData.task}
          subject={celebrationData.subject}
          onClose={() => setCelebrationData(null)}
        />
      )}
    </div>
  );
}
