'use client';

import { useState } from 'react';
import type { ContraceptionType } from '../lib/fertilityData';

type FormData = {
  age: number;
  hasPeriods: boolean;
  cycleLength: number;
  periodStart: string;
  periodEnd: string;
  isCurrentlyMenstruating: boolean;
  sexDate: string;
  timeOfDay: string;
  contraception: boolean;
  contraceptionType?: ContraceptionType;
  withdrawal?: boolean;
  urination?: boolean;
  finishInside: boolean;
  fertilityMeds: boolean;
  previousPregnancies: number;
  fertilityIssues: boolean;
  medications: string[];
};

type Result = {
  percentage: number;
  riskLevel: string;
  explanation: string;
};

const inputClasses = `
  w-full px-4 sm:px-6 py-3 sm:py-4 
  text-lg sm:text-xl font-semibold text-pink-600 
  bg-white/40 
  border-none
  rounded-xl
  shadow-inner
  placeholder:text-pink-300/60
  focus:outline-none focus:ring-2 focus:ring-pink-100
  transition-all duration-200
  backdrop-blur-sm
  appearance-none
`;

const dateInputClasses = `
  ${inputClasses}
  pr-12
  min-h-[52px]
  placeholder:text-pink-300/60
`;

const labelClasses = `
  block mb-8
  text-2xl font-bold
  bg-gradient-to-r from-pink-600 to-purple-600 
  bg-clip-text text-transparent 
  [&>*]:mt-6
`;

const buttonClasses = `
  w-full bg-gradient-to-r from-pink-500 to-purple-500 
  hover:from-pink-600 hover:to-purple-600 
  text-white px-4 sm:px-6 py-3 sm:py-4 
  rounded-xl text-lg sm:text-xl font-medium 
  transition duration-300 shadow-lg hover:shadow-xl
`;

const backButtonClasses = `
  w-full mt-2 bg-transparent border-2 border-pink-400 
  text-pink-600 hover:bg-pink-50 
  px-4 sm:px-6 py-3 sm:py-4 
  rounded-xl text-lg sm:text-xl font-medium 
  transition duration-300
`;

const LoadingBar = () => (
  <div className="fixed top-0 left-0 w-full h-1 bg-pink-100">
    <div className="h-full bg-gradient-to-r from-pink-500 to-purple-500 animate-loading-bar"></div>
  </div>
);

const ProgressIndicator = ({ currentStep }: { currentStep: number }) => {
  const totalSteps = 10;
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="mb-20">
      {/* Progress Bar */}
      <div className="relative h-2 bg-pink-100 rounded-full overflow-hidden">
        <div 
          className="absolute h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Step Indicators */}
      <div className="relative mt-4">
        <div className="absolute top-0 left-0 right-0 flex justify-between">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div 
              key={index}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs
                       transition-all duration-300 transform
                       ${index + 1 <= currentStep 
                         ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white scale-100' 
                         : 'bg-pink-100 text-pink-400 scale-90'}`}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const DateInput = ({ value, onChange, className }: { 
  value: string, 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  className?: string 
}) => (
  <div className="relative">
    <input
      type="date"
      className={className}
      value={value}
      onChange={onChange}
      placeholder="Select date..."
    />
    <svg 
      className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-pink-400 pointer-events-none" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
      />
    </svg>
  </div>
);

export default function PregnancyCalculator() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    age: 0,
    hasPeriods: true,
    cycleLength: 28,
    periodStart: '',
    periodEnd: '',
    isCurrentlyMenstruating: false,
    sexDate: '',
    timeOfDay: '',
    contraception: false,
    finishInside: false,
    fertilityMeds: false,
    previousPregnancies: 0,
    fertilityIssues: false,
    medications: [],
  });
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const text = await response.text();
      let data;
      
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        throw new Error(`Server response: ${text}`);
      }

      if (!response.ok) {
        throw new Error(data.details || 'Failed to calculate probability');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to calculate probability. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderQuestion = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-8 pt-8">
            <label className={labelClasses}>
              What is your age?
              <input
                type="number"
                id="age"
                value={formData.age || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  age: parseInt(e.target.value) || 0
                }))}
                className={inputClasses}
                placeholder="Type your age..."
                min="0"
                max="100"
                style={{
                  WebkitAppearance: 'none',
                  MozAppearance: 'textfield'
                }}
              />
            </label>
            <div className="pt-4">
              <button
                onClick={() => {
                  if (formData.age < 18) {
                    alert("You must be 18 or older to use this calculator.");
                    return;
                  }
                  setStep(2);
                }}
                className={buttonClasses}
              >
                Next
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <label className={labelClasses}>
              Do you get periods?
              <select
                className={inputClasses}
                value={formData.hasPeriods?.toString() || 'true'}
                onChange={(e) => {
                  const hasPeriods = e.target.value === 'true';
                  setFormData({ 
                    ...formData, 
                    hasPeriods,
                    periodStart: hasPeriods ? formData.periodStart : '',
                    periodEnd: hasPeriods ? formData.periodEnd : '',
                    isCurrentlyMenstruating: hasPeriods ? formData.isCurrentlyMenstruating : false
                  });
                }}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </label>
            
            {formData.hasPeriods && (
              <>
                <label className={labelClasses}>
                  When did your last period start?
                  <DateInput
                    value={formData.periodStart}
                    onChange={(e) => setFormData({ ...formData, periodStart: e.target.value })}
                    className={dateInputClasses}
                  />
                </label>
                <label className={labelClasses}>
                  Are you currently on your period?
                  <select
                    className={inputClasses}
                    value={formData.isCurrentlyMenstruating.toString()}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      isCurrentlyMenstruating: e.target.value === 'true',
                      periodEnd: e.target.value === 'true' ? '' : formData.periodEnd
                    })}
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </label>
                {!formData.isCurrentlyMenstruating && (
                  <label className={labelClasses}>
                    When did your last period end?
                    <DateInput
                      value={formData.periodEnd}
                      onChange={(e) => setFormData({ ...formData, periodEnd: e.target.value })}
                      className={dateInputClasses}
                    />
                  </label>
                )}
              </>
            )}
            <div className="flex flex-col gap-2">
              <button onClick={() => setStep(3)} className={buttonClasses}>
                Next
              </button>
              <button onClick={() => setStep(1)} className={backButtonClasses}>
                Back
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <label className={labelClasses}>
              When did intercourse occur?
              <DateInput
                value={formData.sexDate}
                onChange={(e) => setFormData({ ...formData, sexDate: e.target.value })}
                className={dateInputClasses}
              />
            </label>
            <div className="flex flex-col gap-2">
              <button onClick={() => setStep(4)} className={buttonClasses}>
                Next
              </button>
              <button onClick={() => setStep(2)} className={backButtonClasses}>
                Back
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <label className={labelClasses}>
              What time of day did intercourse occur?
              <select
                className={inputClasses}
                value={formData.timeOfDay}
                onChange={(e) => setFormData({ ...formData, timeOfDay: e.target.value })}
              >
                <option value="">Select time...</option>
                <option value="morning">Morning (6 AM - 12 PM)</option>
                <option value="afternoon">Afternoon (12 PM - 6 PM)</option>
                <option value="evening">Evening (6 PM - 12 AM)</option>
                <option value="night">Night (12 AM - 6 AM)</option>
              </select>
            </label>
            <div className="flex flex-col gap-2">
              <button onClick={() => setStep(5)} className={buttonClasses}>
                Next
              </button>
              <button onClick={() => setStep(3)} className={backButtonClasses}>
                Back
              </button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <label className={labelClasses}>
              Did you use contraception?
              <select
                className={inputClasses}
                value={formData.contraception.toString()}
                onChange={(e) => setFormData({ ...formData, contraception: e.target.value === 'true' })}
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </label>
            {formData.contraception && (
              <label className={labelClasses}>
                What type of contraception?
                <select
                  className={inputClasses}
                  value={formData.contraceptionType || 'none'}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    contraceptionType: e.target.value as ContraceptionType 
                  })}
                >
                  <option value="none">None</option>
                  <option value="condom">Condom</option>
                  <option value="pill">Birth Control Pill</option>
                  <option value="iud">IUD</option>
                  <option value="withdrawal">Withdrawal Method</option>
                </select>
              </label>
            )}
            {formData.contraceptionType === 'withdrawal' && (
              <label className={labelClasses}>
                Did urination occur before?
                <select
                  className={inputClasses}
                  value={formData.urination?.toString() || 'false'}
                  onChange={(e) => setFormData({ ...formData, urination: e.target.value === 'true' })}
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </label>
            )}
            <div className="flex flex-col gap-2">
              <button onClick={() => setStep(6)} className={buttonClasses}>
                Next
              </button>
              <button onClick={() => setStep(4)} className={backButtonClasses}>
                Back
              </button>
            </div>
          </div>
        );

      case 6:
        if (formData.contraceptionType === 'withdrawal') {
          setStep(7);
          return null;
        }
        return (
          <div className="space-y-4">
            <label className={labelClasses}>
              Was the withdrawal method used?
              <select
                className={inputClasses}
                value={formData.withdrawal?.toString() || 'false'}
                onChange={(e) => setFormData({ ...formData, withdrawal: e.target.value === 'true' })}
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </label>
            {formData.withdrawal && (
              <label className={labelClasses}>
                Did urination occur before?
                <select
                  className={inputClasses}
                  value={formData.urination?.toString() || 'false'}
                  onChange={(e) => setFormData({ ...formData, urination: e.target.value === 'true' })}
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </label>
            )}
            <div className="flex flex-col gap-2">
              <button onClick={() => setStep(7)} className={buttonClasses}>
                Next
              </button>
              <button onClick={() => setStep(5)} className={backButtonClasses}>
                Back
              </button>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-4">
            <label className={labelClasses}>
              Did ejaculation occur inside?
              <select
                className={inputClasses}
                value={formData.finishInside.toString()}
                onChange={(e) => setFormData({ ...formData, finishInside: e.target.value === 'true' })}
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </label>
            <div className="flex flex-col gap-2">
              <button onClick={() => setStep(8)} className={buttonClasses}>
                Next
              </button>
              <button onClick={() => setStep(6)} className={backButtonClasses}>
                Back
              </button>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-4">
            <label className={labelClasses}>
              Are you taking fertility medications?
              <select
                className={inputClasses}
                value={formData.fertilityMeds.toString()}
                onChange={(e) => setFormData({ ...formData, fertilityMeds: e.target.value === 'true' })}
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </label>
            <div className="flex flex-col gap-2">
              <button onClick={() => setStep(9)} className={buttonClasses}>
                Next
              </button>
              <button onClick={() => setStep(7)} className={backButtonClasses}>
                Back
              </button>
            </div>
          </div>
        );

      case 9:
        return (
          <div className="space-y-4">
            <label className={labelClasses}>
              Number of previous pregnancies:
              <input
                type="number"
                min="0"
                className={inputClasses}
                value={formData.previousPregnancies}
                onChange={(e) => setFormData({ ...formData, previousPregnancies: parseInt(e.target.value) || 0 })}
              />
            </label>
            <div className="flex flex-col gap-2">
              <button onClick={() => setStep(10)} className={buttonClasses}>
                Next
              </button>
              <button onClick={() => setStep(8)} className={backButtonClasses}>
                Back
              </button>
            </div>
          </div>
        );

      case 10:
        return (
          <div className="space-y-4">
            <label className={labelClasses}>
              Do you have any known fertility issues?
              <select
                className={inputClasses}
                value={formData.fertilityIssues.toString()}
                onChange={(e) => setFormData({ ...formData, fertilityIssues: e.target.value === 'true' })}
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </label>
            <div className="flex flex-col gap-2">
              <button onClick={handleSubmit} className={buttonClasses}>
                Calculate
              </button>
              <button onClick={() => setStep(9)} className={backButtonClasses}>
                Back
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 sm:p-12 bg-gradient-to-br from-pink-50/90 via-white/80 to-purple-50/90 
                    backdrop-blur-md rounded-xl sm:rounded-2xl shadow-xl border border-pink-100 mb-12 sm:mb-20">
      {loading && <LoadingBar />}
      <ProgressIndicator currentStep={step} />
      {!result ? (
        renderQuestion()
      ) : (
        <div className="space-y-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Results</h2>
          <div className="space-y-2">
            <p className="text-6xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              {result.percentage}%
            </p>
            <p className="text-xl text-gray-700">
              <strong>Risk Level:</strong> {result.riskLevel}
            </p>
          </div>
          <div className="text-left space-y-4 text-gray-600">
            {result.explanation.split('. ').reduce((acc: string[], sentence: string, i: number) => {
              if (i < result.explanation.split('. ').length / 2) {
                acc[0] = acc[0] ? acc[0] + '. ' + sentence : sentence;
              } else {
                acc[1] = acc[1] ? acc[1] + '. ' + sentence : sentence;
              }
              return acc;
            }, []).map((paragraph, index) => (
              <p key={index}>{paragraph}.</p>
            ))}
          </div>
          <button
            onClick={() => {
              setStep(1);
              setResult(null);
              setFormData({
                age: 0,
                hasPeriods: true,
                cycleLength: 28,
                periodStart: '',
                periodEnd: '',
                isCurrentlyMenstruating: false,
                sexDate: '',
                timeOfDay: '',
                contraception: false,
                finishInside: false,
                fertilityMeds: false,
                previousPregnancies: 0,
                fertilityIssues: false,
                medications: [],
              });
            }}
            className={buttonClasses}
          >
            Calculate Again
          </button>
        </div>
      )}
    </div>
  );
}