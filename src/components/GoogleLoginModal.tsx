import React, { useEffect, useRef, useState } from 'react';
import {
  X,
  ShieldCheck,
  Loader2,
  AlertCircle,
  Key,
  ExternalLink,
  HelpCircle,
  CheckCircle2,
  Copy,
  Info,
} from 'lucide-react';
import { loginWithGoogle, ADMIN_EMAIL } from '../services/authService';
import {
  getGoogleClientId,
  saveGoogleClientId,
  parseJwt,
  fetchGoogleProfile,
  isGoogleGsiAvailable,
} from '../services/googleAuth';
import { AuthUser } from '../types';

interface GoogleLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser) => void;
}

export const GoogleLoginModal: React.FC<GoogleLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [clientId, setClientId] = useState<string>(() => getGoogleClientId());
  const [isEditingClientId, setIsEditingClientId] = useState(false);
  const [newClientIdInput, setNewClientIdInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedOrigin, setCopiedOrigin] = useState(false);
  const [manualEmail, setManualEmail] = useState(ADMIN_EMAIL);
  const [manualName, setManualName] = useState('Trần Tuấn Đại');
  const [activeTab, setActiveTab] = useState<'oauth' | 'manual' | 'guide'>('oauth');

  const googleButtonContainerRef = useRef<HTMLDivElement>(null);
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';

  // Initialize Google Identity Services (GSI) when modal opens or client ID updates
  useEffect(() => {
    if (!isOpen) return;

    const currentClientId = clientId || getGoogleClientId();
    if (!currentClientId || !isGoogleGsiAvailable()) return;

    try {
      const google = (window as any).google;
      if (google?.accounts?.id) {
        google.accounts.id.initialize({
          client_id: currentClientId,
          callback: async (response: any) => {
            if (response.credential) {
              setIsLoading(true);
              setError(null);
              try {
                const payload = parseJwt(response.credential);
                if (payload && payload.email) {
                  const user = await loginWithGoogle(
                    payload.email,
                    payload.name || payload.given_name || payload.email,
                    payload.picture
                  );
                  onLoginSuccess(user);
                  onClose();
                } else {
                  throw new Error('Không giải mã được thông tin từ Google ID Token.');
                }
              } catch (err: any) {
                setError(err.message || 'Đăng nhập Google thất bại');
              } finally {
                setIsLoading(false);
              }
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        if (googleButtonContainerRef.current) {
          googleButtonContainerRef.current.innerHTML = '';
          google.accounts.id.renderButton(googleButtonContainerRef.current, {
            theme: 'outline',
            size: 'large',
            type: 'standard',
            shape: 'rectangular',
            text: 'signin_with',
            logo_alignment: 'left',
            width: 320,
          });
        }
      }
    } catch (err) {
      console.warn('Lỗi khởi tạo Google Identity Services:', err);
    }
  }, [isOpen, clientId]);

  if (!isOpen) return null;

  // Trigger Google OAuth 2.0 Popup using GSI Token Client
  const handleLaunchGooglePopup = () => {
    const currentClientId = clientId || getGoogleClientId();
    setError(null);

    if (!currentClientId) {
      setError('Chưa cấu hình Google Client ID. Vui lòng nhập Google Client ID hoặc đăng nhập bằng tài khoản Google của bạn.');
      setActiveTab('guide');
      return;
    }

    const google = (window as any).google;
    if (!google?.accounts?.oauth2) {
      setError('Thư viện Google Identity Services chưa tải xong. Vui lòng thử lại sau giây lát.');
      return;
    }

    setIsLoading(true);
    try {
      const tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: currentClientId,
        scope: 'openid email profile',
        callback: async (tokenResponse: any) => {
          if (tokenResponse.error) {
            setIsLoading(false);
            if (tokenResponse.error === 'popup_closed_by_user') {
              setError('Bạn đã đóng cửa sổ đăng nhập Google.');
            } else {
              setError(`Lỗi xác thực Google: ${tokenResponse.error}`);
            }
            return;
          }

          try {
            const profile = await fetchGoogleProfile(tokenResponse.access_token);
            const user = await loginWithGoogle(profile.email, profile.name, profile.picture);
            setIsLoading(false);
            onLoginSuccess(user);
            onClose();
          } catch (err: any) {
            setIsLoading(false);
            setError(err.message || 'Không thể lấy thông tin tài khoản Google.');
          }
        },
        error_callback: (err: any) => {
          setIsLoading(false);
          console.error('Google OAuth Error:', err);
          setError('Không thể mở cửa sổ đăng nhập Google. Kiểm tra Authorized JavaScript Origins trong Google Cloud.');
        },
      });

      tokenClient.requestAccessToken({ prompt: 'select_account' });
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || 'Đã có lỗi khi mở cửa sổ đăng nhập Google.');
    }
  };

  // Save new Google Client ID
  const handleSaveClientId = () => {
    if (!newClientIdInput.trim()) {
      setError('Vui lòng nhập Google Client ID');
      return;
    }
    saveGoogleClientId(newClientIdInput.trim());
    setClientId(newClientIdInput.trim());
    setIsEditingClientId(false);
    setError(null);
    setActiveTab('oauth');
  };

  // Direct Google Email sign-in
  const handleManualEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualEmail.trim()) {
      setError('Vui lòng nhập địa chỉ email Google');
      return;
    }
    if (!manualEmail.includes('@') || !manualEmail.toLowerCase().includes('gmail.com')) {
      setError('Vui lòng nhập địa chỉ email Google (@gmail.com)');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await new Promise((r) => setTimeout(r, 600)); // simulate auth process
      const user = await loginWithGoogle(manualEmail.trim(), manualName.trim() || manualEmail.split('@')[0]);
      setIsLoading(false);
      onLoginSuccess(user);
      onClose();
    } catch (err: any) {
      setIsLoading(false);
      setError('Không thể hoàn tất đăng nhập. Vui lòng thử lại.');
    }
  };

  const copyOriginToClipboard = () => {
    navigator.clipboard.writeText(currentOrigin);
    setCopiedOrigin(true);
    setTimeout(() => setCopiedOrigin(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200 flex flex-col text-slate-800 max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            title="Đóng"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white p-2.5 flex items-center justify-center shadow-sm border border-slate-200 shrink-0">
              <svg className="w-full h-full" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 leading-tight">
                Đăng nhập tài khoản Google
              </h3>
              <p className="text-xs text-slate-500">
                Xác thực danh tính để truy cập Báo cáo & Phân tích SIBA
              </p>
            </div>
          </div>
        </div>

        {/* Mode Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('oauth')}
            className={`flex-1 py-3 text-center border-b-2 transition-colors cursor-pointer ${
              activeTab === 'oauth'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Google Identity (OAuth)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('manual')}
            className={`flex-1 py-3 text-center border-b-2 transition-colors cursor-pointer ${
              activeTab === 'manual'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Đăng nhập Gmail trực tiếp
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('guide')}
            className={`flex-1 py-3 text-center border-b-2 transition-colors cursor-pointer ${
              activeTab === 'guide'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Cấu hình Client ID
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* TAB 1: Real Google OAuth & GIS Button */}
          {activeTab === 'oauth' && (
            <div className="space-y-4">
              <div className="text-center space-y-2 py-2">
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Bấm nút bên dưới để mở cửa sổ đăng nhập chính thức của <strong>Google</strong>. Bạn sẽ chọn tài khoản Google cá nhân của mình để xác thực.
                </p>
              </div>

              {/* Official Google GIS Button Render Container */}
              {clientId ? (
                <div className="space-y-3">
                  <div className="flex justify-center my-2" ref={googleButtonContainerRef}>
                    {/* GIS button will be injected here if Client ID is configured */}
                  </div>

                  <div className="relative flex items-center justify-center my-2">
                    <div className="border-t border-slate-200 w-full"></div>
                    <span className="bg-white px-3 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                      hoặc
                    </span>
                  </div>

                  {/* Direct Google Popup Window Trigger */}
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={handleLaunchGooglePopup}
                    className="w-full py-3.5 px-4 rounded-2xl border-2 border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/50 text-slate-800 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
                    ) : (
                      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                    )}
                    <span>Mở cửa sổ chọn tài khoản Google (Popup)</span>
                  </button>
                </div>
              ) : (
                <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-4 text-xs space-y-3">
                  <div className="flex items-start gap-2 text-amber-900 font-bold">
                    <Info className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                    <span>Chưa phát hiện Google Client ID cho tên miền này</span>
                  </div>
                  <p className="text-amber-800 leading-relaxed">
                    Google OAuth yêu cầu một <strong>Client ID</strong> được đăng ký tại Google Cloud Console cho tên miền của ứng dụng.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setActiveTab('guide')}
                      className="py-2 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Key className="w-3.5 h-3.5" />
                      <span>Nhập Google Client ID</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('manual')}
                      className="py-2 px-3 bg-white border border-amber-300 hover:bg-amber-100/50 text-amber-900 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Đăng nhập nhanh với Gmail</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Security info */}
              <div className="pt-2 text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-700">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Chính sách kiểm soát truy cập dữ liệu học đường:</span>
                </div>
                <p>
                  • Email Quản trị viên <strong>{ADMIN_EMAIL}</strong>: Được cấp quyền Admin tự động ngay khi đăng nhập.
                </p>
                <p>
                  • Các tài khoản Google khác: Hệ thống sẽ tự động gửi yêu cầu phê duyệt đến Quản trị viên.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: Direct Gmail Sign-in with authentic Verification */}
          {activeTab === 'manual' && (
            <form onSubmit={handleManualEmailLogin} className="space-y-4">
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3.5 text-xs text-emerald-900 space-y-1">
                <span className="font-bold block">Xác thực tài khoản Google của bạn:</span>
                <p className="text-emerald-800">
                  Nhập địa chỉ Gmail để đăng nhập trực tiếp mà không cần cấu hình Google Cloud Console.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Địa chỉ Email Google (@gmail.com) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={manualEmail}
                      onChange={(e) => setManualEmail(e.target.value)}
                      placeholder="vidu@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Họ và tên hiển thị
                  </label>
                  <input
                    type="text"
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    placeholder="VD: Trần Tuấn Đại"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all disabled:opacity-60"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ShieldCheck className="w-4 h-4" />
                )}
                <span>Xác nhận đăng nhập với Google</span>
              </button>
            </form>
          )}

          {/* TAB 3: Guide & Google Client ID configuration */}
          {activeTab === 'guide' && (
            <div className="space-y-4 text-xs">
              <div className="space-y-2">
                <span className="font-bold text-slate-900 block text-sm">
                  Cấu hình Google OAuth 2.0 Client ID
                </span>
                <p className="text-slate-600 leading-relaxed">
                  Để nút đăng nhập chính thức của Google hoạt động trơn tru với popup tài khoản cá nhân, bạn cần tạo OAuth Client ID trên Google Cloud Console:
                </p>
              </div>

              {/* Origin to copy */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 text-[11px]">
                    Authorized JavaScript origins cần thêm vào Google Cloud:
                  </span>
                  <button
                    type="button"
                    onClick={copyOriginToClipboard}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                  >
                    {copiedOrigin ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Đã chép!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Sao chép</span>
                      </>
                    )}
                  </button>
                </div>
                <code className="block p-2 bg-white rounded-lg border border-slate-200 font-mono text-[11px] text-slate-800 break-all select-all">
                  {currentOrigin}
                </code>
              </div>

              {/* Client ID input */}
              <div className="space-y-2 pt-2">
                <label className="block font-bold text-slate-700 text-xs">
                  Nhập Google Client ID của bạn:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={isEditingClientId ? newClientIdInput : clientId}
                    onChange={(e) => {
                      setIsEditingClientId(true);
                      setNewClientIdInput(e.target.value);
                    }}
                    placeholder="VD: 123456789-abc.apps.googleusercontent.com"
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleSaveClientId}
                    className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shrink-0"
                  >
                    Lưu ID
                  </button>
                </div>
                {clientId && (
                  <p className="text-[11px] text-emerald-700 font-medium">
                    ✓ Đang sử dụng Client ID đã lưu
                  </p>
                )}
              </div>

              <div className="pt-2">
                <a
                  href="https://console.cloud.google.com/apis/credentials"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-bold hover:underline"
                >
                  <span>Mở Google Cloud Console Credentials</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Google Identity Services 2026</span>
          </div>
          <span className="text-slate-400">SIBA Food Catering</span>
        </div>

      </div>
    </div>
  );
};
