import React, { useState } from 'react';
import { 
  STREAMLIT_APP_CODE, 
  COLAB_NOTEBOOK_JSON 
} from '../utils/colabCodeGenerator';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  Terminal, 
  Cloud, 
  FileCode, 
  BookOpen, 
  ShieldCheck, 
  Zap,
  CheckCircle2,
  Layers,
  Atom,
  Cpu,
  FlaskConical,
  GitCompare,
  Activity,
  Dna,
  Sparkles
} from 'lucide-react';

interface ColabExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ColabExportModal: React.FC<ColabExportModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'notebook' | 'onecell' | 'modules' | 'streamlit'>('notebook');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleDownloadNotebook = () => {
    const jsonStr = JSON.stringify(COLAB_NOTEBOOK_JSON, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/x-ipynb+json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'QuantumMol_AI_Colab_Cloudflare.ipynb';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadAppPy = () => {
    const blob = new Blob([STREAMLIT_APP_CODE], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'app.py';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const oneCellCode = `# 1. 필수 라이브러리 및 Cloudflare Tunnel 클라이언트 설치
!pip install -q streamlit py3Dmol stmol rdkit-pypi qiskit pennylane google-genai
!wget -q -nc https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
!dpkg -i cloudflared-linux-amd64.deb > /dev/null 2>&1

# 2. app.py 파일 생성 (QuantumMol AI 10대 핵심 기능 전부 포함)
with open('app.py', 'w', encoding='utf-8') as f:
    f.write('''${STREAMLIT_APP_CODE.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}''')

# 3. Streamlit 백그라운드 구동 & Cloudflare Tunnel 공개 URL 연결
import subprocess, time
subprocess.Popen(['streamlit', 'run', 'app.py', '--server.port', '8501', '--server.headless', 'true'])
time.sleep(3)
print("🚀 아래 출력되는 https://*.trycloudflare.com 링크를 클릭하여 웹 앱에 접속하세요!")
!cloudflared tunnel --url http://localhost:8501`;

  const handleCopyCode = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const MODULES_LIST = [
    { title: "1. 3D 양자 분자 뷰어 & 전자 구조", desc: "py3Dmol 볼-앤-스틱, 공간채움, 전자구름 VDW 서피스 실시간 3D 렌더링", icon: FlaskConical },
    { title: "2. 우주 신물질 양자 딥러닝 분자 생성기", desc: "주기율표 118종 전원소를 구성원자로 지정하여 우주 극한 신물질 양자 역설계", icon: Zap },
    { title: "3. VQE 에너지 최적화 시뮬레이터", desc: "COBYLA/SPSA/Adam/SLSQP 수렴 곡선 및 1.6 mHa 화학적 정확도 판정", icon: Activity },
    { title: "4. 매개변수화 양자 회로 (PQC) & Bloch 구", desc: "큐비트 레지스터, 회로 깊이, CNOT 얽힘, 상태벡터 [X, Y, Z] 구 투영", icon: Cpu },
    { title: "5. 정밀 물성 리포트 & 3단계 화학 합성 프로토콜", desc: "HOMO-LUMO, 쌍극자 모멘트 및 온도/압력/시약/안전 3단계 합성 레시피", icon: Layers },
    { title: "6. 핵에너지 대체 양자물질 랩 (무중성자 청정 에너지)", desc: "격자 가둠 쿨롱 차폐 증폭 Ue 계산 및 과열 시 자발적 Fail-Safe 보호", icon: ShieldCheck },
    { title: "7. 차세대 반도체 양자 랩 (Sub-1nm 2D & Ga2O3)", desc: "MoS2, WSe2, β-Ga2O3 파워반도체, SS < 60 초저전력 및 고이동도 시뮬레이션", icon: Cpu },
    { title: "8. 주기율표 118개 원소 3D 결정구조 & 신물질 합성 엔진", desc: "원소별 전자배치/격자 확인 및 원소 합성 도가니(Crucible) 조성비 결합 예측", icon: Atom },
    { title: "9. 동위원소 양자비교 (Li·LiD / H₂·D₂·T₂)", desc: "ZPE(영점 진동 에너지), 환산질량(μ), 광학 포논, 우벨로데 격자 수축 및 KIE 비교", icon: GitCompare },
    { title: "10. 극한 환경 스트레스 테스트 & 양자 검증 스위트", desc: "4K~1200K 온도 스윕, 50kV/cm 전계 인가 시 위상 온전성 및 자발적 셧다운 판정", icon: CheckCircle2 },
    { title: "11. DeepMind AlphaFold 3D 단백질 접힘 랩", desc: "Evoformer pLDDT 신뢰도 점수, PAE 오차 행렬 및 양자 약물 포켓 도킹 친화도 예측", icon: Dna },
    { title: "12. 신물질 반응 역학 실험실 (Reaction Kinetics Lab)", desc: "100K~2500K 고온·고압 환경 반응성, 전이상태 3D 관찰 및 최적 공정온도 도출", icon: Activity },
    { title: "13. 주기율표 118종 전원소 3D 분자 라이브러리 & 갤러리", desc: "수소(1번)부터 오가네손(118번)까지 118개 모든 원소의 3D 결정 격자 100% 탑재 및 순환 갤러리", icon: Layers },
    { title: "14. QuantumMol AI 정밀 사용설명서 & 종합 매뉴얼", desc: "모든 메뉴의 상세 사용법, 컨트롤 조작키, 물리화학 파라미터 공식 및 Colab 배포 안내", icon: BookOpen },
    { title: "15. crazy ai & robotics Graphene (그래핀 유사 물질 AI 스크리닝)", desc: "Materials Project 32,534개 결정체 기반 CrystalNN 기하학적 편향 Transformer, 50종 랭킹 및 7단계 DFT 검증", icon: Sparkles }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900/80 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-cyan-500 p-0.5 flex items-center justify-center shadow-lg">
              <Cloud className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Google Colab + Cloudflare Tunnel 전체 기능 웹 배포
                <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded">
                  15대 핵심 모듈 &amp; CRAZY Graphene 100% 통합
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                주기율표 신물질 합성, 리튬/수소 동위원소 양자역학, 반도체 및 VQE까지 앱의 모든 기능을 Google Colab에서 무료로 실행합니다.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-slate-950">
          <button
            onClick={() => setActiveTab('notebook')}
            className={`pb-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-colors ${activeTab === 'notebook' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            <BookOpen className="w-4 h-4" />
            Colab 주피터 노트북 (.ipynb)
          </button>
          <button
            onClick={() => setActiveTab('onecell')}
            className={`pb-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-colors ${activeTab === 'onecell' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            <Terminal className="w-4 h-4" />
            Colab 단일 셀 원클릭 스크립트
          </button>
          <button
            onClick={() => setActiveTab('modules')}
            className={`pb-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-colors ${activeTab === 'modules' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            <Layers className="w-4 h-4" />
            포함된 10대 기능 목록 ({MODULES_LIST.length})
          </button>
          <button
            onClick={() => setActiveTab('streamlit')}
            className={`pb-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-colors ${activeTab === 'streamlit' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            <FileCode className="w-4 h-4" />
            Streamlit 소스코드 (app.py)
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {activeTab === 'notebook' && (
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400" />
                      QuantumMol_AI_Colab_Cloudflare.ipynb
                    </h3>
                    <p className="text-xs text-slate-400">
                      원클릭으로 모든 패키지 설치부터 10개 연구 모듈 구동, Cloudflare Tunnel 보안 링크까지 자동 배포되는 완성형 주피터 노트북입니다.
                    </p>
                  </div>
                  <button
                    onClick={handleDownloadNotebook}
                    className="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-cyan-950 flex items-center gap-2 transition-all shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    노트북 (.ipynb) 다운로드
                  </button>
                </div>
              </div>

              {/* Step-by-Step Guide */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-300">구글 코랩에서 1분 만에 웹 시현하는 방법</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-cyan-300">
                      <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-[11px]">1</span>
                      노트북 업로드
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      상단의 버튼으로 <strong className="text-slate-300">.ipynb</strong> 파일을 내려받은 후, <a href="https://colab.research.google.com" target="_blank" rel="noreferrer" className="text-cyan-400 underline inline-flex items-center gap-0.5">Google Colab <ExternalLink className="w-2.5 h-2.5" /></a>에서 '업로드' 탭으로 열어줍니다.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-cyan-300">
                      <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-[11px]">2</span>
                      런타임 모두 실행
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      Colab 상단 메뉴에서 <strong className="text-slate-300">런타임 → 모두 실행</strong> (<kbd className="bg-slate-800 px-1 py-0.5 rounded text-[10px]">Ctrl + F9</kbd>)을 클릭하여 셀을 차례대로 자동 구동합니다.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                      <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-[11px]">3</span>
                      공용 웹 링크 접속
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      마지막 셀 실행 로그에 나타나는 <strong className="text-emerald-300">https://*.trycloudflare.com</strong> 링크를 클릭하면 브라우저에서 분자 시뮬레이터 앱이 바로 열립니다!
                    </p>
                  </div>
                </div>
              </div>

              {/* Cloudflare Tunnel Advantages */}
              <div className="p-3 bg-slate-900/40 rounded-lg border border-slate-800/80 text-xs text-slate-400 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Cloudflare Tunnel의 장점 (ngrok 불필요)</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  회원가입이나 인증 토큰(Authtoken) 발급 없이 
                  <code className="text-cyan-300 font-mono">cloudflared tunnel --url http://localhost:8501</code> 명령 하나로
                  무제한 대역폭의 공식 HTTPS 공용 주소가 즉시 생성됩니다.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'onecell' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  구글 Colab의 빈 셀에 아래 코드를 붙여넣고 <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px] text-slate-200">Shift + Enter</kbd>를 누르면 10개 모듈이 즉시 가동됩니다.
                </p>
                <button
                  onClick={() => handleCopyCode(oneCellCode)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? '복사 완료!' : '전체 코드 복사'}
                </button>
              </div>

              <div className="relative rounded-xl border border-slate-800 bg-slate-900/90 p-4 font-mono text-xs text-cyan-200 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap">{oneCellCode}</pre>
              </div>
            </div>
          )}

          {activeTab === 'modules' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h4 className="text-xs font-bold text-slate-200">
                  Colab 다운로드 패키지에 포함된 10대 핵심 연구 모듈
                </h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  100% Full Features Included
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {MODULES_LIST.map((mod, idx) => {
                  const Icon = mod.icon;
                  return (
                    <div key={idx} className="p-3 bg-slate-900/70 rounded-xl border border-slate-800 flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-indigo-950/80 border border-indigo-500/40 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-4 h-4 text-cyan-300" />
                      </div>
                      <div className="space-y-0.5">
                        <h5 className="text-xs font-bold text-slate-200">{mod.title}</h5>
                        <p className="text-[11px] text-slate-400 leading-snug">{mod.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'streamlit' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-200">전체 10개 모듈 통합 app.py 소스코드</h4>
                  <p className="text-[11px] text-slate-400">
                    로컬 PC나 서버에서도 <code className="text-cyan-300">streamlit run app.py</code>로 즉시 단독 구동 가능합니다.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyCode(STREAMLIT_APP_CODE)}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    코드 복사
                  </button>
                  <button
                    onClick={handleDownloadAppPy}
                    className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-xs font-medium text-white flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    app.py 다운로드
                  </button>
                </div>
              </div>

              <div className="relative rounded-xl border border-slate-800 bg-slate-900/90 p-4 font-mono text-xs text-slate-300 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap">{STREAMLIT_APP_CODE}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-900/80 border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Cloud className="w-4 h-4 text-cyan-400" />
            <span>Google Colab + Cloudflare Tunnel + Streamlit Web Architecture</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadNotebook}
              className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors shadow-md shadow-cyan-950"
            >
              <Download className="w-3.5 h-3.5" />
              Colab 노트북 (.ipynb) 다운로드
            </button>
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
            >
              닫기
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
