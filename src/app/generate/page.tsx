'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Asset {
  name: string;
  config?: {
    display_name?: string;
  };
}

interface GenerationConfig {
  character: string;
  clothing: string;
  product: string;
  environment: string;
  prompt: string;
  motionStyle: string;
  duration: string;
  cameraMotion: string;
}

const MOTION_STYLES = [
  { value: 'cinematic', label: 'Cinematic', desc: 'Dramatic, film-like movement' },
  { value: 'smooth', label: 'Smooth', desc: 'Gentle, flowing motion' },
  { value: 'dynamic', label: 'Dynamic', desc: 'Energetic, fast-paced' },
  { value: 'slowmo', label: 'Slow Motion', desc: 'Dramatic slow motion effect' },
  { value: 'static', label: 'Subtle/Static', desc: 'Minimal movement, atmospheric' },
];

const CAMERA_MOTIONS = [
  { value: 'orbit', label: 'Orbit', desc: 'Camera circles around subject' },
  { value: 'push', label: 'Push In', desc: 'Camera moves toward subject' },
  { value: 'pull', label: 'Pull Out', desc: 'Camera moves away from subject' },
  { value: 'follow', label: 'Follow', desc: 'Camera follows subject movement' },
  { value: 'pan', label: 'Pan', desc: 'Camera pans left/right' },
  { value: 'static', label: 'Static', desc: 'Camera stays still' },
];

const DURATIONS = [
  { value: '3', label: '3 seconds' },
  { value: '5', label: '5 seconds' },
  { value: '10', label: '10 seconds' },
];

export default function GeneratePage() {
  const [characters, setCharacters] = useState<Asset[]>([]);
  const [wardrobes, setWardrobes] = useState<Asset[]>([]);
  const [products, setProducts] = useState<Asset[]>([]);
  const [environments, setEnvironments] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<string[]>([]);

  const [config, setConfig] = useState<GenerationConfig>({
    character: '',
    clothing: '',
    product: '',
    environment: '',
    prompt: '',
    motionStyle: 'cinematic',
    duration: '5',
    cameraMotion: 'follow',
  });

  useEffect(() => {
    Promise.all([
      fetch('/api/assets?type=models').then(r => r.json()),
      fetch('/api/assets?type=wardrobes').then(r => r.json()),
      fetch('/api/assets?type=products').then(r => r.json()),
      fetch('/api/assets?type=environments').then(r => r.json()),
    ]).then(([chars, wards, prods, envs]) => {
      setCharacters(chars || []);
      setWardrobes(wards || []);
      setProducts(prods || []);
      setEnvironments(envs || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const validateStep = (stepNum: number): string[] => {
    const errs: string[] = [];
    
    if (stepNum >= 1) {
      if (!config.character && !config.product) {
        errs.push('Select a character OR a product to feature');
      }
    }
    
    if (stepNum >= 2) {
      if (!config.environment) {
        errs.push('Select an environment/background');
      }
    }
    
    if (stepNum >= 3) {
      if (!config.prompt || config.prompt.length < 10) {
        errs.push('Add a detailed prompt (at least 10 characters)');
      }
    }
    
    return errs;
  };

  const nextStep = () => {
    const errs = validateStep(step);
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }
    setErrors([]);
    setStep(step + 1);
  };

  const prevStep = () => {
    setErrors([]);
    setStep(step - 1);
  };

  const buildFullPrompt = () => {
    const parts: string[] = [];
    
    if (config.character) {
      parts.push(`${config.character}`);
      if (config.clothing) {
        parts.push(`wearing ${config.clothing}`);
      }
    }
    
    if (config.product) {
      parts.push(`featuring ${config.product} product`);
    }
    
    if (config.environment) {
      parts.push(`in ${config.environment}`);
    }
    
    if (config.prompt) {
      parts.push(config.prompt);
    }
    
    parts.push(`${config.cameraMotion} camera movement`);
    parts.push(`${config.motionStyle} style`);
    
    return parts.join(', ');
  };

  const handleGenerate = async () => {
    const errs = validateStep(3);
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }
    
    setGenerating(true);
    setErrors([]);
    
    // TODO: Call actual generation API
    // For now, simulate
    await new Promise(r => setTimeout(r, 2000));
    
    alert('Generation started! Check the Gallery for results.');
    setGenerating(false);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin text-2xl">⏳</div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#2a2a2a]">
        <div>
          <h1 className="text-lg font-semibold">Generate Video</h1>
          <p className="text-sm text-gray-500">Step {step} of 4</p>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map(s => (
            <div
              key={s}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                s === step
                  ? 'bg-green-600 text-white'
                  : s < step
                  ? 'bg-green-600/30 text-green-400'
                  : 'bg-[#2a2a2a] text-gray-500'
              }`}
            >
              {s < step ? '✓' : s}
            </div>
          ))}
        </div>
      </header>

      <div className="p-6 max-w-3xl mx-auto">
        {/* Errors */}
        {errors.length > 0 && (
          <div className="bg-red-600/20 border border-red-600/50 rounded-lg p-4 mb-6">
            <p className="text-red-400 font-medium mb-2">Please fix:</p>
            <ul className="text-sm text-red-300 list-disc list-inside">
              {errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Step 1: Select Subject */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-2">What's in the video?</h2>
            <p className="text-gray-400 mb-6">Select a character, product, or both</p>

            <div className="space-y-6">
              {/* Character Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Character</label>
                {characters.length === 0 ? (
                  <Link href="/characters" className="block bg-[#1a1a1a] border border-dashed border-[#333] rounded-lg p-4 text-center hover:border-[#555]">
                    <span className="text-2xl">👤</span>
                    <p className="text-sm text-gray-400 mt-2">No characters yet - Add one</p>
                  </Link>
                ) : (
                  <div className="grid grid-cols-4 gap-3">
                    <div
                      onClick={() => setConfig({...config, character: ''})}
                      className={`bg-[#1a1a1a] border rounded-lg p-3 text-center cursor-pointer ${
                        !config.character ? 'border-green-600' : 'border-[#333] hover:border-[#555]'
                      }`}
                    >
                      <span className="text-xl">✕</span>
                      <p className="text-xs text-gray-400 mt-1">None</p>
                    </div>
                    {characters.map(c => (
                      <div
                        key={c.name}
                        onClick={() => setConfig({...config, character: c.name})}
                        className={`bg-[#1a1a1a] border rounded-lg p-3 text-center cursor-pointer ${
                          config.character === c.name ? 'border-green-600' : 'border-[#333] hover:border-[#555]'
                        }`}
                      >
                        <span className="text-xl">👤</span>
                        <p className="text-xs text-gray-400 mt-1 capitalize">{c.config?.display_name || c.name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Clothing Selection (if character selected) */}
              {config.character && (
                <div>
                  <label className="block text-sm font-medium mb-2">Clothing (optional)</label>
                  <div className="grid grid-cols-4 gap-3">
                    <div
                      onClick={() => setConfig({...config, clothing: ''})}
                      className={`bg-[#1a1a1a] border rounded-lg p-3 text-center cursor-pointer ${
                        !config.clothing ? 'border-green-600' : 'border-[#333] hover:border-[#555]'
                      }`}
                    >
                      <span className="text-xl">✕</span>
                      <p className="text-xs text-gray-400 mt-1">Default</p>
                    </div>
                    {wardrobes.map(w => (
                      <div
                        key={w.name}
                        onClick={() => setConfig({...config, clothing: w.name})}
                        className={`bg-[#1a1a1a] border rounded-lg p-3 text-center cursor-pointer ${
                          config.clothing === w.name ? 'border-green-600' : 'border-[#333] hover:border-[#555]'
                        }`}
                      >
                        <span className="text-xl">👔</span>
                        <p className="text-xs text-gray-400 mt-1 capitalize">{w.config?.display_name || w.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Product Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Product (optional)</label>
                {products.length === 0 ? (
                  <Link href="/products" className="block bg-[#1a1a1a] border border-dashed border-[#333] rounded-lg p-4 text-center hover:border-[#555]">
                    <span className="text-2xl">📦</span>
                    <p className="text-sm text-gray-400 mt-2">No products yet - Add one</p>
                  </Link>
                ) : (
                  <div className="grid grid-cols-4 gap-3">
                    <div
                      onClick={() => setConfig({...config, product: ''})}
                      className={`bg-[#1a1a1a] border rounded-lg p-3 text-center cursor-pointer ${
                        !config.product ? 'border-green-600' : 'border-[#333] hover:border-[#555]'
                      }`}
                    >
                      <span className="text-xl">✕</span>
                      <p className="text-xs text-gray-400 mt-1">None</p>
                    </div>
                    {products.map(p => (
                      <div
                        key={p.name}
                        onClick={() => setConfig({...config, product: p.name})}
                        className={`bg-[#1a1a1a] border rounded-lg p-3 text-center cursor-pointer ${
                          config.product === p.name ? 'border-green-600' : 'border-[#333] hover:border-[#555]'
                        }`}
                      >
                        <span className="text-xl">📦</span>
                        <p className="text-xs text-gray-400 mt-1 capitalize">{p.config?.display_name || p.name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Environment */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Where is it?</h2>
            <p className="text-gray-400 mb-6">Select the background/environment</p>

            {environments.length === 0 ? (
              <Link href="/environments" className="block bg-[#1a1a1a] border border-dashed border-[#333] rounded-lg p-8 text-center hover:border-[#555]">
                <span className="text-4xl">🌍</span>
                <p className="text-gray-400 mt-4">No environments yet</p>
                <p className="text-sm text-gray-500">Add a mood/style reference to create one</p>
              </Link>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {environments.map(e => (
                  <div
                    key={e.name}
                    onClick={() => setConfig({...config, environment: e.name})}
                    className={`bg-[#1a1a1a] border rounded-xl p-4 cursor-pointer ${
                      config.environment === e.name ? 'border-green-600' : 'border-[#333] hover:border-[#555]'
                    }`}
                  >
                    <div className="aspect-video bg-[#0a0a0a] rounded-lg flex items-center justify-center mb-3">
                      <span className="text-3xl">🌍</span>
                    </div>
                    <p className="font-medium text-sm capitalize">{e.config?.display_name || e.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Prompt & Motion */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Describe the action</h2>
            <p className="text-gray-400 mb-6">What's happening in the video? Be detailed!</p>

            <div className="space-y-6">
              {/* Main Prompt */}
              <div>
                <label className="block text-sm font-medium mb-2">Action / Scene Description</label>
                <textarea
                  value={config.prompt}
                  onChange={(e) => setConfig({...config, prompt: e.target.value})}
                  placeholder="Example: walking confidently through neon-lit streets, rain falling softly, reflections on wet pavement, dramatic lighting, looking into camera with a subtle smile..."
                  className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 text-sm min-h-[120px] focus:border-green-600 focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Tip: Include action, mood, lighting, and any specific details you want
                </p>
              </div>

              {/* Motion Style */}
              <div>
                <label className="block text-sm font-medium mb-2">Motion Style</label>
                <div className="grid grid-cols-5 gap-2">
                  {MOTION_STYLES.map(style => (
                    <div
                      key={style.value}
                      onClick={() => setConfig({...config, motionStyle: style.value})}
                      className={`bg-[#1a1a1a] border rounded-lg p-3 cursor-pointer text-center ${
                        config.motionStyle === style.value ? 'border-green-600' : 'border-[#333] hover:border-[#555]'
                      }`}
                    >
                      <p className="text-sm font-medium">{style.label}</p>
                      <p className="text-xs text-gray-500 mt-1">{style.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Camera Motion */}
              <div>
                <label className="block text-sm font-medium mb-2">Camera Motion</label>
                <div className="grid grid-cols-6 gap-2">
                  {CAMERA_MOTIONS.map(cam => (
                    <div
                      key={cam.value}
                      onClick={() => setConfig({...config, cameraMotion: cam.value})}
                      className={`bg-[#1a1a1a] border rounded-lg p-3 cursor-pointer text-center ${
                        config.cameraMotion === cam.value ? 'border-green-600' : 'border-[#333] hover:border-[#555]'
                      }`}
                    >
                      <p className="text-sm font-medium">{cam.label}</p>
                      <p className="text-xs text-gray-500 mt-1">{cam.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium mb-2">Duration</label>
                <div className="flex gap-2">
                  {DURATIONS.map(dur => (
                    <button
                      key={dur.value}
                      onClick={() => setConfig({...config, duration: dur.value})}
                      className={`px-4 py-2 rounded-lg text-sm ${
                        config.duration === dur.value
                          ? 'bg-green-600 text-white'
                          : 'bg-[#1a1a1a] border border-[#333] hover:border-[#555]'
                      }`}
                    >
                      {dur.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Preview & Generate */}
        {step === 4 && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Review & Generate</h2>
            <p className="text-gray-400 mb-6">Confirm your settings</p>

            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 mb-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-xs text-gray-500">Character</p>
                  <p className="font-medium capitalize">{config.character || 'None'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Clothing</p>
                  <p className="font-medium capitalize">{config.clothing || 'Default'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Product</p>
                  <p className="font-medium capitalize">{config.product || 'None'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Environment</p>
                  <p className="font-medium capitalize">{config.environment || 'None'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Motion Style</p>
                  <p className="font-medium capitalize">{config.motionStyle}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Camera</p>
                  <p className="font-medium capitalize">{config.cameraMotion}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="font-medium">{config.duration} seconds</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-2">Full Prompt</p>
                <div className="bg-[#0a0a0a] rounded-lg p-4">
                  <p className="text-sm text-green-400">{buildFullPrompt()}</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating}
              className={`w-full py-4 rounded-xl text-lg font-semibold ${
                generating
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {generating ? '⏳ Generating...' : '🎬 Generate Video'}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              This will use: Midjourney → Magnific → Kling AI
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          {step > 1 ? (
            <button
              onClick={prevStep}
              className="px-6 py-2 bg-[#2a2a2a] rounded-lg hover:bg-[#3a3a3a]"
            >
              ← Back
            </button>
          ) : (
            <div />
          )}
          
          {step < 4 && (
            <button
              onClick={nextStep}
              className="px-6 py-2 bg-green-600 rounded-lg hover:bg-green-700"
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
