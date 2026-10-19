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
  orderBy, 
  serverTimestamp 
} from "./firebase";
import { SUBJECTS } from "./data/subjects";
import { soundFx } from "./utils/sound";

import Navbar from "./components/Navbar";
import OverviewStats from "./components/OverviewStats";
import SubjectSelector from "./components/SubjectSelector";
import SubjectView from "./components/SubjectView";
import NotesSection from "./components/NotesSection";
import PomodoroTimer from "./components/PomodoroTimer";
import CelebrationModal from "./components/CelebrationModal";
import FirebaseRulesModal from "./components/FirebaseRulesModal";

import { ListTodo, FileText, Timer, AlertCircle } from "lucide-react";

// بيانات افتراضية أولية لبدء المذاكرة مباشرة
const INITIAL_SAMPLE_TASKS = [
  {
    id: "sample-chem-1",
    subject: "chemistry",
    title: "الباب الأول: العناصر الانتقالية وخواص الحديد",
    type: "شرح",
    priority: "urgent",
    completed: false,
    createdAt: null
  },
  {
    id: "sample-phys-1",
    subject: "physics",
    title: "الفصل الأول: قانونا كيرشوف وحل المسائل المعقدة",
    type: "حل",
    priority: "urgent",
    completed: false,
    createdAt: null
  },
  {
    id: "sample-bio-1",
    subject: "biology",
    title: "الفصل الأول: الدعامة الفسيولوجية والتركيبية في النبات",
    type: "مراجعة",
    priority: "normal",
    completed: false,
    createdAt: null
  },
  {
    id: "sample-arab-1",
    subject: "arabic",
    title: "الوحدة الأولى نحو: همزة القطع وألف الوصل والمصادر",
    type: "شرح",
    priority: "normal",
    completed: false,
    createdAt: null
  },
  {
    id: "sample-eng-1",
    subject: "english",
    title: "Unit 1: Past Simple vs Past Continuous and Vocab",
    type: "حل",
    priority: "normal",
    completed: false,
    createdAt: null
  },
  {
    id: "sample-geo-1",
    subject: "geology",
    title: "الباب الأول: التراكيب الجيولوجية والفوالق والطيات",
    type: "تلخيص",
    priority: "low",
    completed: false,
    createdAt: null
  }
];

const INITIAL_SAMPLE_NOTES = [
  {
    id: "sample-note-1",
    title: "امتحان شامل فيزياء على الفصل الأول",
    content: "امتحان السنتر القادم، التركيز على توصيل المقاومات وتطبيقات كيرشوف وقانون أوم للدائرة المغلقة.",
    subject: "physics",
    tag: "امتحان قادم",
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] // بعد 5 أيام
  },
  {
    id: "sample-note-2",
    title: "تنبيه هام من مستر الكيمياء",
    content: "مراجعة ألوان رواسب الباب الثاني وحفظ حالات تأكسد المنجنيز والكروم جيداً.",
    subject: "chemistry",
    tag: "ملحوظة مدرس",
    date: null
  }
];

export default function App() {
  const [tasks, setTasks] = useState(() => {
    const local = localStorage.getItem("study_local_tasks");
    return local ? JSON.parse(local) : INITIAL_SAMPLE_TASKS;
  });

  const [notes, setNotes] = useState(() => {
    const local = localStorage.getItem("study_local_notes");
    return local ? JSON.parse(local) : INITIAL_SAMPLE_NOTES;
  });

  const [selectedSubjectId, setSelectedSubjectId] = useState("chemistry");
  const [activeTab, setActiveTab] = useState("backlog"); // "backlog" | "notes"
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [theme, setTheme] = useState("dark");
  const [celebrationData, setCelebrationData] = useState(null);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [firestoreError, setFirestoreError] = useState(null);
  const [showTimerWidget, setShowTimerWidget] = useState(true);

  // حفظ محلي تلقائي
  useEffect(() => {
    localStorage.setItem("study_local_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("study_local_notes", JSON.stringify(notes));
  }, [notes]);

  // استرجاع الإعدادات المحفوظة محلياً
  useEffect(() => {
    const savedTheme = localStorage.getItem("study_theme") || "dark";
    const savedSound = localStorage.getItem("study_sound");
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);

    if (savedSound !== null) {
      const isSound = savedSound === "true";
      setSoundEnabled(isSound);
      soundFx.toggleSound(isSound);
    }
  }, []);

  // الاستماع اللحظي (Real-time) لجدول المهام في Firestore
  useEffect(() => {
    try {
      const q = query(collection(db, "tasks"));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const loadedTasks = snapshot.docs.map((docSnap) => ({
              id: docSnap.id,
              ...docSnap.data()
            }));
            setTasks(loadedTasks);
          }
          setFirestoreError(null);
        },
        (error) => {
          console.warn("Firestore tasks error:", error);
          if (error.code === "permission-denied") {
            setFirestoreError("تنبيه: قواعد الأمان في Firebase تحتاج تفعيل لتخزين وقراءة البيانات سحابياً (البيانات محفوظة محلياً بنجاح).");
          }
        }
      );

      return () => unsubscribe();
    } catch (e) {
      console.error(e);
    }
  }, []);

  // الاستماع اللحظي (Real-time) للملاحظات في Firestore
  useEffect(() => {
    try {
      const q = query(collection(db, "notes"));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const loadedNotes = snapshot.docs.map((docSnap) => ({
              id: docSnap.id,
              ...docSnap.data()
            }));
            setNotes(loadedNotes);
          }
        },
        (error) => {
          console.warn("Firestore notes error:", error);
        }
      );

      return () => unsubscribe();
    } catch (e) {
      console.error(e);
    }
  }, []);

  // تبديل الصوت
  const handleToggleSound = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    soundFx.toggleSound(nextVal);
    localStorage.setItem("study_sound", String(nextVal));
  };

  // تبديل النمط وحماية العين
  const handleToggleTheme = () => {
    const nextTheme = theme === "dark" ? "warm" : "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("study_theme", nextTheme);
  };

  // إضافة درس متراكم جديد
  const handleAddTask = async (taskData) => {
    soundFx.playAdd();
    const tempId = "local-" + Date.now();
    const newTask = {
      id: tempId,
      ...taskData,
      completed: false,
      createdAt: null,
      completedAt: null
    };

    // حفظ محلي فوري
    setTasks((prev) => [newTask, ...prev]);

    // المزامنة مع فايربيز
    try {
      const docRef = await addDoc(collection(db, "tasks"), {
        ...taskData,
        completed: false,
        createdAt: serverTimestamp(),
        completedAt: null
      });
      // تحديث المعرف إذا نجح الفايربيز
      setTasks((prev) => prev.map((t) => t.id === tempId ? { ...t, id: docRef.id } : t));
    } catch (err) {
      console.warn("Firebase sync notice:", err);
      if (err.code === "permission-denied") {
        setFirestoreError("تنبيه: قواعد الأمان في Firebase تحتاج تفعيل لتخزين وقراءة البيانات سحابياً (البيانات محفوظة محلياً بنجاح).");
      }
    }
  };

  // إنجاز المهمة (علامة الصح + الاحتفال + الإزالة)
  const handleCompleteTask = async (task) => {
    // 1. تشغيل صوت الاحتفال
    soundFx.playCelebration();

    // 2. إظهار نافذة الاحتفال الفخمة مع الكونفيتي والرسالة الحماسية
    const subjectObj = SUBJECTS.find((s) => s.id === task.subject);
    setCelebrationData({ task, subject: subjectObj });

    // 3. تحديث فوري محلي
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, completed: true, completedAt: null } : t))
    );

    // 4. تحديث المهمة في فايربيز
    try {
      if (!task.id.startsWith("sample-") && !task.id.startsWith("local-")) {
        const taskRef = doc(db, "tasks", task.id);
        await updateDoc(taskRef, {
          completed: true,
          completedAt: serverTimestamp()
        });
      }
    } catch (err) {
      console.warn("Complete task firestore sync notice:", err);
    }
  };

  // التراجع عن الإنجاز
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
      console.warn(err);
    }
  };

  // حذف مهمة نهائياً
  const handleDeleteTask = async (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    try {
      if (!taskId.startsWith("sample-") && !taskId.startsWith("local-")) {
        await deleteDoc(doc(db, "tasks", taskId));
      }
    } catch (err) {
      console.warn("Delete task error:", err);
    }
  };

  // إضافة ملاحظة أو موعد امتحان
  const handleAddNote = async (noteData) => {
    soundFx.playAdd();
    const tempId = "note-" + Date.now();
    const newNote = {
      id: tempId,
      ...noteData,
      createdAt: null
    };

    setNotes((prev) => [newNote, ...prev]);

    try {
      const docRef = await addDoc(collection(db, "notes"), {
        ...noteData,
        createdAt: serverTimestamp()
      });
      setNotes((prev) => prev.map((n) => n.id === tempId ? { ...n, id: docRef.id } : n));
    } catch (err) {
      console.warn("Add note sync notice:", err);
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
      console.warn("Delete note error:", err);
    }
  };

  const currentSubject = SUBJECTS.find((s) => s.id === selectedSubjectId) || SUBJECTS[0];

  return (
    <div className="app-container">
      {/* الشريط العلوي */}
      <Navbar
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenRulesModal={() => setShowRulesModal(true)}
      />

      {/* تنبيه قواعد فايربيز إن وجدت */}
      {firestoreError && (
        <div 
          className="glass-panel animate-pop" 
          style={{ 
            padding: "14px 18px", 
            marginBottom: "20px", 
            background: "rgba(239, 68, 68, 0.15)", 
            borderColor: "rgba(239, 68, 68, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "10px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#f87171" }}>
            <AlertCircle size={20} />
            <span style={{ fontSize: "14px", fontWeight: "600" }}>{firestoreError}</span>
          </div>
          <button 
            onClick={() => setShowRulesModal(true)} 
            className="btn btn-primary"
            style={{ fontSize: "12.5px", padding: "6px 14px", background: "#ef4444" }}
          >
            تفعيل الـ Rules الآن
          </button>
        </div>
      )}

      {/* بطاقات الإحصائيات الشاملة */}
      <OverviewStats tasks={tasks} notes={notes} />

      {/* مؤقت بومودورو للتركيز المباشر */}
      {showTimerWidget && <PomodoroTimer />}

      {/* أزرار التبديل الرئيسية: جدول المتراكم vs الملاحظات والامتحانات */}
      <div className="main-view-tabs">
        <button
          onClick={() => setActiveTab("backlog")}
          className={`view-tab-btn ${activeTab === "backlog" ? "active" : ""}`}
        >
          <ListTodo size={18} />
          <span>جدول المتراكم حسب المواد</span>
        </button>

        <button
          onClick={() => setActiveTab("notes")}
          className={`view-tab-btn ${activeTab === "notes" ? "active" : ""}`}
        >
          <FileText size={18} />
          <span>الملاحظات ومواعيد الامتحانات ({notes.length})</span>
        </button>
      </div>

      {/* العرض الرئيسي بناءً على التبويب المختار */}
      {activeTab === "backlog" ? (
        <>
          {/* محدد المواد الستة */}
          <SubjectSelector
            selectedSubjectId={selectedSubjectId}
            onSelectSubject={setSelectedSubjectId}
            tasks={tasks}
          />

          {/* لوحة وجدول المادة المختارة */}
          <SubjectView
            subject={currentSubject}
            tasks={tasks}
            onAddTask={handleAddTask}
            onCompleteTask={handleCompleteTask}
            onDeleteTask={handleDeleteTask}
            onToggleUndoTask={handleToggleUndoTask}
          />
        </>
      ) : (
        /* قسم الملاحظات والامتحانات */
        <NotesSection
          notes={notes}
          onAddNote={handleAddNote}
          onDeleteNote={handleDeleteNote}
          activeSubjectId={selectedSubjectId}
        />
      )}

      {/* نافذة الاحتفال (عاش مووت فخور بيك كمل متوقفش) */}
      {celebrationData && (
        <CelebrationModal
          task={celebrationData.task}
          subject={celebrationData.subject}
          onClose={() => setCelebrationData(null)}
        />
      )}

      {/* نافذة إرشادات وقواعد الفايربيز */}
      {showRulesModal && (
        <FirebaseRulesModal onClose={() => setShowRulesModal(false)} />
      )}
    </div>
  );
}
