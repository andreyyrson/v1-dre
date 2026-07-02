import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2, Lock, Mail, Moon, Sun } from 'lucide-react';
import { login } from '../services/api';

export default function LoginPage({ onLogin }: { onLogin?: () => void }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  // Load dark mode preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dextro-login-dark');
    if (saved) setDarkMode(saved === 'true');
  }, []);

  // Save preference when toggled
  const toggleDarkMode = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    localStorage.setItem('dextro-login-dark', newValue.toString());
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErro('');
    try {
      const data = await login(email, senha);
      localStorage.setItem('token', data.access_token);
      onLogin?.();
      navigate('/dashboard');
    } catch (err: any) {
      setErro(err.response?.data?.detail || 'E-mail ou senha inválidos.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 font-sans transition-colors duration-300 ${darkMode ? 'bg-zinc-950' : 'bg-[#F6F6F6]'}`}>
      {/* Dark mode toggle */}
      <button
        onClick={toggleDarkMode}
        className={`fixed top-4 right-4 p-3 rounded-full transition-all duration-200 ${darkMode ? 'bg-zinc-800 text-yellow-400 hover:bg-zinc-700' : 'bg-white text-zinc-600 hover:bg-zinc-100'} shadow-lg`}
        title={darkMode ? 'Modo claro' : 'Modo escuro'}
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className={`w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 border relative overflow-hidden transition-colors duration-300 ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100'}`}>

        <div className="flex flex-col items-center mb-10 mt-4">
          <div className="w-40 h-40 relative mb-6">
            <img 
              src="/Logo.png" 
              alt="Dextro" 
              className={`w-full h-full object-contain transition-all duration-300 ${darkMode ? 'invert' : ''}`}
            />
          </div>
        </div>

        {erro && (
          <div className={`mb-6 p-4 border-l-4 text-[10px] font-black uppercase rounded-r-lg animate-in fade-in slide-in-from-top-1 ${darkMode ? 'bg-red-950 border-red-500 text-red-400' : 'bg-red-50 border-red-500 text-red-700'}`}>
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className={`text-[10px] font-black uppercase ml-1 ${darkMode ? 'text-zinc-500' : 'text-slate-400'}`}>E-mail</label>
            <div className="relative group">
              <Mail className={`absolute left-4 top-3.5 transition-colors ${darkMode ? 'text-zinc-600 group-focus-within:text-white' : 'text-slate-300 group-focus-within:text-black'}`} size={18} />
              <input
                type="email"
                required
                placeholder="seuemail@dominio.com"
                className={`w-full border rounded-2xl pl-12 pr-4 py-3.5 text-sm outline-none transition-all ${darkMode ? 'border-zinc-700 bg-zinc-800/50 text-white placeholder:text-zinc-600 focus:border-zinc-500 focus:ring-4 focus:ring-zinc-500/20' : 'border-slate-200 bg-slate-50/50 text-black placeholder:text-slate-400 focus:border-black focus:ring-4 focus:ring-black/5'}`}
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className={`text-[10px] font-black uppercase ml-1 ${darkMode ? 'text-zinc-500' : 'text-slate-400'}`}>Senha</label>
            <div className="relative group">
              <Lock className={`absolute left-4 top-3.5 transition-colors ${darkMode ? 'text-zinc-600 group-focus-within:text-white' : 'text-slate-300 group-focus-within:text-black'}`} size={18} />
              <input
                type="password"
                required
                placeholder="••••••••"
                className={`w-full border rounded-2xl pl-12 pr-4 py-3.5 text-sm outline-none transition-all ${darkMode ? 'border-zinc-700 bg-zinc-800/50 text-white placeholder:text-zinc-600 focus:border-zinc-500 focus:ring-4 focus:ring-zinc-500/20' : 'border-slate-200 bg-slate-50/50 text-black placeholder:text-slate-400 focus:border-black focus:ring-4 focus:ring-black/5'}`}
                value={senha}
                onChange={e => setSenha(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex justify-center items-center gap-3 transition-all active:scale-[0.98] disabled:opacity-70 mt-4 shadow-xl ${darkMode ? 'bg-white text-black hover:bg-zinc-200 shadow-white/10' : 'bg-black text-white hover:bg-zinc-800 shadow-black/10'}`}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>Entrar <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        <p className={`text-center text-[10px] mt-10 font-medium ${darkMode ? 'text-zinc-600' : 'text-slate-400'}`}>
          &copy; 2026 Dextro Technology. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
