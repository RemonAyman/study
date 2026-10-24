import React, { useState, useMemo } from "react";
import { SUBJECTS } from "../data/subjects";
import { PERIOD_HEADERS } from "../data/scheduleData";
import SubjectIcon from "./SubjectIcon";
import {
  Calendar,
  Clock,
  Sun,
  Moon,
  Lock,
  Flame,
  Coffee,
  Sparkles,
  ArrowLeft,
  Edit3,
  RotateCcw,
  Check,
  X
} from "lucide-react";

export default function WeeklySchedule({
  schedule,
  tasks,
  onSelectSubject,
  onUpdateSchedule,
  onResetSchedule
}) {
  const [viewMode, setViewMode] = useState("all"); // "all" | "today"
  const [editingSlot, setEditingSlot] = useState(null); // { dayId, slotId, ... }
  const [isEditMode, setIsEditMode] = useState(false);

  // حساب اليوم الحالي في الأسبوع (0 = الأحد، 6 = السبت)
  const [currentDayOfWeek] = useState(() => new Date().getDay());

  // حساب إجمالي الدروس المتراكمة النشطة في كل المواد
  const totalPendingTasks = tasks.filter((t) => !t.completed).length;

  // فتح نافذة تعديل الحصة
  const handleOpenEditSlot = (day, slot) => {
    setEditingSlot({
      dayId: day.id,
      dayName: day.name,
      slotId: slot.id,
      period: slot.period,
      type: slot.type || "subject",
      subjectId: slot.subjectId || "chemistry",
      title: slot.title || "",
      note: slot.note || ""
    });
  };

  // حفظ تعديل الحصة
  const handleSaveSlotEdit = (e) => {
    e.preventDefault();
    if (!editingSlot) return;

    const updatedSchedule = schedule.map((day) => {
      if (day.id !== editingSlot.dayId) return day;

      const updatedSlots = day.slots.map((s) => {
        if (s.id !== editingSlot.slotId) return s;
        return {
          ...s,
          type: editingSlot.type,
          subjectId: editingSlot.type === "subject" ? editingSlot.subjectId : null,
          title: editingSlot.title,
          note: editingSlot.note
        };
      });

      return { ...day, slots: updatedSlots };
    });

    onUpdateSchedule(updatedSchedule);
    setEditingSlot(null);
  };

  // تصفية الأيام المعروضة
  const displayedDays = viewMode === "today"
    ? schedule.filter((d) => d.dayIndex === currentDayOfWeek)
    : schedule;

  return (
    <div className="weekly-schedule-view">
      {/* 1. رأس صفحة جدول الحصص */}
      <div className="schedule-header-card luxury-glass">
        <div className="schedule-header-title-box">
          <div className="schedule-calendar-badge">
            <Calendar size={28} color="var(--theme-accent)" />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <h2 className="schedule-main-heading">
                جدول الحصص المدرسي وخريطة الأسبوع
              </h2>
              <span className="schedule-badge-pill">
                <Sparkles size={13} />
                <span>مستوحى من كشكول الملاحظات 📝</span>
              </span>
            </div>
            <p className="schedule-sub-heading">
              الأيام على اليمين والحصص في الأعلى.. اضغط على أي مادة للانتقال المباشر لدروسها المتراكمة وإدارتها فوراً!
            </p>
          </div>
        </div>

        {/* أدوات التحكم والتبديل */}
        <div className="schedule-actions-row">
          {/* إحصائية المتراكم العام السريعة */}
          <div className="quick-pending-pill">
            <Flame size={16} color="#ef4444" />
            <span>إجمالي المتراكم: <strong>{totalPendingTasks} دروس</strong></span>
          </div>

          {/* تبديل العرض بين الأسبوع كامل واليوم الحالي */}
          <div className="view-toggle-pills">
            <button
              type="button"
              onClick={() => setViewMode("all")}
              className={`view-toggle-btn ${viewMode === "all" ? "active" : ""}`}
            >
              الأسبوع كاملاً
            </button>
            <button
              type="button"
              onClick={() => setViewMode("today")}
              className={`view-toggle-btn ${viewMode === "today" ? "active" : ""}`}
            >
              اليوم فقط 📍
            </button>
          </div>

          {/* زر وضع التعديل للجدول */}
          <button
            type="button"
            onClick={() => setIsEditMode(!isEditMode)}
            className={`btn-soft ${isEditMode ? "edit-active" : ""}`}
            style={{ fontSize: "13px", padding: "8px 16px" }}
          >
            <Edit3 size={15} />
            <span>{isEditMode ? "إنهاء التعديل" : "تعديل الحصص"}</span>
          </button>

          {/* زر استعادة الجدول الافتراضي المكتوب في الكشكول */}
          <button
            type="button"
            onClick={onResetSchedule}
            className="btn-soft"
            title="استرجاع الجدول الافتراضي كما كُتب بالدفتر"
            style={{ fontSize: "13px", padding: "8px 14px" }}
          >
            <RotateCcw size={15} />
            <span>استعادة جدول الكشكول</span>
          </button>
        </div>
      </div>

      {/* 2. جدول الحصص الأسبوعي الفاخر (School Timetable Table) */}
      <div className="schedule-table-container luxury-glass">
        <div className="schedule-table-scroll-wrapper">
          <table className="school-timetable-grid">
            {/* صف العناوين: الحصص من فوق */}
            <thead>
              <tr>
                <th className="th-day-col">
                  <div className="th-content-box">
                    <Calendar size={17} />
                    <span>اليوم / الحصص</span>
                  </div>
                </th>

                {PERIOD_HEADERS.map((period) => {
                  const IconComponent =
                    period.icon === "Sun" ? Sun : period.icon === "Moon" ? Moon : Clock;
                  return (
                    <th key={period.id} className="th-period-col">
                      <div className="period-header-wrapper">
                        <div className="period-header-icon-box">
                          <IconComponent size={18} color="var(--theme-accent)" />
                        </div>
                        <div>
                          <div className="period-header-title">
                            {period.title}
                          </div>
                          <div className="period-header-time">
                            {period.time}
                          </div>
                        </div>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            {/* صفوف الأيام: الأيام من على اليمين */}
            <tbody>
              {displayedDays.map((day) => {
                const isToday = day.dayIndex === currentDayOfWeek;

                return (
                  <tr
                    key={day.id}
                    className={`timetable-day-row ${isToday ? "is-current-day-row" : ""}`}
                  >
                    {/* عمود اليوم في اليمين */}
                    <td className="td-day-col">
                      <div className="day-name-wrapper">
                        <div className="day-name-primary">
                          {day.name}
                        </div>
                        {isToday && (
                          <span className="today-glowing-indicator">
                            <span className="today-pulse-dot" />
                            <span>اليوم 🌟</span>
                          </span>
                        )}
                        <span className="day-sub-badge">
                          {day.badge}
                        </span>
                      </div>
                    </td>

                    {/* خانات الحصص الثلاث لكل يوم */}
                    {day.slots.map((slot) => {
                      // لو كانت الحصة مادة دراسية
                      if (slot.type === "subject") {
                        const subjectObj = SUBJECTS.find((s) => s.id === slot.subjectId) || {
                          id: slot.subjectId,
                          name: slot.subjectId,
                          iconName: "BookOpen",
                          tagline: ""
                        };

                        const pendingCount = tasks.filter(
                          (t) => t.subject === slot.subjectId && !t.completed
                        ).length;

                        return (
                          <td key={slot.id} className="td-period-cell">
                            <div
                              onClick={() => {
                                if (!isEditMode) {
                                  onSelectSubject(slot.subjectId);
                                }
                              }}
                              className={`subject-slot-card luxury-glass ${
                                isEditMode ? "in-edit-mode" : "clickable"
                              }`}
                              title={
                                isEditMode
                                  ? "اضغط لتعديل هذه الحصة"
                                  : `اضغط للدخول لمتراكم مادة ${subjectObj.name} وتعديله أو إنهائه`
                              }
                            >
                              {/* شريط رأس الحصة */}
                              <div className="slot-card-top-row">
                                <div className="slot-subject-badge">
                                  <div className="slot-icon-avatar">
                                    <SubjectIcon name={subjectObj.iconName} size={18} />
                                  </div>
                                  <span className="slot-subject-title">
                                    {subjectObj.name}
                                  </span>
                                </div>

                                {/* بادج المتراكم اللحظي لهذه المادة */}
                                {pendingCount > 0 ? (
                                  <span className="slot-backlog-badge alert">
                                    <Flame size={12} />
                                    <span>{pendingCount} متراكم</span>
                                  </span>
                                ) : (
                                  <span className="slot-backlog-badge clean">
                                    <Check size={12} strokeWidth={3} />
                                    <span>مفيش متراكم</span>
                                  </span>
                                )}
                              </div>

                              {/* عنوان النشاط أو الملاحظة (كما في الكشكول) */}
                              <div className="slot-activity-title">
                                {slot.title || `مذاكرة ${subjectObj.name}`}
                              </div>

                              {slot.note && (
                                <div className="slot-activity-note">
                                  {slot.note}
                                </div>
                              )}

                              {/* دعوة للإجراء (CTA) للانتقال إلى المتراكم المباشر */}
                              <div className="slot-card-footer-cta">
                                <span className="slot-click-hint">
                                  {isEditMode ? "اضغط للتعديل" : "افتح المتراكم الآن"}
                                </span>
                                {isEditMode ? (
                                  <Edit3 size={14} color="var(--theme-accent)" />
                                ) : (
                                  <ArrowLeft size={14} />
                                )}
                              </div>

                              {/* زر تعديل سريع عند تفعيل وضع التعديل */}
                              {isEditMode && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenEditSlot(day, slot);
                                  }}
                                  className="slot-quick-edit-btn"
                                  title="تعديل تفاصيل الحصة"
                                >
                                  <Edit3 size={14} />
                                </button>
                              )}
                            </div>
                          </td>
                        );
                      }

                      // لو كانت الحصة فترة مقفولة (دروس / سنتر خارج البيت)
                      if (slot.type === "locked") {
                        return (
                          <td key={slot.id} className="td-period-cell">
                            <div
                              onClick={() => {
                                if (isEditMode) handleOpenEditSlot(day, slot);
                              }}
                              className={`locked-slot-card ${isEditMode ? "in-edit-mode" : ""}`}
                            >
                              <div className="locked-slot-header">
                                <Lock size={16} color="#fbbf24" />
                                <span className="locked-slot-badge">وقت محجوز بالسنتر</span>
                              </div>
                              <div className="locked-slot-title">
                                {slot.title}
                              </div>
                              {slot.note && (
                                <div className="locked-slot-note">
                                  {slot.note}
                                </div>
                              )}

                              {isEditMode && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenEditSlot(day, slot);
                                  }}
                                  className="slot-quick-edit-btn"
                                  title="تعديل تفاصيل الحصة"
                                >
                                  <Edit3 size={14} />
                                </button>
                              )}
                            </div>
                          </td>
                        );
                      }

                      // لو كانت الحصة مخصصة لتصفية البواقي والمتراكم
                      if (slot.type === "backlog") {
                        return (
                          <td key={slot.id} className="td-period-cell">
                            <div
                              onClick={() => {
                                if (isEditMode) {
                                  handleOpenEditSlot(day, slot);
                                }
                              }}
                              className={`backlog-slot-card ${isEditMode ? "in-edit-mode" : ""}`}
                            >
                              <div className="backlog-slot-header">
                                <Flame size={16} color="#f97316" />
                                <span className="backlog-slot-badge">تصفية المتراكم ⚡</span>
                              </div>
                              <div className="backlog-slot-title">
                                {slot.title}
                              </div>
                              <div className="backlog-slot-note">
                                {totalPendingTasks > 0
                                  ? `لديك ${totalPendingTasks} دروس متراكمة تنتظر التصفية!`
                                  : "لا يوجد أي متراكم حالياً، استمر بالتميز!"}
                              </div>

                              {isEditMode && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenEditSlot(day, slot);
                                  }}
                                  className="slot-quick-edit-btn"
                                  title="تعديل تفاصيل الحصة"
                                >
                                  <Edit3 size={14} />
                                </button>
                              )}
                            </div>
                          </td>
                        );
                      }

                      // الحصة وقت حر أو استراحة (free)
                      return (
                        <td key={slot.id} className="td-period-cell">
                          <div
                            onClick={() => {
                              if (isEditMode) handleOpenEditSlot(day, slot);
                            }}
                            className={`free-slot-card ${isEditMode ? "in-edit-mode" : ""}`}
                          >
                            <div className="free-slot-header">
                              <Coffee size={16} color="#34d399" />
                              <span className="free-slot-badge">استراحة وشحن</span>
                            </div>
                            <div className="free-slot-title">
                              {slot.title}
                            </div>
                            {slot.note && (
                              <div className="free-slot-note">
                                {slot.note}
                              </div>
                            )}

                            {isEditMode && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenEditSlot(day, slot);
                                }}
                                className="slot-quick-edit-btn"
                                title="تعديل تفاصيل الحصة"
                              >
                                <Edit3 size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. نافذة تعديل بيانات الحصة الفاخرة (Modal) */}
      {editingSlot && (
        <div className="modal-backdrop-luxury">
          <div className="modal-dialog-luxury luxury-glass">
            <div className="modal-dialog-header">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Edit3 size={20} color="var(--theme-accent)" />
                <h3 style={{ fontSize: "18px", fontWeight: "900", color: "#fff" }}>
                  تعديل حصة: {editingSlot.dayName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingSlot(null)}
                className="icon-circle-btn"
                style={{ width: "32px", height: "32px" }}
              >
                <X size={17} />
              </button>
            </div>

            <form onSubmit={handleSaveSlotEdit} className="modal-form-body">
              {/* اختيار نوع الحصة */}
              <div className="form-field-group">
                <label className="form-field-label">نوع الحصة / الفترة:</label>
                <select
                  value={editingSlot.type}
                  onChange={(e) => setEditingSlot({ ...editingSlot, type: e.target.value })}
                  className="modal-select-input"
                >
                  <option value="subject">مادة دراسية (مع ربط المتراكم المباشر) 📚</option>
                  <option value="locked">وقت مقفول (دروس / سنتر خارج البيت) 🔒</option>
                  <option value="backlog">فترة تصفية متراكم (بواقي) ⚡</option>
                  <option value="free">وقت حر واستراحة وشحن طاقة ☕</option>
                </select>
              </div>

              {/* لو كانت الحصة مادة دراسية: اختيار المادة */}
              {editingSlot.type === "subject" && (
                <div className="form-field-group">
                  <label className="form-field-label">المادة الدراسية:</label>
                  <select
                    value={editingSlot.subjectId}
                    onChange={(e) => setEditingSlot({ ...editingSlot, subjectId: e.target.value })}
                    className="modal-select-input"
                  >
                    {SUBJECTS.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name} ({sub.englishName})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* اسم الحصة أو النشاط */}
              <div className="form-field-group">
                <label className="form-field-label">عنوان النشاط / الحصة:</label>
                <input
                  type="text"
                  value={editingSlot.title}
                  onChange={(e) => setEditingSlot({ ...editingSlot, title: e.target.value })}
                  placeholder="مثال: مراجعة الكيمياء الصبح، حل شيت، ..."
                  required
                  className="modal-text-input"
                />
              </div>

              {/* ملاحظة أو توقيت إضافي */}
              <div className="form-field-group">
                <label className="form-field-label">ملاحظة إضافية أو تفاصيل:</label>
                <input
                  type="text"
                  value={editingSlot.note}
                  onChange={(e) => setEditingSlot({ ...editingSlot, note: e.target.value })}
                  placeholder="مثال: الباب الأول، حفظ القوانين، ..."
                  className="modal-text-input"
                />
              </div>

              {/* أزرار الحفظ والإلغاء */}
              <div className="modal-form-actions">
                <button type="submit" className="btn-glow" style={{ padding: "10px 24px" }}>
                  <Check size={17} />
                  <span>حفظ التعديل</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditingSlot(null)}
                  className="btn-soft"
                  style={{ padding: "10px 20px" }}
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
