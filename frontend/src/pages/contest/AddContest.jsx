import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createContest, getContestById, updateContest } from '../../api/contestApi';
import { toast } from 'react-toastify';
import { handleError, handleSuccess } from '../../utils/toastFunctions';

function AddContest() {
    const navigate = useNavigate();
    const { id } = useParams();

        const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        title: "",
        description: "",
        startTime: "",
        endTime: "",
        duration: "",
        isPublic: true,
        rules: "",
    });

    // Helpers
    const toDatetimeLocal = (iso) => {
    if (!iso) return "";
        const d = new Date(iso);
        // Convert to local and format as yyyy-MM-ddThh:mm
        const pad = (n) => String(n).padStart(2, "0");
        const yyyy = d.getFullYear();
        const MM = pad(d.getMonth() + 1);
        const dd = pad(d.getDate());
        const hh = pad(d.getHours());
        const mm = pad(d.getMinutes());
        return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
    };

    const toIsoFromLocal = (localStr) => {
        // localStr is like '2025-08-18T13:30'
        if (!localStr) return null;
        const d = new Date(localStr);
        return d.toISOString();
    };

    useEffect(()=>{
        const fetchContest = async () => {
            try {
                const res = await getContestById(id);
                if (res?.success){
                    const c = res.contest || {};
                    setForm({
                        title: c.title ?? "",
                        description: c.description ?? "",
                        // Controller returns start_time/end_time
                        startTime: toDatetimeLocal(c.start_time || c.startTime),
                        endTime: toDatetimeLocal(c.end_time || c.endTime),
                        duration: c.duration ?? "",
                        isPublic: typeof c.isPublic === "boolean" ? c.isPublic : c.isPublic ?? true,
                        rules: c.rules ?? "",
                    });
                }else{
                    handleError(res?.message)
                }
            } catch (error) {
                handleError(error?.message || "Server Error")
            }
        }
        if (id){
            fetchContest();
        }
    },[id,])

    const updateField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

    const validate = () => {
        if (!form.title.trim()) return "Title is required";
        if (!form.startTime) return "Start time is required";
        if (!form.endTime) return "End time is required";
        const start = new Date(form.startTime);
        const end = new Date(form.endTime);
        if (start >= end) return "Start time must be before end time";
        if (form.duration && Number(form.duration) < 0) return "Duration cannot be negative";
        return null;
    };

    const handleSubmit = async (e) =>{
        e.preventDefault();
        const payload = {
            title: form.title.trim(),
            description: form.description.trim(),
            startTime: toIsoFromLocal(form.startTime),
            endTime: toIsoFromLocal(form.endTime),
            duration: form.duration ? Number(form.duration) : undefined,
            isPublic: Boolean(form.isPublic),
            rules: form.rules.trim(),
        };
        if (id){
            try {
                const res = await updateContest(id, payload);
                if (res.success){
                    handleSuccess(res.message);
                    navigate('/admin/contests');
                }else{
                    handleError(res.message)
                }
            } catch (error) {
                handleError(error.message || "Error saving contest!")
            }
        }else{
            try {
                const res = await createContest(payload);
                if (res.success){
                    handleSuccess(res.message);
                    navigate('/admin/contests');
                }else{
                    handleError(res.message)
                }
            } catch (error) {
                handleError(error.message || "Error saving contest!")
            }
        }
    }

  return (
    <div className="h-full w-full p-4 text-gray-900 dark:text-gray-100 sm:p-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {id ? "Update Contest" : "Create Contest"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5 rounded-2xl border border-gray-200 bg-gray-50 p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          {/* Title */}
          <div className="grid gap-2">
            <label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Title<span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="Ex: Weekly Contest #12"
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:focus:ring-blue-900"
            />
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <textarea
              id="description"
              rows={4}
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Describe the rules, format, and prizes (optional)"
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:focus:ring-blue-900"
            />
          </div>

          {/* Times */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <label htmlFor="startTime" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Start time<span className="text-red-500">*</span>
              </label>
              <input
                id="startTime"
                type="datetime-local"
                value={form.startTime}
                onChange={(e) => updateField("startTime", e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:focus:ring-blue-900"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="endTime" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                End time<span className="text-red-500">*</span>
              </label>
              <input
                id="endTime"
                type="datetime-local"
                value={form.endTime}
                onChange={(e) => updateField("endTime", e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:focus:ring-blue-900"
              />
            </div>
          </div>

          {/* Duration + Visibility */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <label htmlFor="duration" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Duration (minutes)<span className="text-red-500">*</span>
              </label>
              <input
                id="duration"
                type="number"
                min="0"
                value={form.duration}
                onChange={(e) => updateField("duration", e.target.value)}
                placeholder="Duration in minutes"
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:focus:ring-blue-900"
              />
            </div>

            <div className="grid gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Visibility</span>
              <div className="flex items-center justify-between rounded-xl border border-gray-300 bg-gray-50 p-2 dark:border-gray-700 dark:bg-gray-800">
                <div>
                  <p className="text-sm font-medium">Public contest</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Appears in listings and practice after finish</p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={form.isPublic}
                    onChange={(e) => updateField("isPublic", e.target.checked)}
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-300 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-blue-600 peer-checked:after:translate-x-5 dark:bg-gray-600 dark:after:bg-gray-100" />
                </label>
              </div>
            </div>
          </div>

          {/* Rules */}
          <div className="grid gap-2">
            <label htmlFor="rules" className="text-sm font-medium text-gray-700 dark:text-gray-300">Rules</label>
            <textarea
              id="rules"
              rows={4}
              value={form.rules}
              onChange={(e) => updateField("rules", e.target.value)}
              placeholder="Optional: scoring rules, penalties, languages allowed, etc."
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:focus:ring-blue-900"
            />
          </div>

          {/* Actions */}
          <div className="mt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 active:scale-[0.98] dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              {loading ? 'Saving...' : id ? "Save changes" : "Create contest"}
            </button>
          </div>
        </form>

        {/* Helpful tips */}
        <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
          <p>
            Tip: If you set a <span className="font-medium">Duration</span>, you can treat it as per-user timer for virtual contests.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AddContest
