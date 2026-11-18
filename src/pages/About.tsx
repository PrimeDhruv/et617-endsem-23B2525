import React from 'react';
import { Link } from 'react-router-dom';

export const About: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Identity Token Banner */}
      <div className="bg-gradient-to-r from-plant-soft via-white to-water-soft border-2 border-plant p-6 rounded-2xl shadow-sm text-center">
        <span className="text-sm font-bold uppercase tracking-wider text-plant-dark">
          ET617 Educational Technology End-Semester Examination
        </span>
        <div className="text-4xl sm:text-5xl font-black text-plant-dark my-2 tracking-tight">
          Identity Token: <span className="underline decoration-sun decoration-4">23B2525</span>
        </div>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto mt-2">
          Candidate Roll No: <strong>23B2525</strong> · Application: <strong>Bubble Lab 🌱</strong>
        </p>
      </div>

      {/* Purpose */}
      <section className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 flex items-center gap-2">
          <span>🌱 Bubble Lab — Purpose</span>
        </h1>
        <p className="text-gray-700 leading-relaxed text-lg sm:text-xl">
          <strong>Bubble Lab</strong> is an inquiry-based virtual science laboratory designed for multi-grade primary classrooms
          (Classes 3–5). It transforms the classic Class 10 photosynthesis experiment (counting oxygen bubbles from water plant <em>Hydrilla</em>)
          into an accessible, hands-on scientific investigation. Learners formulate hypotheses, manipulate light, warmth, and carbon dioxide ($CO_2$),
          run animated trials, encounter unexpected results (such as heat stress at 45°C), and revise their understanding through a non-revealing
          4-step detective hint ladder under teacher supervision.
        </p>
      </section>

      {/* Exam Card Table */}
      <section className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
          <span>📋 Official Exam Assignment Card</span>
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-gray-200 rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-plant text-white">
                <th className="p-3 sm:p-4 text-lg font-bold border-b border-plant-dark w-1/4">Field</th>
                <th className="p-3 sm:p-4 text-lg font-bold border-b border-plant-dark">Assigned Exam Value & Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-base sm:text-lg">
              <tr className="hover:bg-gray-50">
                <td className="p-3 sm:p-4 font-bold text-gray-900 bg-gray-50">Identity Token</td>
                <td className="p-3 sm:p-4 font-mono font-bold text-plant-dark text-xl">23B2525</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-3 sm:p-4 font-bold text-gray-900 bg-gray-50">Problem (P)</td>
                <td className="p-3 sm:p-4">
                  <strong className="text-plant-dark">P5 – Inquiry-based virtual laboratory</strong>
                  <div className="text-gray-600 mt-1">Simulation · Inquiry learning · Experimental reasoning. Learners manipulate variables, form hypotheses, run experiments, and interpret results.</div>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-3 sm:p-4 font-bold text-gray-900 bg-gray-50">Topic (T)</td>
                <td className="p-3 sm:p-4">
                  <strong className="text-plant-dark">T3 – Factors affecting the rate of photosynthesis</strong>
                  <div className="text-gray-600 mt-1">Class 10 topic simplified for Classes 3–5: light intensity, water temperature, dissolved carbon dioxide ($CO_2$).</div>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-3 sm:p-4 font-bold text-gray-900 bg-gray-50">Learner Context (L)</td>
                <td className="p-3 sm:p-4">
                  <strong className="text-plant-dark">L7 – Multi-grade classroom</strong>
                  <div className="text-gray-600 mt-1">One teacher, Classes 3–5 seated together, one projector screen for whole-class demonstration, and a few shared touch tablets for small groups.</div>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-3 sm:p-4 font-bold text-gray-900 bg-gray-50">Constraint (C)</td>
                <td className="p-3 sm:p-4">
                  <strong className="text-plant-dark">C5 – Teacher-in-the-loop</strong>
                  <div className="text-gray-600 mt-1">A dedicated teacher view displaying learner progress in real-time, allowing the educator to approve, edit, or override all AI-generated feedback.</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 3 Learning Outcomes */}
      <section className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
          <span>🎯 Target Learning Outcomes (Bloom's Taxonomy)</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl border border-green-200 bg-green-50/70 space-y-2">
            <span className="text-xs font-black uppercase text-green-800 bg-green-200 px-2 py-0.5 rounded-full">LO1 · Observe & Predict</span>
            <h3 className="font-bold text-gray-900 text-lg">Light & $CO_2$ Drive Growth</h3>
            <p className="text-gray-700 text-base">
              Predict and observe that light energy and dissolved $CO_2$ increase the production of oxygen bubbles in an aquatic plant.
            </p>
          </div>
          <div className="p-5 rounded-xl border border-blue-200 bg-blue-50/70 space-y-2">
            <span className="text-xs font-black uppercase text-blue-800 bg-blue-200 px-2 py-0.5 rounded-full">LO2 · Fair Testing</span>
            <h3 className="font-bold text-gray-900 text-lg">Change ONE Variable</h3>
            <p className="text-gray-700 text-base">
              Plan and execute a fair scientific test by altering only one factor at a time while holding all other conditions constant.
            </p>
          </div>
          <div className="p-5 rounded-xl border border-amber-200 bg-amber-50/70 space-y-2">
            <span className="text-xs font-black uppercase text-amber-800 bg-amber-200 px-2 py-0.5 rounded-full">LO3 · Misconception</span>
            <h3 className="font-bold text-gray-900 text-lg">Heat Stress at 45°C</h3>
            <p className="text-gray-700 text-base">
              Analyze surprise findings that higher temperature is not always better: 25–35°C is optimal, but 45°C causes biological heat stress.
            </p>
          </div>
        </div>
      </section>

      {/* Persona & Classroom Dynamics */}
      <section className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
          <span>👥 Multi-Grade Classroom & Persona</span>
        </h2>
        <div className="space-y-3 text-gray-700 text-lg">
          <p>
            In a composite Indian rural/semi-urban classroom, a single teacher orchestrates learning across three grades simultaneously:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-base sm:text-lg">
            <li>
              <strong>🌱 Seedling (Class 3):</strong> Focuses on visual observation, predicting, and counting rising bubbles. Simplified text, large emojis, softer guidance.
            </li>
            <li>
              <strong>🌿 Sapling (Class 4):</strong> Engages in fair-test reasoning. Learns why changing two variables at once makes a test invalid.
            </li>
            <li>
              <strong>🌳 Tree (Class 5):</strong> Reads bar charts, connects numerical evidence to physiological explanations, and formulates reasoned hypotheses.
            </li>
          </ul>
          <p className="mt-2">
            <strong>Orchestration Modes:</strong> <em>Class Mode</em> supports hands-up voting on a projector screen, while <em>Group Mode</em> enables shared tablet teams (🐯 Tigers, 🦜 Parrots, 🐘 Elephants, 🐢 Turtles) with role rotation.
          </p>
        </div>
      </section>

      {/* How AI is Used */}
      <section className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
          <span>🤖 How AI is Used (Teacher-in-the-Loop Constraint C5)</span>
        </h2>
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-gray-800 space-y-2 text-base sm:text-lg">
          <p>
            <strong>Pedagogical AI Role:</strong> The AI acts as a gentle, inquiry-guided tutor. It analyzes student open-ended explanations (Task 5), assesses whether known misconceptions (M1: <em>"Hotter is always better"</em>; M2: <em>"Plants make food in dark"</em>) are present, and generates a short feedback question (&le; 30 words) that guides the child without revealing the answer.
          </p>
          <p>
            <strong>Strict Teacher-in-the-Loop (C5):</strong> No AI-generated output is ever shown to children directly. All AI outputs enter the Teacher Dashboard as <span className="bg-amber-200 px-2 py-0.5 rounded font-mono text-sm font-bold">pending</span>. The teacher can:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-sm sm:text-base">
            <li><strong>Approve (✅):</strong> Release the feedback to the learner as-is.</li>
            <li><strong>Edit (✏️):</strong> Modify the wording to suit a specific child's reading capability.</li>
            <li><strong>Override (🔁):</strong> Replace with calibrated teacher presets or custom instructional text.</li>
          </ul>
          <p className="text-sm text-gray-600 pt-2 border-t border-amber-200">
            <strong>📴 Guaranteed Offline Fallback:</strong> If Gemini is unreachable or offline, deterministic rule-based keyword matching provides immediate fallback hints tagged as <em>Offline feedback</em>, still requiring teacher approval.
          </p>
        </div>
      </section>

      {/* Project Credits & Viva Info */}
      <section className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-3">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Credits & Viva Disclosure</h2>
        <p className="text-gray-700 text-base sm:text-lg">
          Built with <strong>Vite, React 18, TypeScript, Tailwind CSS</strong>; AI-assisted development (Antigravity, Claude). AI chat logs disclosed in examination report.
        </p>
        <p className="text-sm text-gray-500">
          Target Deployment: <code className="bg-gray-100 px-2 py-1 rounded text-gray-800">et617-23b2525.vercel.app</code> · GitHub: <code className="bg-gray-100 px-2 py-1 rounded text-gray-800">et617-endsem-23b2525</code>
        </p>
        <div className="pt-4 flex gap-4">
          <Link
            to="/"
            className="min-h-touch px-6 py-3 rounded-xl bg-plant text-white font-bold text-lg hover:bg-plant-dark transition-colors inline-flex items-center justify-center gap-2 shadow"
          >
            <span>🚀 Launch Bubble Lab</span>
          </Link>
          <Link
            to="/teacher"
            className="min-h-touch px-6 py-3 rounded-xl bg-amber-100 text-amber-900 font-bold text-lg hover:bg-amber-200 transition-colors inline-flex items-center justify-center gap-2 border border-amber-300"
          >
            <span>👩‍🏫 Open Teacher Dashboard</span>
          </Link>
        </div>
      </section>
    </div>
  );
};
