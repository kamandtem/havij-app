import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Sparkles, Camera, Check, User, ArrowLeft } from 'lucide-react';

interface OnboardingViewProps {
  onCompleteOnboarding: (profile: UserProfile) => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({
  onCompleteOnboarding
}) => {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState<string>('🥕');
  const [challenges, setChallenges] = useState<string[]>(['تمرکز', 'مدیریت زمان']);

  const defaultAvatars = ['🥕', '🧠', '🌱', '🚀', '⭐', '⚡', '🦊', '🦉'];

  const availableChallenges = [
    'تمرکز',
    'مدیریت زمان',
    'اهمال کاری',
    'خواب و بیداری',
    'اضطراب و استرس',
    'مدیریت هیجان'
  ];

  const handleToggleChallenge = (c: string) => {
    if (challenges.includes(c)) {
      setChallenges(challenges.filter(item => item !== c));
    } else {
      setChallenges([...challenges, c]);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProfile: UserProfile = {
      name: name.trim(),
      age: '',
      avatar,
      onboarded: true,
      primaryChallenges: challenges,
      personalGoals: [],
      energyLevel: 'medium',
      focusLevel: 'medium',
      createdAt: new Date().toISOString()
    };

    onCompleteOnboarding(newProfile);
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 flex items-center justify-center p-4 font-sans text-right overflow-y-auto" dir="rtl">
      <div className="w-full max-w-lg bg-white rounded-[32px] p-6 sm:p-8 shadow-2xl border border-orange-100 my-auto animate-in fade-in zoom-in duration-300">
        
        {/* Header Branding */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-16 h-16 bg-orange-100 rounded-3xl mx-auto flex items-center justify-center text-3xl shadow-inner border border-orange-200">
            🥕
          </div>
          <h1 className="text-2xl font-black text-slate-800">
            به هویج خوش آمدید!
          </h1>
          <p className="text-xs font-semibold text-orange-600">
            برنامه‌ریز و دستیار تخصصی افزایش تمرکز و ارتقای ذهن ADHD
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Avatar Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 text-center">
              تصویر یا آیکون پروفایل خود را انتخاب کنید:
            </label>
            <div className="flex flex-col items-center gap-3">
              <div className="relative group">
                <div className="w-20 h-20 rounded-full bg-orange-50 border-4 border-orange-200 shadow-md flex items-center justify-center overflow-hidden text-4xl">
                  {avatar.startsWith('data:') ? (
                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span>{avatar}</span>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 p-2 bg-orange-500 text-white rounded-full shadow-md cursor-pointer hover:bg-orange-600 transition-colors">
                  <Camera className="w-4 h-4" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>

              {/* Emoji Quick Picker */}
              <div className="flex flex-wrap justify-center gap-2">
                {defaultAvatars.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setAvatar(e)}
                    className={`w-9 h-9 rounded-xl border text-lg flex items-center justify-center transition-all ${
                      avatar === e
                        ? 'bg-orange-500 text-white border-orange-600 scale-110 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Name Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              نام یا نام مستعار شما <span className="text-orange-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثلاً: علی"
              required
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            />
          </div>

          {/* Challenges */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              چالش‌های اصلی که می‌خواهید روی آن‌ها کار کنید:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {availableChallenges.map((ch) => {
                const isSelected = challenges.includes(ch);
                return (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => handleToggleChallenge(ch)}
                    className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-right flex items-center justify-between ${
                      isSelected
                        ? 'bg-orange-50 border-orange-300 text-orange-700 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>{ch}</span>
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                      isSelected ? 'bg-orange-500 text-white' : 'border border-slate-300'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-2xl font-black text-sm shadow-lg shadow-orange-500/30 transition-all flex items-center justify-center gap-2"
          >
            <span>ورود به برنامه‌ریز هویج</span>
            <Sparkles className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
