'use client';

import { useState } from 'react';

type FormData = {
  age: number;
  cycleLength: number;
  periodStart: string;
  periodEnd: string;
  isCurrentlyMenstruating: boolean;
  sexDate: string;
  timeOfDay: string;
  contraception: boolean;
  contraceptionType?: string;
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

const inputClasses = "mt-1 block w-full rounded-md border-gray-300 shadow-sm text-black";
const labelClasses = "block text-black";

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
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setResult(data);
    } catch (error) {
      console.error('Error calculating probability:', error);
      alert('Failed to calculate probability. Please try again.');
    }
    setLoading(false);
  };

  const renderQuestion = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <label className={labelClasses}>
              What is your age?
              <input
                type="number"
                min="0"
                max="100"
                className={inputClasses}
                value={formData.age || ''}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
              />
            </label>
            <button
              onClick={() => setStep(2)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
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
            <button onClick={() => setStep(3)} className="bg-blue-500 text-white px-4 py-2 rounded">
              Next
            </button>
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
            <button
              onClick={() => setStep(4)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Next
            </button>
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
            <button
              onClick={() => setStep(5)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Next
            </button>
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
                  value={formData.contraceptionType || ''}
                  onChange={(e) => setFormData({ ...formData, contraceptionType: e.target.value })}
                >
                  <option value="">Select type...</option>
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
            <button onClick={() => setStep(6)} className="bg-blue-500 text-white px-4 py-2 rounded">
              Next
            </button>
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
            <button onClick={() => setStep(7)} className="bg-blue-500 text-white px-4 py-2 rounded">
              Next
            </button>
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
            <button onClick={() => setStep(8)} className="bg-blue-500 text-white px-4 py-2 rounded">
              Next
            </button>
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
            <button onClick={() => setStep(9)} className="bg-blue-500 text-white px-4 py-2 rounded">
              Next
            </button>
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
            <button onClick={() => setStep(10)} className="bg-blue-500 text-white px-4 py-2 rounded">
              Next
            </button>
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
            <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
              Calculate
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-black">Pregnancy Probability Calculator</h1>
      {!result ? (
        renderQuestion()
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-black">Results</h2>
          <div className="text-black">
            <p className="text-lg">Probability of Pregnancy: <span className="font-bold">{result.percentage}%</span></p>
            <p className="text-lg">Risk Level: <span className="font-semibold">{result.riskLevel}</span></p>
            <p className="mt-4">{result.explanation}</p>
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
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Calculate Again
          </button>
        </div>
      )}
      {loading && <div className="text-center mt-4 text-black">Calculating...</div>}
    </div>
  );
}
