import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { User, Phone, BookOpen, Heart, Image as ImageIcon } from 'lucide-react';
import { PledgeData } from '../types';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

enum OperationType {
  CREATE = 'create',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  };
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface PledgeFormProps {
  onSubmit: (data: PledgeData) => void;
}

export function PledgeForm({ onSubmit }: PledgeFormProps) {
  const [formData, setFormData] = useState({
    candidateName: '',
    fatherName: '',
    targetExam: '',
    phoneNumber: '',
  });

  const [customExam, setCustomExam] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const finalTargetExam = formData.targetExam === 'Other' ? customExam : formData.targetExam;

    const pledgeData = {
      ...formData,
      targetExam: finalTargetExam,
      photoUrl,
      pledgeDate: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    };

    try {
      await addDoc(collection(db, 'leads'), {
        candidateName: formData.candidateName,
        fatherName: formData.fatherName,
        targetExam: finalTargetExam,
        phoneNumber: formData.phoneNumber,
        createdAt: serverTimestamp(),
      });
      onSubmit(pledgeData);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'leads');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const commonExams = [
    'SBI PO',
    'IBPS PO',
    'SSC CGL',
    'UPSC CSE',
    'RBI Grade B',
    'RRB NTPC',
    'State PCS',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full mx-auto p-6 sm:p-8 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-orange-100"
    >
      <div className="text-center mb-6 sm:mb-8">
        <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-[#EB3237] mx-auto mb-3 sm:mb-4" />
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-800 mb-2">
          The First Salary Pledge
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm px-2">
          A promise to make him proud. Generate your pledge card now.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Your Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              name="candidateName"
              required
              placeholder="E.g., Arjun Sharma"
              value={formData.candidateName}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#EB3237] focus:border-[#EB3237] bg-slate-50 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Father's Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              name="fatherName"
              required
              placeholder="E.g., Mr. Rajesh Sharma"
              value={formData.fatherName}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#EB3237] focus:border-[#EB3237] bg-slate-50 transition-colors"
            />
          </div>
        </div>

        <div>
           <label className="block text-sm font-medium text-slate-700 mb-1">
            Target Exam
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <BookOpen className="h-5 w-5 text-slate-400" />
            </div>
            <select
              name="targetExam"
              required
              value={formData.targetExam}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#EB3237] focus:border-[#EB3237] bg-slate-50 transition-colors"
            >
              <option value="" disabled>Select your target exam</option>
              {commonExams.map((exam) => (
                <option key={exam} value={exam}>{exam}</option>
              ))}
              <option value="Other">Other</option>
            </select>
          </div>
          {formData.targetExam === 'Other' && (
            <div className="mt-3 relative animate-in fade-in slide-in-from-top-2 duration-300">
              <input
                type="text"
                required
                placeholder="Type your exam name"
                value={customExam}
                onChange={(e) => setCustomExam(e.target.value)}
                className="block w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#EB3237] focus:border-[#EB3237] bg-slate-50 transition-colors"
               />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Phone Number <span className="text-slate-400 font-normal">(for study tips)</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="tel"
              name="phoneNumber"
              required
              pattern="[0-9]{10}"
              placeholder="10-digit mobile number"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#EB3237] focus:border-[#EB3237] bg-slate-50 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Photo with Dad <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <div 
            className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md cursor-pointer hover:border-[#EB3237] transition-colors bg-slate-50 relative overflow-hidden"
            onClick={() => fileInputRef.current?.click()}
          >
            {photoUrl ? (
              <img src={photoUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60" />
            ) : null}
            <div className="space-y-1 text-center relative z-10">
              <ImageIcon className="mx-auto h-8 w-8 text-slate-400" />
              <div className="flex justify-center text-sm text-slate-600">
                <span className="relative cursor-pointer bg-white/80 rounded-md font-medium text-[#EB3237] hover:text-[#D32F2F] focus-within:outline-none px-1">
                  Upload a photo
                </span>
                <p className="pl-1 bg-white/80 rounded-md">or drag and drop</p>
              </div>
              <p className="text-xs text-slate-500 bg-white/80 rounded-md inline-block px-1">PNG, JPG, up to 10MB</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handlePhotoUpload}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#EB3237] hover:bg-[#D32F2F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all active:scale-[0.98] mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Generating...' : 'Generate Pledge Card'}
        </button>
      </form>
    </motion.div>
  );
}
