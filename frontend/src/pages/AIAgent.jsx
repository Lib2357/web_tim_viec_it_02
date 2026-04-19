import { useState } from 'react'
import { Link } from 'react-router-dom'

const conversationsTop = [
  'Create Html Game Environment...',
  'Apply To Leave For Emergency',
  'What Is UI UX Design?',
  'Create POS System',
  'What Is UX Audit?',
]

const conversationsRecent = [
  'Crypto Lending App Name',
  'Operator Grammar Types',
  'Min States For Binary DFA',
]

const assistantLongReply = [
  'Install the required libraries and set up Python environment.',
  'Load a pre-trained model or use API-based model serving.',
  'Create a chatbot loop: receive input, call model, return response.',
  'Define prompt rules and conversation memory for stable quality.',
  'Add safety checks, logging, and deployment process.',
]

const aiSuggestedJobs = [
  {
    id: 'mobile-react-native',
    title: 'Senior Mobile Developer (React Native)',
    company: 'Sky Tech Solutions',
    salary: '35M - 50M VND',
    location: 'Quan 1, TP.HCM / Hybrid',
    skills: ['React Native', 'TypeScript', 'REST API'],
  },
  {
    id: 'frontend-react',
    title: 'Frontend Developer (ReactJS)',
    company: 'Chocode Tech Editorial',
    salary: '18M - 30M VND',
    location: 'TP.HCM / Remote linh hoat',
    skills: ['React', 'Vite', 'Tailwind CSS'],
  },
  {
    id: 'backend-nodejs',
    title: 'Backend Developer (Node.js)',
    company: 'Mekong Fintech',
    salary: '25M - 40M VND',
    location: 'Ha Noi / Hybrid',
    skills: ['Node.js', 'PostgreSQL', 'Redis'],
  },
]

export default function AIAgent() {
  const [prompt, setPrompt] = useState('')
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#dff3ff_0%,#eef8ff_45%,#f8fbff_100%)] text-slate-900">
      <nav className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1560px] items-center justify-between px-6 py-2.5">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center text-xl font-bold tracking-tight text-[#2b59ff]">
              <span className="material-symbols-outlined mr-1 text-2xl">code</span>
              CHOCODE
            </Link>
            <div className="hidden items-center gap-5 text-[14px] font-medium text-slate-600 lg:flex">
              <Link to="/search-jobs" className="nav-link-animate">Viec lam IT</Link>
              <Link to="/discussions" className="nav-link-animate">Bai viet</Link>
              <Link to="/ai-agent" className="nav-link-animate font-semibold text-[#2b59ff]">AI Agent</Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/notifications" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200">
              <span className="material-symbols-outlined">notifications</span>
            </Link>
            <Link to="/messages" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200">
              <span className="material-symbols-outlined">chat</span>
            </Link>
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="block h-10 w-10 overflow-hidden rounded-full border border-slate-200 bg-slate-200 transition hover:ring-2 hover:ring-blue-100"
              >
                <img
                  alt="User"
                  className="h-full w-full object-cover"
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&h=64&fit=crop"
                />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-12 z-[60] w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.28)]">
                  <div className="border-b border-slate-100 px-3 py-2">
                    <p className="text-sm font-bold text-slate-800">Tai khoan nguoi dung</p>
                    <p className="text-xs text-slate-400">@chocode-user</p>
                  </div>
                  <div className="pt-2">
                    <Link to="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                      <span className="material-symbols-outlined text-[18px]">dashboard</span>
                      Dashboard
                    </Link>
                    <Link to="/favorites" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                      <span className="material-symbols-outlined text-[18px]">favorite</span>
                      Viec yeu thich
                    </Link>
                    <Link to="/login" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50">
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      Dang xuat
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="h-[calc(100vh-61px)] px-3 py-3 md:px-4 md:py-4">
        <div className="mx-auto h-full max-w-[1880px] rounded-[20px] border border-[#d8ebff] bg-white p-3 shadow-[0_20px_60px_-38px_rgba(36,137,210,0.45)] md:p-4">
          <div className="grid h-full grid-cols-1 gap-3 lg:grid-cols-[340px_minmax(0,1fr)]">
            <aside className="hidden h-full min-h-0 overflow-hidden rounded-[16px] border border-slate-100 bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)] lg:flex lg:flex-col">
              <div className="border-b border-slate-100 px-6 pb-4 pt-6">
                <h1 className="text-[22px] font-black tracking-[0.08em] text-slate-900">CHAT A.I+</h1>

                <div className="mt-6 flex items-center gap-3">
                  <button className="flex h-11 flex-1 items-center justify-center rounded-full bg-gradient-to-r from-[#20c3d0] via-[#2489d2] to-[#2b59ff] text-[14px] font-bold text-white shadow-[0_16px_28px_-22px_rgba(36,137,210,0.95)] transition hover:brightness-110">
                    <span className="material-symbols-outlined mr-2 text-[18px]">add</span>
                    New chat
                  </button>
                  <button className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-white transition hover:bg-slate-800">
                    <span className="material-symbols-outlined text-[18px]">search</span>
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="border-b border-slate-100 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] text-slate-500">Your conversations</p>
                    <button className="text-[13px] font-semibold text-[#2b59ff]">Clear All</button>
                  </div>
                </div>

                <div className="space-y-1 px-3 py-3">
                  {conversationsTop.map((item) => (
                    <button key={item} className="flex w-full items-center gap-3 rounded-[14px] px-3 py-3 text-left text-[13px] font-medium text-slate-700 transition hover:bg-blue-50">
                      <span className="material-symbols-outlined text-[16px] text-[#2489d2]">forum</span>
                      <span className="truncate">{item}</span>
                    </button>
                  ))}
                </div>

                <div className="mx-3 my-1 flex items-center gap-3 rounded-[14px] bg-[linear-gradient(90deg,rgba(32,195,208,0.1),rgba(43,89,255,0.1))] px-3 py-3 text-[#1e58b1] shadow-[inset_0_0_0_1px_rgba(36,137,210,0.12)]">
                  <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                  <span className="truncate text-[13px] font-semibold">Create Chatbot GPT...</span>
                  <div className="ml-auto flex items-center gap-1.5">
                    <button className="flex h-7 w-7 items-center justify-center rounded-full text-slate-500 transition hover:bg-white">
                      <span className="material-symbols-outlined text-[15px]">delete</span>
                    </button>
                    <button className="flex h-7 w-7 items-center justify-center rounded-full text-slate-500 transition hover:bg-white">
                      <span className="material-symbols-outlined text-[15px]">edit_square</span>
                    </button>
                    <span className="h-2.5 w-2.5 rounded-full bg-[#2b59ff] shadow-[0_0_12px_rgba(43,89,255,0.9)]"></span>
                  </div>
                </div>

                <div className="space-y-1 px-3 py-2">
                  <button className="flex w-full items-center gap-3 rounded-[14px] px-3 py-3 text-left text-[13px] font-medium text-slate-700 transition hover:bg-blue-50">
                    <span className="material-symbols-outlined text-[16px] text-[#2489d2]">forum</span>
                    <span className="truncate">How Chat GPT Work?</span>
                  </button>
                </div>

                <div className="border-y border-slate-100 px-6 py-4">
                  <p className="text-[13px] text-slate-400">Last 7 Days</p>
                </div>

                <div className="space-y-1 px-3 py-3">
                  {conversationsRecent.map((item, index) => (
                    <button
                      key={item}
                      className={`flex w-full items-center gap-3 rounded-[14px] px-3 py-3 text-left text-[13px] font-medium transition ${
                        index === 2 ? 'text-slate-400 opacity-50' : 'text-slate-700 hover:bg-blue-50'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px] text-[#2489d2]">forum</span>
                      <span className="truncate">{item}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-auto space-y-3 border-t border-slate-100 px-6 py-4">
                <button className="flex h-11 w-full items-center rounded-full border border-slate-200 bg-white px-4 text-[14px] font-medium text-slate-800 transition hover:bg-slate-50">
                  <span className="material-symbols-outlined mr-2 text-[18px] text-slate-500">settings</span>
                  Settings
                </button>

                <button className="flex h-11 w-full items-center rounded-full border border-slate-200 bg-white px-2 text-[14px] font-medium text-slate-800 transition hover:bg-slate-50">
                  <div className="mr-3 h-8 w-8 overflow-hidden rounded-full bg-slate-200">
                    <img
                      alt="User"
                      className="h-full w-full object-cover"
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&h=64&fit=crop"
                    />
                  </div>
                  Andrew Neilson
                </button>
              </div>
            </aside>

            <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-[16px] border border-slate-100 bg-[linear-gradient(180deg,#ffffff_0%,#fafdff_100%)]">
              <div className="flex-1 min-h-0 overflow-y-auto px-5 py-6 md:px-8">
                <div className="mx-auto w-full max-w-[1320px] space-y-7 pb-6">
                  <article>
                    <div className="mb-2.5 flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          alt="User avatar"
                          className="h-8 w-8 rounded-full object-cover"
                          src="https://images.unsplash.com/photo-1542204625-de293a6b4174?w=48&h=48&fit=crop"
                        />
                        <p className="text-[14px] leading-6 text-slate-800">Create a chatbot gpt using python language what will be step for that</p>
                      </div>
                      <button className="text-slate-400 transition hover:text-slate-600">
                        <span className="material-symbols-outlined text-[19px]">edit_square</span>
                      </button>
                    </div>

                    <div className="pl-11">
                      <p className="mb-1.5 text-[12px] font-semibold italic text-[#2489d2]">CHAT A.I+</p>
                      <p className="max-w-[1180px] text-[15px] font-semibold leading-7 text-slate-900">
                        Sure, I can help you get started with creating a chatbot using GPT in Python. Here are the basic steps you&apos;ll need to follow:
                      </p>

                      <ol className="mt-3 ml-5 max-w-[1240px] list-decimal space-y-2.5 text-[14px] leading-7 text-slate-800">
                        {assistantLongReply.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ol>

                      <p className="mt-4 max-w-[1240px] text-[14px] leading-7 text-slate-800">
                        These are just the basic steps to get started with a GPT chatbot in Python. Depending on your requirements, you may need to add more features or complexity.
                      </p>

                      <div className="mt-5 rounded-[18px] border border-[#d9ebff] bg-[linear-gradient(180deg,#f9fcff_0%,#f2f8ff_100%)] p-4 shadow-[0_16px_40px_-32px_rgba(36,137,210,0.65)]">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <div>
                            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#2489d2]">Job suggestions</p>
                            <h3 className="mt-1 text-[18px] font-black text-slate-900">Cong viec AI de xuat cho ban</h3>
                          </div>
                          <Link to="/search-jobs" className="text-[12px] font-bold text-[#2b59ff] transition hover:underline">
                            Xem tat ca
                          </Link>
                        </div>

                        <div className="grid gap-3 lg:grid-cols-3">
                          {aiSuggestedJobs.map((job) => (
                            <Link
                              key={job.id}
                              to={`/job-detail/${job.id}`}
                              className="rounded-[16px] border border-white bg-white p-4 shadow-[0_14px_30px_-28px_rgba(15,23,42,0.55)] transition hover:-translate-y-0.5 hover:border-[#cfe4ff] hover:shadow-[0_18px_32px_-26px_rgba(36,137,210,0.35)]"
                            >
                              <p className="text-[15px] font-bold leading-6 text-slate-900">{job.title}</p>
                              <p className="mt-1 text-[13px] font-medium text-slate-500">{job.company}</p>
                              <div className="mt-3 flex items-center gap-1.5 text-[13px] font-bold text-emerald-600">
                                <span className="material-symbols-outlined !text-[16px]">payments</span>
                                {job.salary}
                              </div>
                              <p className="mt-2 text-[12px] leading-5 text-slate-500">{job.location}</p>
                              <div className="mt-3 flex flex-wrap gap-2">
                                {job.skills.map((skill) => (
                                  <span key={skill} className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-5">
                        <div className="flex items-center gap-2">
                          <button className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-[#2b59ff] transition hover:bg-blue-50">
                            <span className="material-symbols-outlined text-[18px]">thumb_up</span>
                          </button>
                          <button className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition hover:bg-slate-50">
                            <span className="material-symbols-outlined text-[18px]">thumb_down</span>
                          </button>
                          <button className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition hover:bg-slate-50">
                            <span className="material-symbols-outlined text-[18px]">content_copy</span>
                          </button>
                          <button className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition hover:bg-slate-50">
                            <span className="material-symbols-outlined text-[18px]">more_vert</span>
                          </button>
                        </div>
                        <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-[13px] font-medium text-slate-700 transition hover:bg-slate-50">
                          Regenerate
                        </button>
                      </div>
                    </div>
                  </article>

                  <article>
                    <div className="mb-2.5 flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          alt="User avatar"
                          className="h-8 w-8 rounded-full object-cover"
                          src="https://images.unsplash.com/photo-1542204625-de293a6b4174?w=48&h=48&fit=crop"
                        />
                        <p className="text-[14px] leading-6 text-slate-800">What is use of that chatbot ?</p>
                      </div>
                      <button className="text-slate-400 transition hover:text-slate-600">
                        <span className="material-symbols-outlined text-[19px]">edit_square</span>
                      </button>
                    </div>

                    <div className="pl-11">
                      <p className="mb-1.5 text-[12px] font-semibold italic text-[#2489d2]">CHAT A.I+</p>
                      <p className="max-w-[1180px] text-[15px] font-semibold leading-7 text-slate-900">Chatbots can be used for a wide range of purposes.</p>
                    </div>
                  </article>
                </div>
              </div>

              <footer className="border-t border-slate-100 bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)] px-5 py-4 md:px-8">
                <div className="mx-auto w-full max-w-[1320px]">
                  <div className="flex items-center gap-3 rounded-[14px] border border-slate-200 bg-white px-4 py-3 shadow-[0_16px_32px_-26px_rgba(36,137,210,0.45)]">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e7fbfd] text-[#20c3d0]">
                      <span className="material-symbols-outlined text-[18px]">neurology</span>
                    </div>
                    <input
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="h-11 flex-1 border-0 bg-transparent text-[14px] text-slate-700 outline-none"
                      placeholder="What's in your mind?..."
                    />
                    <button className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-gradient-to-r from-[#20c3d0] via-[#2489d2] to-[#2b59ff] text-white shadow-[0_16px_28px_-20px_rgba(36,137,210,0.9)] transition hover:brightness-110">
                      <span className="material-symbols-outlined text-[18px]">send</span>
                    </button>
                  </div>
                </div>
              </footer>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
