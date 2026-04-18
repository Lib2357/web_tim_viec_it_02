import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { loadPortalMock } from '../data/mockClient.js'

export default function Discussions() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('Tat ca')
  const [forumPosts, setForumPosts] = useState([])
  const [filterOptions, setFilterOptions] = useState(['Tat ca'])

  useEffect(() => {
    const loadData = async () => {
      try {
        const mock = await loadPortalMock()
        setForumPosts(mock?.discussions?.forumPosts || [])
        setFilterOptions(mock?.discussions?.filterOptions || ['Tat ca'])
      } catch {
        setForumPosts([])
      }
    }
    loadData()
  }, [])

  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase()
    return forumPosts.filter((post) => {
      const filterOk = filter === 'Tat ca' || (post.tags || []).includes(filter)
      if (!q) return filterOk
      return filterOk && `${post.author} ${post.content} ${(post.tags || []).join(' ')}`.toLowerCase().includes(q)
    })
  }, [query, filter, forumPosts])

  return (
    <div className="min-h-screen bg-[#f0f2f5] text-slate-900">
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1160px] items-center justify-between px-6 py-2.5">
          <Link to="/" className="flex items-center text-xl font-bold tracking-tight text-[#2b59ff]">
            <span className="material-symbols-outlined mr-1 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              code
            </span>
            CHOCODE
          </Link>
          <Link to="/dashboard" className="rounded-lg bg-[#007bff] px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
            Dashboard
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-[1160px] px-6 py-5">
        <section className="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px]">
            <input
              className="h-10 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 text-[14px] outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              placeholder="Tim bai viet trong dien dan..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <select
              className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-[14px] outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              {filterOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section className="space-y-3">
          {filteredPosts.map((post) => (
            <article key={post.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-start gap-3">
                <img src={post.avatar} alt={post.author} className="h-10 w-10 rounded-full object-cover" />
                <div>
                  <p className="text-[14px] font-semibold text-slate-900">{post.author}</p>
                  <p className="text-[12px] text-slate-500">{post.role} - {post.time}</p>
                </div>
              </div>
              <p className="text-[14px] leading-6 text-slate-700">{post.content}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(post.tags || []).map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">#{tag}</span>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
                <span>Like: {post.likes ?? 0}</span>
                <span>Comments: {post.comments ?? 0}</span>
                <span>Shares: {post.shares ?? 0}</span>
              </div>
            </article>
          ))}
          {filteredPosts.length === 0 && <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">Khong co bai viet phu hop.</p>}
        </section>
      </main>
    </div>
  )
}
