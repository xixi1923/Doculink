import { useState, useRef, useEffect } from 'react'
import {
  CreditCard, Upload, CheckCircle2, ShieldCheck,
  AlertCircle, ChevronRight, Loader2, Info, ArrowLeft,
  Calendar, Check, Zap, Star, Clock
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import api from '@/api'

const PLANS = [
    {
        id: 'monthly',
        name: 'Standard Monthly',
        price: 9.99,
        duration: '30 Days',
        features: ['Premium Book Access', 'PDF Downloads', 'No Ads'],
        color: 'teal'
    },
    {
        id: 'yearly',
        name: 'Elite Academic',
        price: 89.99,
        duration: '365 Days',
        features: ['All Premium Access', 'Priority Support', 'Early Access', 'Save 25%'],
        color: 'amber'
    }
]

export default function SubscriptionVerify() {
  const [selectedPlan, setSelectedPlan] = useState(PLANS[0])
  const [step, setStep] = useState(1)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<any>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/subscription/status').then(res => {
      setStatus(res.data)
      if (res.data?.latest_request?.status === 'pending') {
        setStep(3)
      }
    })
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) {
      setFile(f)
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result as string)
      reader.readAsDataURL(f)
    }
  }

  const handleSubmit = async () => {
    if (!file) return
    setLoading(true)

    const formData = new FormData()
    formData.append('plan_type', selectedPlan.id)
    formData.append('amount', selectedPlan.price.toString())
    formData.append('screenshot', file)

    try {
      await api.post('/subscribe', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setStep(3)
    } catch (err) {
      console.error(err)
      alert('Upload failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (status?.is_premium) {
      return (
        <div className="min-h-screen bg-white pt-32 pb-20 flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-8 animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-teal-500 rounded-[2.5rem] flex items-center justify-center text-white mx-auto shadow-2xl shadow-teal-500/20">
                    <ShieldCheck size={48} />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Active Premium Status</h1>
                    <p className="text-slate-500 mt-4 font-medium leading-relaxed">
                        Your account is currently upgraded to the Elite Tier. You have full access to all resources until
                        <span className="text-teal-600 block mt-1 font-bold">{new Date(status.premium_until).toLocaleDateString()}</span>
                    </p>
                </div>
                <Link to="/books" className="inline-flex items-center gap-2 bg-slate-900 text-white px-10 py-5 rounded-[2rem] text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">
                    Go to Library <ChevronRight size={18} />
                </Link>
            </div>
        </div>
      )
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-32">
      <div className="bg-slate-900 pt-32 pb-40 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] -mr-48 -mt-48"></div>
        <div className="container mx-auto px-4 text-center">
            <Link to="/books" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest mb-10">
                <ArrowLeft size={16} /> Library Matrix
            </Link>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Upgrade your <span className="text-teal-400">Educational</span> Node.</h1>
            <p className="text-slate-400 text-sm md:text-base mt-6 max-w-xl mx-auto leading-relaxed">
                Unlock unrestricted access to the complete digital archive and premium academic downloads.
            </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-24">
        <div className="max-w-4xl mx-auto">
            {/* Step Progress */}
            <div className="flex justify-center mb-12">
                <div className="flex items-center gap-3 bg-white p-2 rounded-full shadow-lg border border-slate-200">
                    {[1, 2, 3].map(s => (
                        <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                            step === s ? 'bg-teal-500 text-slate-950 scale-110 shadow-lg' :
                            step > s ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-50 text-slate-300'
                        }`}>
                            {step > s ? <Check size={18} /> : s}
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 p-8 md:p-16 overflow-hidden relative">

                {/* STEP 1: Select Plan */}
                {step === 1 && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-500">
                        {status?.latest_request?.status === 'rejected' && (
                            <div className="p-6 bg-rose-50 border border-rose-100 rounded-[2rem] flex items-start gap-4 text-rose-600">
                                <AlertCircle className="shrink-0 mt-0.5" size={24} />
                                <div>
                                    <p className="text-sm font-black uppercase tracking-tight">Payment Audit Rejected</p>
                                    <p className="text-xs font-medium opacity-80 mt-1 leading-relaxed">
                                        Your previous submission was not approved by the auditor. Please ensure you submit a valid, clear screenshot of the transaction.
                                    </p>
                                    {status.latest_request.admin_note && (
                                        <div className="mt-3 p-3 bg-white/50 rounded-xl border border-rose-200">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-rose-400 mb-1">Auditor Note:</p>
                                            <p className="text-xs italic font-bold">"{status.latest_request.admin_note}"</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        <div className="text-center">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Choose your Protocol</h2>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Select a membership duration</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {PLANS.map(plan => (
                                <div
                                    key={plan.id}
                                    onClick={() => setSelectedPlan(plan)}
                                    className={`p-8 rounded-[2.5rem] border-2 transition-all cursor-pointer relative group ${
                                        selectedPlan.id === plan.id ? 'border-teal-500 bg-teal-50/20' : 'border-slate-100 bg-slate-50/50 hover:border-slate-200'
                                    }`}
                                >
                                    {plan.id === 'yearly' && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-amber-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg">
                                            Best Value Node
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between mb-8">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                                            plan.id === 'yearly' ? 'bg-amber-100 text-amber-600' : 'bg-teal-100 text-teal-600'
                                        }`}>
                                            {plan.id === 'yearly' ? <Star size={24} /> : <Zap size={24} />}
                                        </div>
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                            selectedPlan.id === plan.id ? 'border-teal-500 bg-teal-500' : 'border-slate-300'
                                        }`}>
                                            {selectedPlan.id === plan.id && <Check size={14} className="text-white" />}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900">{plan.name}</h3>
                                    <p className="text-3xl font-black text-slate-900 mt-2">${plan.price} <span className="text-xs text-slate-400 font-bold uppercase">/ {plan.duration}</span></p>

                                    <div className="mt-8 space-y-3">
                                        {plan.features.map(f => (
                                            <div key={f} className="flex items-center gap-3 text-xs font-semibold text-slate-600">
                                                <CheckCircle2 size={14} className="text-teal-500" /> {f}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setStep(2)}
                            className="w-full py-6 rounded-3xl bg-slate-900 text-white font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all shadow-xl shadow-slate-950/10 flex items-center justify-center gap-3"
                        >
                            Confirm Plan & Continue <ChevronRight size={18} />
                        </button>
                    </div>
                )}

                {/* STEP 2: KHQR Payment */}
                {step === 2 && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-500">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setStep(1)} className="p-3 rounded-2xl bg-slate-100 text-slate-500 hover:text-slate-900 transition-all">
                                <ArrowLeft size={18} />
                            </button>
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">KHQR Remittance</h2>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Scan to pay ${selectedPlan.price} USD</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-12 items-center">
                            <div className="space-y-8">
                                <div className="p-6 rounded-3xl bg-teal-50 border border-teal-100 flex gap-4">
                                    <Info className="text-teal-600 shrink-0" size={20} />
                                    <p className="text-[11px] font-bold text-teal-800 leading-relaxed uppercase tracking-wider">
                                        Scan the KHQR code using any Mobile Banking App. After payment is successful,
                                        take a screenshot and upload it below for verification.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Upload Payment Screenshot</p>
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className={`aspect-video rounded-[2.5rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative group ${
                                            preview ? 'border-teal-500 bg-teal-50/20' : 'border-slate-200 bg-slate-50 hover:border-teal-500 hover:bg-teal-50/50'
                                        }`}
                                    >
                                        {preview ? (
                                            <>
                                                <img src={preview} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Upload size={32} className="text-white" />
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-center">
                                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-teal-500 mx-auto shadow-lg mb-4">
                                                    <Upload size={28} />
                                                </div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Screenshot</p>
                                            </div>
                                        )}
                                        <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-center space-y-6">
                                <div className="p-3 bg-white border-2 border-slate-100 rounded-[2rem] shadow-2xl shadow-slate-200/50 overflow-hidden">
                                    {/* Generated Fake KHQR for PA BORASY */}
                                    <div className="w-60 aspect-[3/4] bg-slate-50 rounded-[1.5rem] flex items-center justify-center overflow-hidden border border-slate-50">
                                        <img
                                            src="https://api.qrserver.com/v1/create-qr-code/?size=300x400&data=KHQR_DOCULINK_VERIFY"
                                            className="w-full h-full p-8 object-contain opacity-80"
                                            alt="Generated KHQR"
                                        />
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Acleda Bank Terminal</p>
                                    <p className="font-black text-slate-900 mt-1">DocuLink</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                disabled={!file || loading}
                                onClick={handleSubmit}
                                className="w-full py-6 rounded-3xl bg-teal-500 text-slate-950 font-black uppercase tracking-widest text-xs hover:bg-teal-400 transition-all shadow-xl shadow-teal-500/20 flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                                Submit Remittance for Audit
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 3: Success Pending */}
                {step === 3 && (
                    <div className="text-center space-y-10 animate-in zoom-in duration-500">
                        <div className="w-24 h-24 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center text-white mx-auto shadow-2xl shadow-emerald-500/20">
                            <Clock size={48} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Audit in Progress.</h2>
                            <p className="text-slate-500 mt-6 font-medium leading-relaxed max-w-md mx-auto">
                                Your payment screenshot has been submitted to the administrative ledger.
                                Our auditors will verify the transaction within <span className="text-slate-900 font-bold">1-12 hours</span>.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/books" className="px-10 py-5 bg-slate-900 text-white rounded-[2rem] text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">
                                Browse Free Archive
                            </Link>
                            <button onClick={() => navigate('/profile')} className="px-10 py-5 bg-slate-100 text-slate-600 rounded-[2rem] text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
                                View Request Status
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
                <div className="flex gap-4 p-6">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-teal-600 shadow-sm shrink-0 border border-slate-200">
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 uppercase text-[10px] tracking-widest">Secure Audit</h4>
                        <p className="text-xs text-slate-500 mt-1 font-medium">Verified by DocuLink financial security protocol.</p>
                    </div>
                </div>
                <div className="flex gap-4 p-6">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-teal-600 shadow-sm shrink-0 border border-slate-200">
                        <CreditCard size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 uppercase text-[10px] tracking-widest">Instant Activation</h4>
                        <p className="text-xs text-slate-500 mt-1 font-medium">Account upgraded immediately after audit approval.</p>
                    </div>
                </div>
                <div className="flex gap-4 p-6">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-teal-600 shadow-sm shrink-0 border border-slate-200">
                        <Info size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 uppercase text-[10px] tracking-widest">No Bank API</h4>
                        <p className="text-xs text-slate-500 mt-1 font-medium">Manual screenshot verification for privacy & safety.</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}
