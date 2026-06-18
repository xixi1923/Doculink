import React, { useState, useEffect, useRef } from 'react'
import {
  User,
  Bell,
  Lock,
  Eye,
  Globe,
  Trash2,
  ChevronRight,
  Shield,
  Smartphone,
  Loader2
} from 'lucide-react'
import { getProfile, updateProfile, updateAvatar } from '@/api/authApi'
import { User as UserType } from '@/types'
import { useAuthStore } from '@/store/authStore'

// ================= TYPES & INTERFACES =================
type SettingSection = 'profile' | 'account' | 'notifications' | 'privacy';

interface MenuItem {
  id: SettingSection;
  label: string;
  icon: React.ComponentType<{ size: number | string; className?: string }>;
}

export default function Settings(): React.JSX.Element {
  const [activeSection, setActiveSection] = useState<SettingSection>('profile')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [profile, setProfile] = useState<Partial<UserType>>({
    name: '',
    email: '',
    bio: '',
    school: '',
    university: '',
    major: ''
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { setAuth, token } = useAuthStore()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile()
        setProfile({
          name: data.name || '',
          email: data.email || '',
          bio: data.bio || '',
          school: data.school || '',
          university: data.university || '',
          major: data.major || '',
          avatar: data.avatar || undefined
        })
      } catch (error) {
        console.error('Failed to fetch profile', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await updateProfile(profile)
      const updatedUser = response.user
      if (token) {
        setAuth({
          uid: updatedUser.id.toString(),
          email: updatedUser.email,
          displayName: updatedUser.name,
          photoURL: updatedUser.avatar || null
        }, token)
      }
      // Success feedback could be added here
    } catch (error) {
      console.error('Failed to update profile', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('avatar', file)

    setIsSaving(true)
    try {
      const response = await updateAvatar(formData)
      const updatedUser = response.user
      setProfile(prev => ({ ...prev, avatar: response.url }))
      setImageError(false)

      if (token) {
        setAuth({
          uid: updatedUser.id.toString(),
          email: updatedUser.email,
          displayName: updatedUser.name,
          photoURL: response.url || null
        }, token)
      }
    } catch (error) {
      console.error('Failed to upload avatar', error)
    } finally {
      setIsSaving(false)
    }
  }

  // ================= MENU REGISTRY =================
  const menuItems: MenuItem[] = [
    { id: 'profile', label: 'Edit Profile', icon: User },
    { id: 'account', label: 'Account Settings', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
      </div>
    )
  }

  const initials = profile.name
    ? profile.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'U'

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 font-sans text-slate-800 dark:text-slate-200 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom duration-500">

      {/* ================= HEADER SECTION ================= */}
      <div className="mb-10">
        <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest bg-teal-500/10 px-3.5 py-1 rounded-full">
          Preferences
        </span>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-3">Settings</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">

        {/* ================= SIDEBAR NAVIGATION ================= */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-xs space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-[#0b1329] text-teal-400 shadow-sm border border-slate-800'
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <item.icon size={14} className={activeSection === item.id ? 'text-teal-400' : ''} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* ================= MAIN CONTENT VIEWPORT ================= */}
        <main className="flex-grow">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-xs p-6 md:p-10 min-h-[580px] transition-all duration-300">

            {/* 1. PROFILE SECTION LAYER */}
            {activeSection === 'profile' && (
              <div className="space-y-8 motion-safe:animate-in motion-safe:fade-in duration-300">
                <section>
                  <h2 className="text-base font-black text-slate-900 dark:text-white mb-6">Public Profile Settings</h2>
                  <div className="space-y-6">

                    {/* Avatar Customizer Group */}
                    <div className="flex items-center gap-5">
                      <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-teal-600 dark:text-teal-400 text-xl font-black shadow-inner border border-slate-200 dark:border-slate-700 shrink-0 overflow-hidden select-none">
                        {profile.avatar && !imageError ? (
                          <img
                            src={profile.avatar}
                            alt={profile.name}
                            className="w-full h-full object-cover"
                            onError={() => setImageError(true)}
                          />
                        ) : (
                          <span>{initials}</span>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleAvatarChange}
                          accept="image/*"
                          className="hidden"
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isSaving}
                          className="px-4 py-2 bg-teal-500 text-white text-[10px] font-extrabold uppercase tracking-wider rounded-xl hover:bg-teal-600 transition-all shadow-sm shadow-teal-500/10 hover:-translate-y-0.5 disabled:opacity-50"
                        >
                          {isSaving ? 'Uploading...' : 'Change Avatar'}
                        </button>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">JPG, GIF or PNG. Max size file allocation limit 2MB</p>
                      </div>
                    </div>

                    {/* Standard Input Form Structure */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-0.5">Display Name</label>
                        <input
                          type="text"
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:border-teal-500/50 outline-none transition-colors"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-0.5">Email Address</label>
                        <input
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:border-teal-500/50 outline-none transition-colors"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-0.5">High School / Education</label>
                        <input
                          type="text"
                          placeholder="e.g. Bak Touk High School"
                          value={profile.school}
                          onChange={(e) => setProfile({ ...profile, school: e.target.value })}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:border-teal-500/50 outline-none transition-colors"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-0.5">University (If applicable)</label>
                        <input
                          type="text"
                          placeholder="e.g. RUPP"
                          value={profile.university}
                          onChange={(e) => setProfile({ ...profile, university: e.target.value })}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:border-teal-500/50 outline-none transition-colors"
                        />
                      </div>

                      <div className="md:col-span-2 space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-0.5">Major / Grade Level</label>
                        <input
                          type="text"
                          placeholder="e.g. Grade 12 or Computer Science"
                          value={profile.major}
                          onChange={(e) => setProfile({ ...profile, major: e.target.value })}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:border-teal-500/50 outline-none transition-colors"
                        />
                      </div>

                      <div className="md:col-span-2 space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-0.5">Biography Statement</label>
                        <textarea
                          rows={4}
                          value={profile.bio}
                          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:border-teal-500/50 outline-none transition-colors resize-none"
                          placeholder="Write a brief educational description summary concerning yourself..."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800/40">
                   <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-teal-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-teal-600 transition-all shadow-sm shadow-teal-500/10 hover:-translate-y-0.5 flex items-center gap-2"
                   >
                     {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                     Save Changes
                   </button>
                </div>
              </div>
            )}

            {/* 2. ACCOUNT SECURITY LAYER */}
            {activeSection === 'account' && (
              <div className="space-y-8 motion-safe:animate-in motion-safe:fade-in duration-300">
                <section>
                  <h2 className="text-base font-black text-slate-900 dark:text-white mb-6">Security & Authentication</h2>
                  <div className="space-y-3">

                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800/60 hover:border-teal-500/30 transition-all cursor-pointer group">
                       <div className="flex items-center gap-3.5">
                          <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl text-slate-400 group-hover:text-teal-500 transition-colors border border-slate-100 dark:border-slate-800">
                             <Lock size={16} />
                          </div>
                          <div>
                             <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">Change Master Password</h4>
                             <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Update your secure profile system access key</p>
                          </div>
                       </div>
                       <ChevronRight size={14} className="text-slate-300 group-hover:translate-x-0.5 transition-transform" />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800/60 hover:border-teal-500/30 transition-all cursor-pointer group">
                       <div className="flex items-center gap-3.5">
                          <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl text-slate-400 group-hover:text-teal-500 transition-colors border border-slate-100 dark:border-slate-800">
                             <Smartphone size={16} />
                          </div>
                          <div>
                             <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">Two-Factor Authentication (2FA)</h4>
                             <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Secure operations using dual validation keys</p>
                          </div>
                       </div>
                       <div className="bg-emerald-500/10 text-emerald-600 text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wide">Enabled</div>
                    </div>
                  </div>
                </section>

                {/* Account Destruction Zone */}
                <section className="pt-8 border-t border-slate-100 dark:border-slate-800/40">
                  <h2 className="text-base font-black text-rose-500 mb-4">Danger Zone Operations</h2>
                  <div className="p-5 bg-rose-500/[0.02] dark:bg-rose-500/5 rounded-2xl border border-rose-100 dark:border-rose-500/10">
                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                        <div className="space-y-0.5">
                           <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">Deactivate Repository Account</h4>
                           <p className="text-[11px] text-slate-400 max-w-sm leading-relaxed font-light">Permanently clear out your cloud uploader record nodes and asset indices. This lifecycle operation is irreversible.</p>
                        </div>
                        <button className="px-4 py-2.5 bg-rose-500 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl hover:bg-rose-600 transition-colors flex items-center gap-1.5 shrink-0 shadow-xs">
                           <Trash2 size={14} /> Delete Account
                        </button>
                     </div>
                  </div>
                </section>
              </div>
            )}

            {/* 3. NOTIFICATIONS PREFERENCES LAYER */}
            {activeSection === 'notifications' && (
              <div className="space-y-8 motion-safe:animate-in motion-safe:fade-in duration-300">
                 <section>
                    <h2 className="text-base font-black text-slate-900 dark:text-white mb-6">Channel Preferences</h2>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                       {[
                         { title: 'Peer Material Releases', desc: 'Alert when contributors inside your active network log files' },
                         { title: 'Direct Communications', desc: 'Ping alerts when peer inquiries route through internal discussions' },
                         { title: 'DocuLink Network Diagnostics', desc: 'General patch updates regarding education schema additions' },
                         { title: 'Workspace Mentions', desc: 'Receive instant feedback loops when your profile handle is cited' },
                       ].map((item, idx) => (
                         <div key={idx} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                            <div className="pr-4">
                               <h4 className="text-xs font-extrabold text-slate-900 dark:text-white leading-normal">{item.title}</h4>
                               <p className="text-[11px] text-slate-400 mt-0.5 font-light leading-normal">{item.desc}</p>
                            </div>

                            {/* Native Toggle Switch Container Framework */}
                            <label className="relative inline-flex items-center cursor-pointer shrink-0">
                              <input type="checkbox" className="sr-only peer" defaultChecked={idx < 2} />
                              <div className="w-9 h-5 bg-slate-200 dark:bg-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-500"></div>
                            </label>
                         </div>
                       ))}
                    </div>
                 </section>
              </div>
            )}

            {/* 4. PRIVACY CONTROLS LAYER */}
            {activeSection === 'privacy' && (
              <div className="space-y-8 motion-safe:animate-in motion-safe:fade-in duration-300">
                 <section>
                    <h2 className="text-base font-black text-slate-900 dark:text-white mb-6">Privacy & Discovery Architecture</h2>
                    <div className="space-y-4">

                       <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800/60">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                             <div className="flex items-center gap-3">
                                <div className="p-2 bg-white dark:bg-slate-900 rounded-xl text-teal-500 border border-slate-100 dark:border-slate-800">
                                   <Eye size={16} />
                                </div>
                                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">Workspace Visibility Parameter</h4>
                             </div>

                             <select className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-[11px] font-bold text-slate-600 dark:text-slate-300 px-3 py-1.5 shadow-2xs outline-none focus:border-teal-500/40">
                                <option>Public (All Peers)</option>
                                <option>Verified Students Only</option>
                                <option>Strict Sandbox Private</option>
                             </select>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-relaxed font-light">Configure authorization matrix policies determining which visitor categories can audit your tracking files or upload sheets.</p>
                       </div>

                       <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800/60">
                          <div className="flex items-center justify-between gap-4 mb-3">
                             <div className="flex items-center gap-3">
                                <div className="p-2 bg-white dark:bg-slate-900 rounded-xl text-teal-500 border border-slate-100 dark:border-slate-800">
                                   <Globe size={16} />
                                </div>
                                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">Search Engine Index Pipeline</h4>
                             </div>

                             <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-9 h-5 bg-slate-200 dark:bg-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-500"></div>
                             </label>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-relaxed font-light">Allow external web engines like Google to index your catalogued public documents to promote remote provincial access pipelines.</p>
                       </div>

                    </div>
                 </section>
              </div>
            )}

          </div>
        </main>

      </div>
    </div>
  )
}
