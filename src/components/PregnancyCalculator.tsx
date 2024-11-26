'use client';

import { useState } from 'react';
import type { ContraceptionType } from '../lib/fertilityData';

type FormData = {
  age: number;
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

const inputClasses = "input-seamless";
const labelClasses = "question-label";
const buttonClasses = "w-full bg-[#8b7355] hover:bg-[#6d5a43] text-white px-6 py-4 rounded-xl text-xl font-medium transition duration-300 shadow-lg hover:shadow-xl";
const backButtonClasses = "w-full mt-2 bg-transparent border-2 border-[#8b7355] text-[#8b7355] hover:bg-[#8b7355] hover:text-white px-6 py-4 rounded-xl text-xl font-medium transition duration-300";

const LoadingBar = () => (
  <div className="fixed top-0 left-0 w-full h-1 bg-[#e8d5c4]">
    <div className="h-full bg-[#8b7355] animate-loading-bar"></div>
  </div>
);

export default function PregnancyCalculator() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    age: 0,
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
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to calculate probability');
      }
      const data = await response.json();
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
          <div className="question-container">
            <label className={labelClasses}>
              What is your age?
              <input
                type="number"
                min="18"
                max="100"
                className={inputClasses}
                value={formData.age || ''}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  if (value >= 18 || value === 0) {
                    setFormData({ ...formData, age: value });
                  }
                }}
              />
            </label>
            <button
              onClick={() => setStep(2)}
              className={buttonClasses}
            >
              Next
            </button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <label className={labelClasses}>
              When did your last period start?
              <input
                type="date"
                className={inputClasses}
                value={formData.periodStart}
                onChange={(e) => setFormData({ ...formData, periodStart: e.target.value })}
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
                <input
                  type="date"
                  className={inputClasses}
                  value={formData.periodEnd}
                  onChange={(e) => setFormData({ ...formData, periodEnd: e.target.value })}
                />
              </label>
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
              <input
                type="date"
                className={inputClasses}
                value={formData.sexDate}
                onChange={(e) => setFormData({ ...formData, sexDate: e.target.value })}
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
    <div className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-white/30 via-white/20 to-transparent backdrop-blur-md rounded-2xl shadow-2xl border border-white/20">
      <h1 className="text-4xl font-bold mb-8 text-[#4a3f35] tracking-tight">Pregnancy Probability Calculator</h1>
      {loading && <LoadingBar />}
      {!result ? (
        renderQuestion()
      ) : (
        <div className="space-y-8 text-center">
          <h2 className="text-2xl font-bold text-[#4a3f35]">Results</h2>
          <div className="space-y-2">
            <p className="text-6xl font-bold text-[#8b7355]">{result.percentage}%</p>
            <p className="text-xl text-[#4a3f35]"><strong>Risk Level:</strong> {result.riskLevel}</p>
          </div>
          <div className="text-left space-y-4 text-[#4a3f35]">
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